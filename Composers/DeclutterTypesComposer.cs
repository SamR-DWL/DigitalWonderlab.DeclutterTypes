using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;

namespace DigitalWonderlab.DeclutterTypes.Composers;

public class DeclutterTypesComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        // No services to register.
        // v13 controller is auto-discovered via [PluginController].
        // v15/v17 controller is auto-discovered via [VersionedApiBackOfficeRoute].
    }
}
