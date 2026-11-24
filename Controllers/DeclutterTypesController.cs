#if !NET8_0
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Nodes;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Umbraco.Cms.Api.Management.Routing;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Web.Common.Authorization;
using SystemFile = System.IO.File;

namespace DigitalWonderlab.DeclutterTypes.Controllers;

/// <summary>
/// Finds document types and data types that nothing uses.
///
/// Everything is read from the stored (database) values rather than the published cache, so:
/// <list type="bullet">
/// <item>unpublished content and unpublished changes are seen, and reported separately;</item>
/// <item>blocks are found however they are stored: Block List (including single block mode),
/// Block Grid, blocks inside a rich text editor, nested blocks and legacy Nested Content;</item>
/// <item>members are scanned as well as content and media.</item>
/// </list>
/// List views chosen as a type's collection view count as in use.
/// </summary>
[ApiController]
[VersionedApiBackOfficeRoute("decluttertypes")]
[ApiExplorerSettings(GroupName = "Declutter Types")]
[Authorize(Policy = AuthorizationPolicies.BackOfficeAccess)]
public class DeclutterTypesController(
    IWebHostEnvironment env,
    IContentService contentService,
    IMediaService mediaService,
    IMemberService memberService,
    IEntityService entityService,
    ILogger<DeclutterTypesController> logger,
    IDataTypeService dataTypeService,
    IContentTypeService contentTypeService,
    IMediaTypeService mediaTypeService,
    IMemberTypeService memberTypeService) : ControllerBase
{
    private const int PageSize = 500;

    private readonly IWebHostEnvironment _env = env;
    private readonly IContentService _contentService = contentService;
    private readonly IMediaService _mediaService = mediaService;
    private readonly IMemberService _memberService = memberService;
    private readonly IEntityService _entityService = entityService;
    private readonly ILogger<DeclutterTypesController> _logger = logger;
    private readonly IDataTypeService _dataTypeService = dataTypeService;
    private readonly IContentTypeService _contentTypeService = contentTypeService;
    private readonly IMediaTypeService _mediaTypeService = mediaTypeService;
    private readonly IMemberTypeService _memberTypeService = memberTypeService;

    // Usage is tracked twice: anywhere (including unpublished content and unpublished changes)
    // and in published content only. The difference is the "used only in unpublished" group.
    private readonly HashSet<Guid> _documentTypesUsed = [];
    private readonly HashSet<Guid> _documentTypesPublished = [];
    private readonly HashSet<int> _dataTypesUsed = [];
    private readonly HashSet<int> _dataTypesPublished = [];

    private Dictionary<Guid, IContentType> _contentTypesByKey = [];
    private Dictionary<string, IContentType> _contentTypesByAlias = [];
    private List<IDataType> _dataTypeList = [];

    [HttpGet("GetSavedValues")]
    [MapToApiVersion("1.0")]
    [ProducesResponseType<TypeUsageResponse>(StatusCodes.Status200OK)]
    public IActionResult GetSavedValues()
    {
        var dataTypeUsage = RetrieveTypeUsageJson("dataTypes");
        var documentTypeUsage = RetrieveTypeUsageJson("documentTypes");
        var umbracoDataTypes = RetrieveTypeUsageJson("umbracoDataTypes");
        var thirdPartyUsage = RetrieveTypeUsageJson("thirdPartyDataTypes");
        // Saves from before this group existed have no file; treat that as empty.
        var unpublishedOnly = RetrieveTypeUsageJson("unpublishedOnlyTypes") ?? [];
        TypeUsageResult? result = null;
        if (SystemFile.Exists(_env.WebRootPath + "/DeclutterTypes/typeUsageResult.json"))
        {
            var outputJson = SystemFile.ReadAllText(_env.WebRootPath + "/DeclutterTypes/typeUsageResult.json");
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
                UnpublishedOnlyTypes = unpublishedOnly,
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
            var contentTypes = _contentTypeService.GetAll().ToList();
            var mediaTypes = _mediaTypeService.GetAll().ToList();
            var memberTypes = _memberTypeService.GetAll().ToList();
            _contentTypesByKey = contentTypes.ToDictionary(ct => ct.Key);
            _contentTypesByAlias = contentTypes.ToDictionary(ct => ct.Alias, StringComparer.OrdinalIgnoreCase);
            _dataTypeList = _dataTypeService.GetAll().ToList();

            MarkCollectionViews(contentTypes.Cast<IContentTypeComposition>().Concat(mediaTypes));
            ScanAllContent();
            ScanAllMedia();
            ScanAllMembers();

            var propertiesByDataType = PropertiesByDataType(contentTypes.Cast<IContentTypeComposition>().Concat(mediaTypes).Concat(memberTypes));
            var blockConfigsByElementKey = BlockConfigsByElementKey();

            // ----- Data types -----
            var dataTypesNotUsed = _dataTypeList.Where(dt => !_dataTypesUsed.Contains(dt.Id)).ToList();
            var thirdPartyDataTypes = dataTypesNotUsed.Where(dt => !IsCoreEditor(dt.EditorAlias)).ToList();
            var coreDataTypes = dataTypesNotUsed.Except(thirdPartyDataTypes).ToList();

            var dataTypeUsages = coreDataTypes.Where(dt => dt.Id > 0).Select(dt => ToUsage(dt, propertiesByDataType)).ToList();
            var umbracoDataTypes = coreDataTypes.Where(dt => dt.Id < 0).Select(dt => ToUsage(dt, propertiesByDataType)).ToList();
            var thirdPartyUsage = thirdPartyDataTypes.Select(dt => ToUsage(dt, propertiesByDataType)).ToList();

            // ----- Document types -----
            var documentTypeUsages = contentTypes
                .Where(ct => !_documentTypesUsed.Contains(ct.Key))
                .Select(ct => new TypeUsage(ct.Id, ct.Key.ToString(), ct.Name!, FormulatePath(ct.Path), "documentType",
                    DescribeDocumentTypeLinks(ct, contentTypes, blockConfigsByElementKey)))
                .ToList();

            // ----- Used only in unpublished content or unpublished changes -----
            const string unpublishedDetail = "Used only in unpublished content or unpublished changes";
            var unpublishedOnly = contentTypes
                .Where(ct => _documentTypesUsed.Contains(ct.Key) && !_documentTypesPublished.Contains(ct.Key))
                .Select(ct => new TypeUsage(ct.Id, ct.Key.ToString(), ct.Name!, FormulatePath(ct.Path), "documentType", unpublishedDetail))
                .Concat(_dataTypeList
                    .Where(dt => _dataTypesUsed.Contains(dt.Id) && !_dataTypesPublished.Contains(dt.Id))
                    .Select(dt => new TypeUsage(dt.Id, dt.Key.ToString(), dt.Name!, FormulatePath(dt.Path), "dataType", unpublishedDetail)))
                .ToList();

            TypeUsageResult typeUsageResult = new()
            {
                DataTypes = dataTypeUsages.Count,
                DocumentTypes = documentTypeUsages.Count,
                UmbracoDataTypes = umbracoDataTypes.Count,
                ThirdPartyDataTypes = thirdPartyUsage.Count,
                UnpublishedOnlyTypes = unpublishedOnly.Count
            };

            if (isSaving)
            {
                SaveJson(JsonSerializer.Serialize(dataTypeUsages), "dataTypes");
                SaveJson(JsonSerializer.Serialize(documentTypeUsages), "documentTypes");
                SaveJson(JsonSerializer.Serialize(umbracoDataTypes), "umbracoDataTypes");
                SaveJson(JsonSerializer.Serialize(thirdPartyUsage), "thirdPartyDataTypes");
                SaveJson(JsonSerializer.Serialize(unpublishedOnly), "unpublishedOnlyTypes");
                SaveJson(JsonSerializer.Serialize(typeUsageResult), "typeUsageResult");
            }

            return Ok(new TypeUsageResponse
            {
                IsSuccess = true,
                DataTypes = [.. dataTypeUsages],
                DocumentTypes = [.. documentTypeUsages],
                UmbracoDataTypes = [.. umbracoDataTypes],
                ThirdPartyDataTypes = [.. thirdPartyUsage],
                UnpublishedOnlyTypes = [.. unpublishedOnly],
                TypeUsageResult = typeUsageResult
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving Declutter Types values");
            return Ok(new TypeUsageResponse { IsSuccess = false });
        }
    }

    // ===== Scanning =========================================================================

    private void ScanAllContent()
    {
        long page = 0, total;
        do
        {
            foreach (var content in _contentService.GetPagedDescendants(-1, page, PageSize, out total))
            {
                // Content in the recycle bin goes when its type is deleted, so it does not count.
                if (content.Trashed)
                {
                    continue;
                }

                MarkDocumentType(content.ContentType.Key, published: content.Published);
                foreach (var property in content.Properties)
                {
                    ScanContentProperty(property, content.Published);
                }
            }
            page++;
        }
        while (page * PageSize < total);
    }

    private void ScanAllMedia()
    {
        long page = 0, total;
        do
        {
            foreach (var media in _mediaService.GetPagedDescendants(-1, page, PageSize, out total))
            {
                if (media.Trashed)
                {
                    continue;
                }

                foreach (var property in media.Properties)
                {
                    ScanLiveProperty(property);
                }
            }
            page++;
        }
        while (page * PageSize < total);
    }

    private void ScanAllMembers()
    {
        long page = 0, total;
        do
        {
            foreach (var member in _memberService.GetAll(page, PageSize, out total, "Name", Umbraco.Cms.Core.Direction.Ascending, true, null, string.Empty))
            {
                foreach (var property in member.Properties)
                {
                    ScanLiveProperty(property);
                }
            }
            page++;
        }
        while (page * PageSize < total);
    }

    /// <summary>
    /// Marks the property's data type from each culture and segment value, and walks any blocks
    /// inside it.
    /// </summary>
    private void ScanContentProperty(IProperty property, bool contentIsPublished)
    {
        var dataTypeId = property.PropertyType.DataTypeId;
        foreach (var value in property.Values)
        {
            // What visitors see.
            if (contentIsPublished && HasValue(value.PublishedValue))
            {
                MarkDataType(dataTypeId, published: true);
                ScanBlocks(value.PublishedValue, published: true);
            }

            // Unpublished content, or an unpublished change to published content.
            if (HasValue(value.EditedValue) && !(contentIsPublished && Equals(value.EditedValue, value.PublishedValue)))
            {
                MarkDataType(dataTypeId, published: false);
                ScanBlocks(value.EditedValue, published: false);
            }
        }
    }

    /// <summary>Media and members have no published state: the saved value is the live value.</summary>
    private void ScanLiveProperty(IProperty property)
    {
        foreach (var value in property.Values)
        {
            if (HasValue(value.EditedValue))
            {
                MarkDataType(property.PropertyType.DataTypeId, published: true);
                ScanBlocks(value.EditedValue, published: true);
            }
        }
    }

    /// <summary>
    /// Walks any block data inside a stored value. The stored JSON has the same shape for Block
    /// List (single block mode included), Block Grid and rich text blocks: objects with a
    /// "contentTypeKey" and a "values" array. Nested blocks are JSON inside a value, sometimes
    /// as an escaped string, so values are walked recursively. Legacy Nested Content uses
    /// "ncContentTypeAlias" with the properties alongside it.
    /// </summary>
    private void ScanBlocks(object? value, bool published)
    {
        if (value is not string text || !LooksLikeBlockJson(text))
        {
            return;
        }

        JsonNode? node;
        try
        {
            node = JsonNode.Parse(text);
        }
        catch (JsonException)
        {
            return;
        }

        WalkJson(node, published, depth: 0);
    }

    private void WalkJson(JsonNode? node, bool published, int depth)
    {
        if (node is null || depth > 64)
        {
            return;
        }

        switch (node)
        {
            case JsonObject obj:
                if (obj.TryGetPropertyValue("contentTypeKey", out var keyNode) && Guid.TryParse(keyNode?.ToString(), out var elementKey))
                {
                    ScanBlockItem(obj, _contentTypesByKey.GetValueOrDefault(elementKey), elementKey, published, depth);
                }
                else if (obj.TryGetPropertyValue("ncContentTypeAlias", out var aliasNode)
                         && aliasNode?.ToString() is { } ncAlias
                         && _contentTypesByAlias.TryGetValue(ncAlias, out var ncType))
                {
                    ScanBlockItem(obj, ncType, ncType.Key, published, depth);
                }
                else
                {
                    foreach (var (_, child) in obj)
                    {
                        WalkJson(child, published, depth + 1);
                    }
                }
                break;

            case JsonArray array:
                foreach (var item in array)
                {
                    WalkJson(item, published, depth + 1);
                }
                break;

            case JsonValue jsonValue when jsonValue.TryGetValue<string>(out var inner) && LooksLikeBlockJson(inner):
                try
                {
                    WalkJson(JsonNode.Parse(inner), published, depth + 1);
                }
                catch (JsonException)
                {
                    // Not JSON after all.
                }
                break;
        }
    }

    private void ScanBlockItem(JsonObject block, IContentType? elementType, Guid elementKey, bool published, int depth)
    {
        MarkDocumentType(elementKey, published);

        // Current format: "values": [{ "alias": "...", "value": ... }].
        // Older formats keep the property values directly on the block object.
        IEnumerable<(string Alias, JsonNode? Value)> values = block["values"] is JsonArray valueArray
            ? valueArray.OfType<JsonObject>().Select(v => (v["alias"]?.ToString() ?? string.Empty, v["value"]))
            : block.Where(p => p.Key is not ("contentTypeKey" or "ncContentTypeAlias" or "udi" or "key" or "key2"))
                   .Select(p => (p.Key, p.Value));

        foreach (var (alias, value) in values)
        {
            if (!HasValue(value))
            {
                continue;
            }

            var propertyType = elementType?.CompositionPropertyTypes.FirstOrDefault(p => p.Alias.Equals(alias, StringComparison.OrdinalIgnoreCase));
            if (propertyType != null)
            {
                MarkDataType(propertyType.DataTypeId, published);
            }

            WalkJson(value, published, depth + 1);
        }
    }

    private static bool LooksLikeBlockJson(string text)
    {
        var trimmed = text.TrimStart();
        return trimmed.Length > 1
            && (trimmed[0] == '{' || trimmed[0] == '[')
            && (text.Contains("contentTypeKey", StringComparison.Ordinal) || text.Contains("ncContentTypeAlias", StringComparison.Ordinal));
    }

    // Three separate names on purpose: string converts implicitly to JsonNode, so overloads of
    // one name would resolve a string back to the JsonNode version and recurse forever.
    private static bool HasValue(object? value) => value switch
    {
        null => false,
        string s => HasText(s),
        JsonNode node => HasJsonValue(node),
        _ => true,
    };

    private static bool HasJsonValue(JsonNode? node) => node switch
    {
        null => false,
        JsonArray array => array.Count > 0,
        JsonObject obj => obj.Count > 0,
        JsonValue value when value.TryGetValue<string>(out var s) => HasText(s),
        _ => true,
    };

    private static bool HasText(string s)
        => !string.IsNullOrWhiteSpace(s) && s.Trim() is not ("[]" or "{}" or "null" or "\"\"");

    // ===== Marking ==========================================================================

    private void MarkDocumentType(Guid key, bool published)
    {
        if (!_contentTypesByKey.TryGetValue(key, out var contentType))
        {
            return;
        }

        var newlyUsed = _documentTypesUsed.Add(key);
        var newlyPublished = published && _documentTypesPublished.Add(key);

        // Already marked at this level, so its compositions are too.
        if (!newlyUsed && !newlyPublished)
        {
            return;
        }

        foreach (var composition in contentType.ContentTypeComposition)
        {
            MarkDocumentType(composition.Key, published);
        }
    }

    private void MarkDataType(int dataTypeId, bool published)
    {
        _dataTypesUsed.Add(dataTypeId);
        if (published)
        {
            _dataTypesPublished.Add(dataTypeId);
        }
    }

    /// <summary>
    /// A list view chosen as a document or media type's collection view is not a property, so it
    /// is never seen through values. It is in use for as long as the type exists.
    /// </summary>
    private void MarkCollectionViews(IEnumerable<IContentTypeComposition> types)
    {
        var dataTypeIdsByKey = _dataTypeList.ToDictionary(dt => dt.Key, dt => dt.Id);
        foreach (var type in types)
        {
            if (type.ListView is { } listViewKey && dataTypeIdsByKey.TryGetValue(listViewKey, out var dataTypeId))
            {
                MarkDataType(dataTypeId, published: true);
            }
        }
    }

    // ===== Reporting ========================================================================

    // Core editors are "Umbraco.*"; Contentment and other community packages use "Umbraco.Community.*".
    private static bool IsCoreEditor(string editorAlias)
        => editorAlias.StartsWith("Umbraco.", StringComparison.Ordinal)
            && !editorAlias.StartsWith("Umbraco.Community.", StringComparison.Ordinal);

    private TypeUsage ToUsage(IDataType dataType, Dictionary<int, List<string>> propertiesByDataType)
    {
        var detail = propertiesByDataType.TryGetValue(dataType.Id, out var properties)
            ? $"Used by {properties.Count} {(properties.Count == 1 ? "property" : "properties")} with no values: {string.Join(", ", properties.Take(10))}{(properties.Count > 10 ? ", …" : string.Empty)}"
            : "Not used by any property";
        return new TypeUsage(dataType.Id, dataType.Key.ToString(), dataType.Name!, FormulatePath(dataType.Path), "dataType", detail);
    }

    // Each type's own properties, so a composition's properties are listed once, against the composition.
    private static Dictionary<int, List<string>> PropertiesByDataType(IEnumerable<IContentTypeComposition> types)
        => types
            .SelectMany(t => t.PropertyTypes.Select(p => (p.DataTypeId, Name: $"{t.Alias}.{p.Alias}")))
            .GroupBy(x => x.DataTypeId)
            .ToDictionary(g => g.Key, g => g.Select(x => x.Name).ToList());

    // Block List, Block Grid and rich text configurations list their element types by key.
    private Dictionary<Guid, List<string>> BlockConfigsByElementKey()
    {
        var result = new Dictionary<Guid, List<string>>();
        foreach (var dataType in _dataTypeList)
        {
            string config;
            try
            {
                config = JsonSerializer.Serialize(dataType.ConfigurationData);
            }
            catch (Exception)
            {
                continue;
            }

            foreach (var key in _contentTypesByKey.Keys)
            {
                if (config.Contains(key.ToString(), StringComparison.OrdinalIgnoreCase))
                {
                    if (!result.TryGetValue(key, out var names))
                    {
                        result[key] = names = [];
                    }
                    names.Add(dataType.Name ?? dataType.Key.ToString());
                }
            }
        }

        return result;
    }

    /// <summary>
    /// What still points at an unused document type, so it can be unhooked before deleting.
    /// Code references (views, controllers, models) cannot be seen from here.
    /// </summary>
    private static string? DescribeDocumentTypeLinks(IContentType contentType, List<IContentType> all, Dictionary<Guid, List<string>> blockConfigs)
    {
        var links = new List<string>();

        var composedInto = all.Where(t => t.ContentTypeComposition.Any(c => c.Key == contentType.Key)).Select(t => t.Alias).ToList();
        if (composedInto.Count > 0)
        {
            links.Add($"Composition of: {string.Join(", ", composedInto)}");
        }

        var allowedUnder = all.Where(t => t.AllowedContentTypes?.Any(a => a.Key == contentType.Key) == true).Select(t => t.Alias).ToList();
        if (allowedUnder.Count > 0)
        {
            links.Add($"Allowed as a child of: {string.Join(", ", allowedUnder)}");
        }

        if (blockConfigs.TryGetValue(contentType.Key, out var configs))
        {
            links.Add($"Offered in: {string.Join(", ", configs)}");
        }

        return links.Count > 0 ? string.Join(". ", links) : null;
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

/// <param name="Detail">Why the type is listed, or what still links to it.</param>
public record TypeUsage(int Id, string GUID, string Name, string?[] Path, string Type, string? Detail = null);

public class TypeUsageResponse
{
    public bool IsSuccess { get; set; }
    public TypeUsage[] DataTypes { get; set; } = [];
    public TypeUsage[] DocumentTypes { get; set; } = [];
    public TypeUsage[] UmbracoDataTypes { get; set; } = [];
    public TypeUsage[] ThirdPartyDataTypes { get; set; } = [];
    public TypeUsage[] UnpublishedOnlyTypes { get; set; } = [];
    public TypeUsageResult TypeUsageResult { get; set; } = new();
}

public class TypeUsageResult
{
    public int DataTypes { get; set; } = 0;
    public int DocumentTypes { get; set; } = 0;
    public int UmbracoDataTypes { get; set; } = 0;
    public int ThirdPartyDataTypes { get; set; } = 0;
    public int UnpublishedOnlyTypes { get; set; } = 0;
}
#endif
