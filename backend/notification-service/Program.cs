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

            // Eureka registration
            builder.Services.AddDiscoveryClient(builder.Configuration);

            // ✅ ADD CORS SERVICE
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("FrontendPolicy", policy =>
                {
                    policy.WithOrigins("http://localhost:5173")
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            // ✅ ENABLE CORS (must be before auth/controllers)
            app.UseCors("FrontendPolicy");

            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthorization();

            // app.UseDiscoveryClient();

            app.MapControllers();
            app.Run();
        }
    }
}
