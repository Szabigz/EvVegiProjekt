using System.Text.Json.Serialization;

namespace BarberManager.Models
{
    public class Service
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("barberID")]
        public int BarberId { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("description")]
        public string Description { get; set; } = string.Empty;

        [JsonPropertyName("duration_minutes")]
        public int DurationMinutes { get; set; }

        [JsonPropertyName("price")]
        public int Price { get; set; }

        [JsonIgnore]
        public string DisplayText => $"{Name} - {Price} Ft ({DurationMinutes} perc)";
    }
}