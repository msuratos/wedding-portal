using wedding_admin_cms;

var builder = Host.CreateDefaultBuilder(args)
  .ConfigureWebHostDefaults(webBuilder =>
  {
    webBuilder.UseStartup<Startup>();
  });

builder.Build().Run();