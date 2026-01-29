using Microsoft.AspNetCore.Mvc;
using notification_service.Models;
using notification_service.Services;

namespace notification_service.Controllers
{
    [ApiController]
    [Route("api/notification")]
    public class NotificationController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public NotificationController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        // POST: api/notification/booking-success
        [HttpPost("booking-success")]
        public async Task<IActionResult> SendBookingSuccessEmail(
            [FromBody] EmailRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.ToEmail))
            {
                return BadRequest("Invalid email request data");
            }

            await _emailService.SendBookingConfirmationEmail(request);

            return Ok("Booking confirmation email sent successfully");
        }
    }
}
