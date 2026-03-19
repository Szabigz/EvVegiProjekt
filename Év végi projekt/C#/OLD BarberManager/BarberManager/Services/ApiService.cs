using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using BarberManager.Models;

namespace BarberManager.Services
{
    public class ApiService
    {
        private const string BaseUrl = "http://127.0.0.1:3000";
        private readonly HttpClient _httpClient;
        private string _jwtToken = string.Empty;

        public ApiService()
        {
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
            var registerData = new { email, name, password, phoneNum, isAdmin = true };
            try
            {
                var response = await _httpClient.PostAsJsonAsync("/barberReg", registerData);
                return response.IsSuccessStatusCode ? (true, "Sikeres regisztráció!") : (false, "Hiba a regisztráció során.");
            }
            catch { return (false, "Hálózati hiba"); }
        }

        // --- login ---
        public async Task<(bool IsSuccess, string Message)> LoginBarberAsync(string email, string name, string password)
        {
            var loginData = new { email, name, password };
            try
            {
                var response = await _httpClient.PostAsJsonAsync("/barberLogin", loginData);
                var content = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<LoginResponse>(content, GetJsonOptions());

                if (response.IsSuccessStatusCode && result != null && !string.IsNullOrEmpty(result.Token))
                {
                    _jwtToken = result.Token;
                    SetAuthorizationHeader();
                    return (true, "Sikeres bejelentkezés!");
                }
                return (false, result?.Message ?? "Hibás hitelesítés!");
            }
            catch { return (false, "Hálózati hiba"); }
        }

        // --- barber lekeres ---
        public async Task<Barber?> GetBarberInfoAsync()
        {
            SetAuthorizationHeader();
            try
            {
                var response = await _httpClient.GetAsync("/barberGet");
                if (!response.IsSuccessStatusCode) return null;
                var content = await response.Content.ReadAsStringAsync();
                var list = JsonSerializer.Deserialize<List<Barber>>(content, GetJsonOptions());
                return list?.FirstOrDefault();
            }
            catch { return null; }
        }

        // --- profil frissites ---
        public async Task<(bool IsSuccess, string Message)> UpdateBarberProfileAsync(int id, string name, string phoneNum, string? password = null)
        {
            SetAuthorizationHeader();

            var updateData = new Dictionary<string, object>
            {
                { "name", name },
                { "phoneNum", phoneNum }
            };

            if (!string.IsNullOrEmpty(password))
            {
                updateData.Add("password", password);
            }

            try
            {
                var response = await _httpClient.PutAsJsonAsync($"/barberUpdate/{id}", updateData);
                return response.IsSuccessStatusCode ? (true, "Profil frissítve!") : (false, "Hiba a mentéskor.");
            }
            catch { return (false, "Hálózati hiba."); }
        }

        // --- szolgaltatas lekeres ---
        public async Task<List<Service>> GetServicesAsync()
        {
            SetAuthorizationHeader();
            try
            {
                var response = await _httpClient.GetAsync("/servicesMy");
                var content = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<Service>>(content, GetJsonOptions()) ?? new List<Service>();
            }
            catch { return new List<Service>(); }
        }

        // --- szolgaltatas letrehozas ---
        public async Task<(bool IsSuccess, string Message)> CreateServiceAsync(Service service)
        {
            SetAuthorizationHeader();
            try
            {
                var response = await _httpClient.PostAsJsonAsync("/servicesPost", service);
                return response.IsSuccessStatusCode ? (true, "Létrehozva!") : (false, "Hiba.");
            }
            catch { return (false, "Hiba."); }
        }

        // --- szolgaltatas modositas ---
        public async Task<(bool IsSuccess, string Message)> UpdateServiceAsync(Service service)
        {
            SetAuthorizationHeader();
            try
            {
                var response = await _httpClient.PutAsJsonAsync($"/servicesUpdate/{service.Id}", service);
                return response.IsSuccessStatusCode ? (true, "Módosítva!") : (false, "Hiba.");
            }
            catch { return (false, "Hiba."); }
        }

        // --- szolgaltatas torles ---
        public async Task<(bool IsSuccess, string Message)> DeleteServiceAsync(int id)
        {
            SetAuthorizationHeader();
            try
            {
                var response = await _httpClient.DeleteAsync($"/servicesDelete/{id}");
                return response.IsSuccessStatusCode ? (true, "Törölve!") : (false, "Hiba.");
            }
            catch { return (false, "Hiba."); }
        }

        // --- munkaido lekeres ---
        public async Task<List<WorkHour>> GetMyWorkHoursAsync()
        {
            SetAuthorizationHeader();
            try
            {
                var response = await _httpClient.GetAsync("/workhoursMy");
                var content = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<WorkHour>>(content, GetJsonOptions()) ?? new List<WorkHour>();
            }
            catch { return new List<WorkHour>(); }
        }

        // --- munkaido mentese (uj vagy modositas) ---
        public async Task<bool> SaveWorkHourAsync(WorkHour wh)
        {
            SetAuthorizationHeader();
            try
            {
                HttpResponseMessage resp = (wh.Id == 0)
                    ? await _httpClient.PostAsJsonAsync("/workhoursPost", wh)
                    : await _httpClient.PutAsJsonAsync($"/workhoursUpdate/{wh.Id}", wh);
                return resp.IsSuccessStatusCode;
            }
            catch { return false; }
        }

        // --- idopontok lekeres ---
        public async Task<List<Appointment>> GetMyAppointmentsAsync()
        {
            SetAuthorizationHeader();
            try
            {
                var response = await _httpClient.GetAsync("/appointmentMyBarber");
                var content = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<Appointment>>(content, GetJsonOptions()) ?? new List<Appointment>();
            }
            catch { return new List<Appointment>(); }
        }

        // --- idopont letrehozas ---
        public async Task<(bool IsSuccess, string Message)> PostAppointmentAsync(int serviceId, int? userId, DateTime start, DateTime end, string comment)
        {
            SetAuthorizationHeader();
            var data = new { serviceID = serviceId, userID = userId, start_time = start.ToString("yyyy-MM-ddTHH:mm:ss"), end_time = end.ToString("yyyy-MM-ddTHH:mm:ss"), comment };
            try
            {
                var response = await _httpClient.PostAsJsonAsync("/appointmentPost", data);
                if (response.IsSuccessStatusCode) return (true, "Sikeres!");
                return (false, "Foglalt vagy hiba.");
            }
            catch { return (false, "Hiba."); }
        }

        // --- idopont lemondas ---
        public async Task<bool> CancelAppointmentAsync(int id)
        {
            SetAuthorizationHeader();
            try { return (await _httpClient.DeleteAsync($"/appointmentDelete/{id}")).IsSuccessStatusCode; }
            catch { return false; }
        }
        // --- idopont status frissites ---
        public async Task<bool> UpdateAppointmentStatusAsync(int id, string newStatus)
        {
            SetAuthorizationHeader();
            try { return (await _httpClient.PutAsJsonAsync($"/appointmentUpdate/{id}", new { status = newStatus })).IsSuccessStatusCode; }
            catch { return false; }
        }

        // --- felhasznalok lekeres ---
        public async Task<List<User>> GetAllUsersAsync()
        {
            SetAuthorizationHeader();
            try
            {
                var response = await _httpClient.GetAsync("/usersAll");
                var content = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<User>>(content, GetJsonOptions()) ?? new List<User>();
            }
            catch { return new List<User>(); }
        }

        public void Logout()
        {
            _jwtToken = string.Empty;
            _httpClient.DefaultRequestHeaders.Authorization = null;
        }

        private class LoginResponse
        {
            [JsonPropertyName("message")] public string Message { get; set; } = string.Empty;
            [JsonPropertyName("token")] public string Token { get; set; } = string.Empty;
        }
    }

    // --- idozona fix ---
    public class LocalTimeConverter : JsonConverter<DateTime>
    {
        public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            var dateStr = reader.GetString();
            if (string.IsNullOrEmpty(dateStr)) return DateTime.MinValue;
            return DateTime.Parse(dateStr);
        }

        public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToString("yyyy-MM-ddTHH:mm:ss"));
        }
    }
}