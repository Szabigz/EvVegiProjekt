using System;
using System.Text.Json.Serialization;

namespace BarberManager.Models
{
    public class Appointment
    {
        [JsonPropertyName("id")] public int Id { get; set; }
        [JsonPropertyName("userID")] public int? UserId { get; set; }
        [JsonPropertyName("serviceID")] public int ServiceId { get; set; }
        [JsonPropertyName("start_time")] public DateTime StartTime { get; set; }
        [JsonPropertyName("end_time")] public DateTime EndTime { get; set; }
        [JsonPropertyName("status")] public string Status { get; set; } = "available";
        [JsonPropertyName("comment")] public string? Comment { get; set; }

        [JsonPropertyName("user")] public GuestInfo? User { get; set; }
        [JsonPropertyName("service")] public ServiceInfo? Service { get; set; }
    }

    public class GuestInfo
    {
        [JsonPropertyName("name")] public string Name { get; set; } = "Vendég";
        [JsonPropertyName("email")] public string Email { get; set; } = "Nincs megadva";
        [JsonPropertyName("phoneNum")] public string PhoneNum { get; set; } = "Nincs megadva";
    }

    public class ServiceInfo
    {
        [JsonPropertyName("name")] public string Name { get; set; } = "Szolgáltatás";
        [JsonPropertyName("price")] public int Price { get; set; } = 0;
    }
}