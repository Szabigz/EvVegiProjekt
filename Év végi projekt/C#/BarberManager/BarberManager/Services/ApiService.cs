using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Text;
using System.Text.Json.Serialization;
using System.Text.Json;
using System.Threading.Tasks;
using BarberManager.Models;
using System.Net.Http.Json;

namespace BarberManager.Services
{
    public class ApiService
    {
        private readonly string BaseUrl;
        private readonly HttpClient _httpClient;
        private string _jwtToken = string.Empty;

        public ApiService()
        {
            if (OperatingSystem.IsAndroid())
            {
                BaseUrl = "http://10.0.2.2:3000";
            }
            else
            {
                BaseUrl = "http://127.0.0.1:3000";
            }

            _httpClient = new HttpClient { BaseAddress = new Uri(BaseUrl) };
        }

        private JsonSerializerOptions GetJsonOptions()
        {
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            options.Converters.Add(new LocalTimeConverter());
            options.NumberHandling = JsonNumberHandling.AllowReadingFromString | JsonNumberHandling.WriteAsString;
            return options;
        }

        private void SetAuthorizationHeader()
        {
            if (!string.IsNullOrEmpty(_jwtToken))
            {
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _jwtToken);
            }
        }

        // --- register ---
        public async Task<(bool IsSuccess, string Message)> RegisterBarberAsync(string email, string name, string password, string phoneNum)
        {
            var data = new { email, name, password, phoneNum, isAdmin = true };
            try
            {
                var res = await _httpClient.PostAsJsonAsync("/barberReg", data);
                return res.IsSuccessStatusCode ? (true, "Sikeres!") : (false, "Hiba!");
            }
            catch
            {
                return (false, "Hiba");
            }
        }

        // --- login ---
        public async Task<(bool IsSuccess, string Message)> LoginBarberAsync(string email, string name, string password)
        {
            try
            {
                var res = await _httpClient.PostAsJsonAsync("/barberLogin", new { email, name, password });
                var content = await res.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<LoginResponse>(content, GetJsonOptions());

                if (res.IsSuccessStatusCode && result != null && !string.IsNullOrEmpty(result.Token))
                {
                    _jwtToken = result.Token;
                    SetAuthorizationHeader();
                    return (true, "Sikeres!");
                }
                return (false, result?.Message ?? "Hiba!");
            }
            catch (Exception ex)
            {
                return (false, ex.Message);
            }
        }

        // --- barber get ---
        public async Task<Barber?> GetBarberInfoAsync()
        {
            SetAuthorizationHeader();
            try
            {
                var res = await _httpClient.GetAsync("/barberGet");
                var content = await res.Content.ReadAsStringAsync();
                var list = JsonSerializer.Deserialize<List<Barber>>(content, GetJsonOptions());
                return list?.FirstOrDefault();
            }
            catch
            {
                return null;
            }
        }

        // --- barber update ---
        public async Task<(bool IsSuccess, string Message)> UpdateBarberProfileAsync(int id, string name, string phoneNum, string? password = null)
        {
            SetAuthorizationHeader();
            var data = new Dictionary<string, object> { { "name", name }, { "phoneNum", phoneNum } };
            if (!string.IsNullOrEmpty(password))
            {
                data.Add("password", password);
            }

            try
            {
                var res = await _httpClient.PutAsJsonAsync($"/barberUpdate/{id}", data);
                return res.IsSuccessStatusCode ? (true, "Sikeres!") : (false, "Hiba!");
            }
            catch
            {
                return (false, "Hiba");
            }
        }

        // --- services get ---
        public async Task<List<Service>> GetServicesAsync()
        {
            SetAuthorizationHeader();
            try
            {
                var res = await _httpClient.GetAsync("/servicesMy");
                var content = await res.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<Service>>(content, GetJsonOptions()) ?? new List<Service>();
            }
            catch
            {
                return new List<Service>();
            }
        }

        // --- services post ---
        public async Task<(bool IsSuccess, string Message)> CreateServiceAsync(Service s)
        {
            SetAuthorizationHeader();
            try
            {
                var res = await _httpClient.PostAsJsonAsync("/servicesPost", s);
                return res.IsSuccessStatusCode ? (true, "Sikeres!") : (false, "Hiba!");
            }
            catch
            {
                return (false, "Hiba");
            }
        }

        // --- services update ---
        public async Task<(bool IsSuccess, string Message)> UpdateServiceAsync(Service s)
        {
            SetAuthorizationHeader();
            try
            {
                var res = await _httpClient.PutAsJsonAsync($"/servicesUpdate/{s.Id}", s);
                return res.IsSuccessStatusCode ? (true, "Sikeres!") : (false, "Hiba!");
            }
            catch
            {
                return (false, "Hiba");
            }
        }

        // --- services delete ---
        public async Task<(bool IsSuccess, string Message)> DeleteServiceAsync(int id)
        {
            SetAuthorizationHeader();
            try
            {
                var res = await _httpClient.DeleteAsync($"/servicesDelete/{id}");
                return res.IsSuccessStatusCode ? (true, "Sikeres!") : (false, "Hiba!");
            }
            catch
            {
                return (false, "Hiba");
            }
        }

        // --- workhours get ---
        public async Task<List<WorkHour>> GetMyWorkHoursAsync()
        {
            SetAuthorizationHeader();
            try
            {
                var res = await _httpClient.GetAsync("/workhoursMy");
                var content = await res.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<WorkHour>>(content, GetJsonOptions()) ?? new List<WorkHour>();
            }
            catch
            {
                return new List<WorkHour>();
            }
        }

        // --- workhours post/put ---
        public async Task<bool> SaveWorkHourAsync(WorkHour wh)
        {
            SetAuthorizationHeader();
            try
            {
                var res = (wh.Id == 0) ? await _httpClient.PostAsJsonAsync("/workhoursPost", wh) : await _httpClient.PutAsJsonAsync($"/workhoursUpdate/{wh.Id}", wh);
                return res.IsSuccessStatusCode;
            }
            catch
            {
                return false;
            }
        }

        // --- appointments get ---
        public async Task<List<Appointment>> GetMyAppointmentsAsync()
        {
            SetAuthorizationHeader();
            try
            {
                var res = await _httpClient.GetAsync("/appointmentMyBarber");
                var content = await res.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<Appointment>>(content, GetJsonOptions()) ?? new List<Appointment>();
            }
            catch
            {
                return new List<Appointment>();
            }
        }

        // --- slots get ---
        public async Task<List<DateTime>> GetAvailableSlotsAsync(int barberId, DateTime date)
        {
            try
            {
                var res = await _httpClient.GetAsync($"/availableSlots/{barberId}/{date:yyyy-MM-dd}");
                var content = await res.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<DateTime>>(content, GetJsonOptions()) ?? new List<DateTime>();
            }
            catch
            {
                return new List<DateTime>();
            }
        }

        // --- appointments post ---
        public async Task<(bool IsSuccess, string Message)> PostAppointmentAsync(int serviceId, int? userId, DateTime start, DateTime end, string comment)
        {
            SetAuthorizationHeader();
            var data = new { serviceID = serviceId, userID = userId, start_time = start.ToString("yyyy-MM-dd HH:mm:ss"), end_time = end.ToString("yyyy-MM-dd HH:mm:ss"), comment };
            try
            {
                var res = await _httpClient.PostAsJsonAsync("/appointmentPost", data);
                return res.IsSuccessStatusCode ? (true, "Sikeres!") : (false, "Hiba!");
            }
            catch
            {
                return (false, "Hiba");
            }
        }

        // --- appointments update ---
        public async Task<bool> UpdateAppointmentStatusAsync(int id, string status)
        {
            SetAuthorizationHeader();
            try
            {
                var res = await _httpClient.PutAsJsonAsync($"/appointmentUpdate/{id}", new { status });
                return res.IsSuccessStatusCode;
            }
            catch
            {
                return false;
            }
        }

        // --- appointments delete ---
        public async Task<bool> CancelAppointmentAsync(int id)
        {
            SetAuthorizationHeader();
            try
            {
                var res = await _httpClient.DeleteAsync($"/appointmentDelete/{id}");
                return res.IsSuccessStatusCode;
            }
            catch
            {
                return false;
            }
        }

        // --- users get ---
        public async Task<List<User>> GetAllUsersAsync()
        {
            SetAuthorizationHeader();
            try
            {
                var res = await _httpClient.GetAsync("/usersAll");
                var content = await res.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<User>>(content, GetJsonOptions()) ?? new List<User>();
            }
            catch
            {
                return new List<User>();
            }
        }

        // --- logs get ---
        public async Task<List<LogEntry>> GetMyLogsAsync()
        {
            SetAuthorizationHeader();
            try
            {
                var res = await _httpClient.GetAsync("/logsMy");
                var content = await res.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<LogEntry>>(content, GetJsonOptions()) ?? new List<LogEntry>();
            }
            catch
            {
                return new List<LogEntry>();
            }
        }

        // --- logs delete ---
        public async Task<bool> CleanupOldLogsAsync()
        {
            SetAuthorizationHeader();
            try
            {
                var res = await _httpClient.DeleteAsync("/logsCleanup");
                return res.IsSuccessStatusCode;
            }
            catch
            {
                return false;
            }
        }

        // --- logout ---
        public void Logout()
        {
            _jwtToken = string.Empty;
            _httpClient.DefaultRequestHeaders.Authorization = null;
        }

        private class LoginResponse
        {
            [JsonPropertyName("token")] public string Token { get; set; } = string.Empty;
            [JsonPropertyName("message")] public string Message { get; set; } = string.Empty;
        }
    }

    public class LocalTimeConverter : JsonConverter<DateTime>
    {
        public override DateTime Read(ref Utf8JsonReader r, Type t, JsonSerializerOptions o) => DateTime.Parse(r.GetString()!);
        public override void Write(Utf8JsonWriter w, DateTime v, JsonSerializerOptions o) => w.WriteStringValue(v.ToString("yyyy-MM-dd HH:mm:ss"));
    }
}