using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(OctFileUploadSystemWeb.Startup))]
namespace OctFileUploadSystemWeb
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
