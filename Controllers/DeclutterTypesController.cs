#if !NET8_0
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using Umbraco.Cms.Api.Management.Routing;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.Blocks;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Web.Common.Authorization;
using Umbraco.Extensions;
using SystemFile = System.IO.File;

namespace DigitalWonderlab.DeclutterTypes.Controllers;

[ApiController]
[VersionedApiBackOfficeRoute("decluttertypes")]
[ApiExplorerSettings(GroupName = "Declutter Types")]
[Authorize(Policy = AuthorizationPolicies.BackOfficeAccess)]
public class DeclutterTypesController(
    IWebHostEnvironment env,
    IMediaService mediaService,
    IEntityService entityService,
    IPublishedValueFallback publishedValueFallback,
    ILogger<DeclutterTypesController> logger,
    IPublishedContentQuery publishedContentQuery,
    IDataTypeService dataTypeService,
    IContentTypeService contentTypeService) : ControllerBase
{
    private readonly IWebHostEnvironment _env = env;
    private readonly IMediaService _mediaService = mediaService;
    private readonly IEntityService _entityService = entityService;
    private readonly IPublishedValueFallback _publishedValueFallback = publishedValueFallback;
    private readonly ILogger<DeclutterTypesController> _logger = logger;
    private readonly IPublishedContentQuery _publishedContentQuery = publishedContentQuery;
    private readonly IDataTypeService _dataTypeService = dataTypeService;
    private readonly IContentTypeService _contentTypeService = contentTypeService;
    private Dictionary<int, bool> _dataTypesInUse = [];
    private List<int> _thirdPartyDataTypesWithoutValue = [];
    private Dictionary<Guid, bool> _documentTypesInUse = [];
    private IEnumerable<IContentType> _documentTypeList = [];
    private IEnumerable<IDataType> _dataTypeList = [];
    private readonly string[] _knownUmbracoEditorAliases =
        ["Umbraco.TextBox",
        "Umbraco.TrueFalse",
        "Umbraco.TinyMCE",
        "Umbraco.DropDown.Flexible",
        "Umbraco.MultiNodeTreePicker",
        "Umbraco.Slider",
        "Umbraco.MultiUrlPicker",
        "Umbraco.MediaPicker3",
        "Umbraco.BlockList",
        "Umbraco.BlockGrid",
        "Umbraco.NestedContent",
        "Umbraco.DateTime",
        "Umbraco.ColorPicker",
        "Umbraco.ContentPicker",
        "Umbraco.Tags",
        "Umbraco.TextArea",
        "Umbraco.Integer",
        "Umbraco.MultipleTextstring",
        "Umbraco.UploadField",
        "Umbraco.Label",
        "Umbraco.ListView",
        "Umbraco.CheckBoxList",
        "Umbraco.RadioButtonList",
        "Umbraco.MediaPicker",
    ];

    [HttpGet("GetSavedValues")]
    [MapToApiVersion("1.0")]
    [ProducesResponseType<TypeUsageResponse>(StatusCodes.Status200OK)]
    public IActionResult GetSavedValues()
    {
        var dataTypeUsage = RetrieveTypeUsageJson("dataTypes");
        var documentTypeUsage = RetrieveTypeUsageJson("documentTypes");
        var umbracoDataTypes = RetrieveTypeUsageJson("umbracoDataTypes");
        var thirdPartyUsage = RetrieveTypeUsageJson("thirdPartyDataTypes");
        TypeUsageResult? result = null;
        if (SystemFile.Exists(_env.WebRootPath + $"/DeclutterTypes/typeUsageResult.json"))
        {
            var outputJson = SystemFile.ReadAllText(_env.WebRootPath + $"/DeclutterTypes/typeUsageResult.json");
            result = JsonSerializer.Deserialize<TypeUsageResult>(outputJson);
        }

        if (dataTypeUsage != null && documentTypeUsage != null && umbracoDataTypes != null && thirdPartyUsage != null && result != null)
        {
            return Ok(new TypeUsageResponse
            {
                IsSuccess = true,
                DataTypes = dataTypeUsage,
                DocumentTypes = documentTypeUsage,
                UmbracoDataTypes = umbracoDataTypes,
                ThirdPartyDataTypes = thirdPartyUsage,
                TypeUsageResult = result
            });
        }
        return Ok(new TypeUsageResponse { IsSuccess = false });
    }

    [HttpGet("GetValues")]
    [MapToApiVersion("1.0")]
    [ProducesResponseType<TypeUsageResponse>(StatusCodes.Status200OK)]
    public IActionResult GetValues([FromQuery] bool isSaving = false)
    {
        try
        {
            _dataTypesInUse = [];
            _documentTypesInUse = [];
            _documentTypeList = [];
            _thirdPartyDataTypesWithoutValue = [];

            _documentTypeList = _contentTypeService.GetAll();
            _documentTypesInUse = _documentTypeList.ToDictionary(dt => dt.Key, dt => false);
            _dataTypeList = _dataTypeService.GetAll();
            _dataTypesInUse = _dataTypeList.ToDictionary(dt => dt.Id, dt => false);

            _publishedContentQuery.ContentAtRoot().ToList().ForEach(ScanContentRecursive);
            _publishedContentQuery.MediaAtRoot().ToList().ForEach(ScanMediaRecursive);

            var nonInUseDataKeys = _dataTypesInUse.Where(m => !m.Value).Select(m => m.Key);
            var dataTypesNotInUse = _dataTypeList.ToList().Where(dt => nonInUseDataKeys.Contains(dt.Id)).ToList();

            var thirdPartyDataTypes = dataTypesNotInUse.Where(m => !_knownUmbracoEditorAliases.Contains(m.EditorAlias)).ToList();
            dataTypesNotInUse.RemoveAll(thirdPartyDataTypes.Contains);

            var dataTypeUsages = dataTypesNotInUse.Select(m => new TypeUsage(m.Id, m.Key.ToString(), m.Name!, FormulatePath(m.Path), "dataType"));

            var umbracoDataTypes = dataTypeUsages.Where(dt => dt.Id < 0);
            dataTypeUsages = dataTypeUsages.Where(dt => dt.Id > 0);
            dataTypeUsages = dataTypeUsages.Where(dt => !_thirdPartyDataTypesWithoutValue.Contains(dt.Id));

            var thirdPartyUsage = thirdPartyDataTypes.Select(m => new TypeUsage(m.Id, m.Key.ToString(), m.Name!, FormulatePath(m.Path), "dataType"));

            IEnumerable<TypeUsage> documentTypeUsages = DetermineDocumentTypeResult();

            TypeUsageResult typeUsageResult = new()
            {
                DataTypes = dataTypeUsages.Count(),
                DocumentTypes = documentTypeUsages.Count(),
                UmbracoDataTypes = umbracoDataTypes.Count(),
                ThirdPartyDataTypes = thirdPartyUsage.Count()
            };
            if (isSaving)
            {
                SaveJson(JsonSerializer.Serialize(dataTypeUsages), "dataTypes");
                SaveJson(JsonSerializer.Serialize(documentTypeUsages), "documentTypes");
                SaveJson(JsonSerializer.Serialize(umbracoDataTypes), "umbracoDataTypes");
                SaveJson(JsonSerializer.Serialize(thirdPartyUsage), "thirdPartyDataTypes");
                SaveJson(JsonSerializer.Serialize(typeUsageResult), "typeUsageResult");
            }

            return Ok(new TypeUsageResponse
            {
                IsSuccess = true,
                DataTypes = [.. dataTypeUsages],
                DocumentTypes = [.. documentTypeUsages],
                UmbracoDataTypes = [.. umbracoDataTypes],
                ThirdPartyDataTypes = [.. thirdPartyUsage],
                TypeUsageResult = typeUsageResult
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving Declutter Types values");
            return Ok(new TypeUsageResponse { IsSuccess = false });
        }
    }

    private void ScanContentRecursive(IPublishedContent content)
    {
        ScanContent(content);
        foreach (var child in content.Children)
            ScanContentRecursive(child);
    }

    private void ScanMediaRecursive(IPublishedContent content)
    {
        ScanContent(content, true);
        foreach (var child in content.Children)
            ScanMediaRecursive(child);
    }

    private void ScanContent(IPublishedContent content, bool isMedia = false)
    {
        if (!isMedia)
        {
            _documentTypesInUse[content.ContentType.Key] = true;
            CheckCompositionAliases(content.ContentType.CompositionAliases);
        }
        foreach (IPublishedProperty property in content.Properties)
            ScanProperty(property);
    }

    private void CheckCompositionAliases(HashSet<string> compositionAliases)
    {
        foreach (string alias in compositionAliases)
            _documentTypesInUse[_documentTypeList.First(m => m.Alias == alias).Key] = true;
    }

    private void ScanProperty(IPublishedProperty property)
    {
        if (property.HasValue())
        {
            _dataTypesInUse[property.PropertyType.DataType.Id] = true;
            if (property.PropertyType.DataType.EditorAlias == "Umbraco.BlockList" && property.Value(_publishedValueFallback) is BlockListModel blockListModel)
            {
                foreach (BlockListItem block in blockListModel)
                    ScanBlockItem(block);
            }
            else if (property.PropertyType.DataType.EditorAlias == "Umbraco.BlockGrid" && property.Value(_publishedValueFallback) is BlockGridModel blockGridModel)
            {
                foreach (BlockGridItem block in blockGridModel)
                    ScanBlockItem(block);
            }
            else if (property.PropertyType.DataType.EditorAlias == "Umbraco.NestedContent" && property.Value(_publishedValueFallback) is List<IPublishedElement> nestedContentList)
            {
                foreach (var nestedItem in nestedContentList)
                    ScanElement(nestedItem);
            }
        }
    }

    private void ScanBlockItem(IBlockReference<IPublishedElement, IPublishedElement> block)
    {
        if (block.Content.ContentType != null)
        {
            _documentTypesInUse[block.Content.ContentType.Key] = true;
            CheckCompositionAliases(block.Content.ContentType.CompositionAliases);
        }
        if (block.Settings != null)
            ScanElement(block.Settings);
        foreach (var blockProperty in block.Content.Properties)
            ScanProperty(blockProperty);
    }

    private void ScanElement(IPublishedElement element)
    {
        if (element.ContentType != null)
        {
            _documentTypesInUse[element.ContentType.Key] = true;
            CheckCompositionAliases(element.ContentType.CompositionAliases);
        }
        foreach (var settingsProperty in element.Properties)
            ScanProperty(settingsProperty);
    }

    private IEnumerable<TypeUsage> DetermineDocumentTypeResult()
    {
        var nonInUseDocTypeKeys = _documentTypesInUse.Where(m => !m.Value).Select(m => m.Key);
        var documentTypesNotInUse = _documentTypeList.ToList().Where(dt => nonInUseDocTypeKeys.Contains(dt.Key)).ToList();
        return documentTypesNotInUse.Select(m => new TypeUsage(m.Id, m.Key.ToString(), m.Name!, FormulatePath(m.Path), "documentType"));
    }

    private string?[] FormulatePath(string path)
    {
        return [.. path.Split(',')
                .Select(GetNodeNameById)
                .Where(name => name != null)];
    }

    private string? GetNodeNameById(string idStr)
    {
        if (!int.TryParse(idStr, out var id)) return null;
        if (id == -1) return "Root";
        var container = _entityService.Get(id);
        return container?.Name;
    }

    private void SaveJson(string json, string fileName)
    {
        if (!Directory.Exists(_env.WebRootPath + "/DeclutterTypes"))
            Directory.CreateDirectory(_env.WebRootPath + "/DeclutterTypes");
        if (SystemFile.Exists(_env.WebRootPath + $"/DeclutterTypes/{fileName}.json"))
            SystemFile.Delete(_env.WebRootPath + $"/DeclutterTypes/{fileName}.json");
        SystemFile.WriteAllText(_env.WebRootPath + $"/DeclutterTypes/{fileName}.json", json);
    }

    private TypeUsage[]? RetrieveTypeUsageJson(string fileName)
    {
        if (!Directory.Exists(_env.WebRootPath + "/DeclutterTypes"))
            Directory.CreateDirectory(_env.WebRootPath + "/DeclutterTypes");
        if (SystemFile.Exists(_env.WebRootPath + $"/DeclutterTypes/{fileName}.json"))
        {
            var outputJson = SystemFile.ReadAllText(_env.WebRootPath + $"/DeclutterTypes/{fileName}.json");
            return JsonSerializer.Deserialize<TypeUsage[]>(outputJson);
        }
        return null;
    }
}

public record TypeUsage(int Id, string GUID, string Name, string?[] Path, string Type);

public class TypeUsageResponse
{
    public bool IsSuccess { get; set; }
    public TypeUsage[] DataTypes { get; set; } = [];
    public TypeUsage[] DocumentTypes { get; set; } = [];
    public TypeUsage[] UmbracoDataTypes { get; set; } = [];
    public TypeUsage[] ThirdPartyDataTypes { get; set; } = [];
    public TypeUsageResult TypeUsageResult { get; set; } = new();
}

public class TypeUsageResult
{
    public int DataTypes { get; set; } = 0;
    public int DocumentTypes { get; set; } = 0;
    public int UmbracoDataTypes { get; set; } = 0;
    public int ThirdPartyDataTypes { get; set; } = 0;
}
#endif
