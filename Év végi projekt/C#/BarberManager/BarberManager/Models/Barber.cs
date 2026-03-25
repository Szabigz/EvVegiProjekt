using System.Text.Json.Serialization;

namespace BarberManager.Models
{
    public class Barber
    {
        [JsonPropertyName("id")] public int Id { get; set; }
        [JsonPropertyName("name")] public string Name { get; set; } = string.Empty;
        [JsonPropertyName("email")] public string Email { get; set; } = string.Empty;

        [JsonPropertyName("phoneNum")] public string PhoneNum { get; set; } = string.Empty;

        [JsonPropertyName("isAdmin")] public bool IsAdmin { get; set; }
        [JsonPropertyName("profile_image")] public string? ProfileImage { get; set; }
        [JsonPropertyName("description")] public string? Description { get; set; }

    }
}