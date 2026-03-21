using System;
using System.Text.Json.Serialization;

namespace BarberManager.Models
{
    public class LogEntry
    {
        [JsonPropertyName("id")] public int Id { get; set; }
        [JsonPropertyName("activity")] public string Activity { get; set; } = string.Empty;
        [JsonPropertyName("createdAt")] public DateTime CreatedAt { get; set; }
        [JsonPropertyName("user")] public LogUserInfo? User { get; set; }
    }

    public class LogUserInfo
    {
        [JsonPropertyName("name")] public string Name { get; set; } = "Rendszer";
    }
}