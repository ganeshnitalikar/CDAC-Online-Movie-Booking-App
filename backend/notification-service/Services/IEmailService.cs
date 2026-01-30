using notification_service.Models;

namespace notification_service.Services
{
    public interface IEmailService
    {
        Task SendBookingConfirmationEmail(EmailRequest request);
    }
}
