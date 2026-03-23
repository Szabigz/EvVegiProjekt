using System.Text.Json.Serialization;

namespace BarberManager.Models
{
    public class User
    {
        [JsonPropertyName("id")] public int Id { get; set; }
        [JsonPropertyName("name")] public string Name { get; set; } = string.Empty;
        [JsonPropertyName("email")] public string Email { get; set; } = string.Empty;

        [JsonPropertyName("phoneNum")] public string PhoneNum { get; set; } = string.Empty;

        [JsonIgnore]
        public string DisplayName => $"{Name} ({Email})";
    }
}