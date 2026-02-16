using System;
using System.Text.Json.Serialization;

namespace BarberManager.Models
{
    public class Appointment
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("userID")]
        public int UserId { get; set; }

        [JsonPropertyName("barberID")]
        public int BarberId { get; set; }

        [JsonPropertyName("serviceID")]
        public int ServiceId { get; set; }

        [JsonPropertyName("start_time")]
        public DateTime StartTime { get; set; }

        [JsonPropertyName("end_time")]
        public DateTime EndTime { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; } = string.Empty; // "booked" "canceled" stb

        [JsonPropertyName("comment")]
        public string? Comment { get; set; }
    }
}