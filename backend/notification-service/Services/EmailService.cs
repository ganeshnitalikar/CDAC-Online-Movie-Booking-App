using notification_service.Models;
using System.Net;
using System.Net.Mail;

namespace notification_service.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendBookingConfirmationEmail(EmailRequest request)
        {
            // Read Email Settings from appsettings.json
            var emailSettings = _configuration.GetSection("EmailSettings");

            string smtpServer = emailSettings["SmtpServer"];
            int port = int.Parse(emailSettings["Port"]);
            string senderEmail = emailSettings["SenderEmail"];
            string senderName = emailSettings["SenderName"];
            string username = emailSettings["Username"];
            string password = emailSettings["Password"];

            // Create Mail Message
            var mailMessage = new MailMessage
            {
                From = new MailAddress(senderEmail, senderName),
                Subject = "🎬 Booking Confirmed - Movie Ticket",
                Body = $@"
                    <h2>Booking Successful 🎉</h2>
                    <p>Hello <b>{request.UserName}</b>,</p>
                    <p>Your movie ticket has been booked successfully.</p>

                    <p>
                        <b>Movie:</b> {request.MovieName}<br/>
                        <b>Show Time:</b> {request.ShowTime}<br/>
                        <b>Seats:</b> {request.Seats}<br/>
                        <b>Booking ID:</b> {request.BookingId}
                    </p>

                    <p>Enjoy your movie! 🍿</p>
                    <p>Thank you for choosing us.</p>
                ",
                IsBodyHtml = true
            };

            mailMessage.To.Add(request.ToEmail);

            // SMTP Client
            var smtpClient = new SmtpClient(smtpServer)
            {
                Port = port,
                Credentials = new NetworkCredential(username, password),
                EnableSsl = true
            };

            // Send Email
            await smtpClient.SendMailAsync(mailMessage);
        }
    }
}
