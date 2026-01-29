using notification_service.Services;
using Steeltoe.Discovery.Client;

namespace notification_service
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Controllers
            builder.Services.AddControllers();

            // Email service
            builder.Services.AddScoped<IEmailService, EmailService>();

            // ?? Eureka registration
            builder.Services.AddDiscoveryClient(builder.Configuration);

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthorization();

            // ?? Eureka middleware (AVAILABLE in 3.x)
          //  app.UseDiscoveryClient();

            app.MapControllers();
            app.Run();
        }
    }
}
