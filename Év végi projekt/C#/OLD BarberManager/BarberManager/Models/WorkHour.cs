using System.Text.Json.Serialization;

namespace BarberManager.Models
{
    public class WorkHour
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("barberID")]
        public int BarberId { get; set; }

        [JsonPropertyName("dayOfWeek")]
        public int DayOfWeek { get; set; }

        [JsonPropertyName("start_time")]
        public string StartTime { get; set; } = "08:00:00";

        [JsonPropertyName("end_time")]
        public string EndTime { get; set; } = "16:00:00";
    }
}