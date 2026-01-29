namespace notification_service.Models
{
    public class EmailRequest
    {
        public string ToEmail { get; set; }
        public string UserName { get; set; }
        public string MovieName { get; set; }
        public string ShowTime { get; set; }
        public string Seats { get; set; }
        public string BookingId { get; set; }
    }
}
