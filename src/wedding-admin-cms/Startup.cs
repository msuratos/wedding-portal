using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web;
using wedding_admin_cms.Persistance;

namespace wedding_admin_cms
{
  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddControllersWithViews();
      services.AddRazorPages();
      services.AddDbContext<WeddingDbContext>(opt => opt.UseSqlServer("Name=WeddingDbContext"));

      // Adds Microsoft Identity platform (AAD v2.0) support to protect this Api
      services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
              .AddMicrosoftIdentityWebApi(options =>
                {
                  Configuration.Bind("AzureAdB2C", options);
                  options.TokenValidationParameters.NameClaimType = "name";
                },
                options => { Configuration.Bind("AzureAdB2C", options); }
              );
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }
      else
      {
        app.UseExceptionHandler("/Error");
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
      }

      app.UseHttpsRedirection();
      app.UseStaticFiles();
      app.UseRouting();

      app.UseAuthentication();
      app.UseAuthorization();

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllerRoute(
                  name: "default",
                  pattern: "{controller}/{action=Index}/{id?}");

        endpoints.MapRazorPages();
        endpoints.MapFallbackToFile("index.html");
      });
    }
  }
}
