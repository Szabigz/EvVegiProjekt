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
        private readonly string BaseUrl;
        private readonly HttpClient _httpClient;
        private string _jwtToken = string.Empty;

        public ApiService()
        {
            if (OperatingSystem.IsAndroid())
                BaseUrl = "http://10.0.2.2:3000";
            else
                BaseUrl = "http://127.0.0.1:3000";
            _httpClient = new HttpClient { BaseAddress = new Uri(BaseUrl) };
        }

        private JsonSerializerOptions GetJsonOptions()
        {
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            options.Converters.Add(new LocalTimeConverter());
            options.Converters.Add(new IntToBoolConverter());
            options.Converters.Add(new NumberToStringConverter());
            options.NumberHandling = JsonNumberHandling.AllowReadingFromString | JsonNumberHandling.WriteAsString;
            return options;
        }

        private void SetAuthorizationHeader()
        {
            if (!string.IsNullOrEmpty(_jwtToken))
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _jwtToken);
        }

        // --- LOGIN ÉS REGISZTRÁCIÓ ---
        public async Task<(bool IsSuccess, string Message)> RegisterBarberAsync(string email, string name, string password, string phoneNum, bool isAdmin)
        {
            var data = new { email, name, password, phoneNum, isAdmin };
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

        public void Logout()
        {
            _jwtToken = string.Empty;
            _httpClient.DefaultRequestHeaders.Authorization = null;
        }

        // --- BARBER PROFIL ---
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
            catch (Exception ex)
            {
                System.Console.WriteLine("HIBA A PROFIL BEOLVASÁSAKOR: " + ex.Message);
                return null;
            }
        }

        public async Task<(bool IsSuccess, string Message)> UpdateBarberProfileAsync(int id, string name, string phoneNum, string? password = null)
        {
            SetAuthorizationHeader();
            var data = new Dictionary<string, object> { { "name", name }, { "phoneNum", phoneNum } };
            if (!string.IsNullOrEmpty(password))
                data.Add("password", password);

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

        // --- ADMIN FUNKCIÓK ---
        public async Task<List<Barber>> GetAllBarbersAsync()
        {
            SetAuthorizationHeader();
            try
            {
                var res = await _httpClient.GetAsync("/barbersAll");
                var content = await res.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<Barber>>(content, GetJsonOptions()) ?? new List<Barber>();
            }
            catch (Exception ex)
            {
                System.Console.WriteLine("HIBA A BARBEREK BEOLVASÁSAKOR: " + ex.Message);
                return new List<Barber>();
            }
        }

        public async Task<bool> DeleteBarberAsync(int id)
        {
            SetAuthorizationHeader();
            try
            {
                return (await _httpClient.DeleteAsync($"/barberDelete/{id}")).IsSuccessStatusCode;
            }
            catch
            {
                return false;
            }
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            SetAuthorizationHeader();
            try
            {
                var res = await _httpClient.GetAsync("/usersAll");
                var content = await res.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<User>>(content, GetJsonOptions()) ?? new List<User>();
            }
            catch (Exception ex)
            {
                System.Console.WriteLine("HIBA A USEREK BEOLVASÁSAKOR: " + ex.Message);
                return new List<User>();
            }
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            SetAuthorizationHeader();
            try
            {
                return (await _httpClient.DeleteAsync($"/userDelete/{id}")).IsSuccessStatusCode;
            }
            catch
            {
                return false;
            }
        }

        public async Task<List<LogEntry>> GetAllLogsAsync()
        {
            SetAuthorizationHeader();
            try
            {
                var res = await _httpClient.GetAsync("/logsAll");
                var content = await res.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<LogEntry>>(content, GetJsonOptions()) ?? new List<LogEntry>();
            }
            catch (Exception ex)
            {
                System.Console.WriteLine("HIBA A NAPLÓK BEOLVASÁSAKOR: " + ex.Message);
                return new List<LogEntry>();
            }
        }

        public async Task<bool> CleanupOldLogsAsync()
        {
            SetAuthorizationHeader();
            try
            {
                return (await _httpClient.DeleteAsync("/logsCleanup")).IsSuccessStatusCode;
            }
            catch
            {
                return false;
            }
        }

        // --- SZOLGÁLTATÁSOK ---
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

        public async Task<(bool IsSuccess, string Message)> CreateServiceAsync(Service s)
        {
            SetAuthorizationHeader();
            try
            {
                return (await _httpClient.PostAsJsonAsync("/servicesPost", s)).IsSuccessStatusCode ? (true, "Sikeres") : (false, "Hiba");
            }
            catch
            {
                return (false, "Hiba");
            }
        }

        public async Task<(bool IsSuccess, string Message)> UpdateServiceAsync(Service s)
        {
            SetAuthorizationHeader();
            try
            {
                return (await _httpClient.PutAsJsonAsync($"/servicesUpdate/{s.Id}", s)).IsSuccessStatusCode ? (true, "Sikeres") : (false, "Hiba");
            }
            catch
            {
                return (false, "Hiba");
            }
        }

        public async Task<(bool IsSuccess, string Message)> DeleteServiceAsync(int id)
        {
            SetAuthorizationHeader();
            try
            {
                return (await _httpClient.DeleteAsync($"/servicesDelete/{id}")).IsSuccessStatusCode ? (true, "Sikeres") : (false, "Hiba");
            }
            catch
            {
                return (false, "Hiba");
            }
        }

        // --- MUNKAIDŐ ---
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

        // --- IDŐPONTOK ---
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

        public async Task<bool> UpdateAppointmentStatusAsync(int id, string status)
        {
            SetAuthorizationHeader();
            try
            {
                return (await _httpClient.PutAsJsonAsync($"/appointmentUpdate/{id}", new { status })).IsSuccessStatusCode;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> CancelAppointmentAsync(int id)
        {
            SetAuthorizationHeader();
            try
            {
                return (await _httpClient.DeleteAsync($"/appointmentDelete/{id}")).IsSuccessStatusCode;
            }
            catch
            {
                return false;
            }
        }

        private class LoginResponse
        {
            [JsonPropertyName("token")]
            public string Token { get; set; } = string.Empty;
            [JsonPropertyName("message")]
            public string Message { get; set; } = string.Empty;
        }
    }

    // --- KONVERTEREK ---
    // datum stringbol c# DateTime-ot csinal es forditva
    public class LocalTimeConverter : JsonConverter<DateTime>
    {
        public override DateTime Read(ref Utf8JsonReader r, Type t, JsonSerializerOptions o) => DateTime.Parse(r.GetString()!);

        public override void Write(Utf8JsonWriter w, DateTime v, JsonSerializerOptions o) => w.WriteStringValue(v.ToString("yyyy-MM-dd HH:mm:ss"));
    }

    // tinyint 0/1 bol boolean true/falseot csinal
    public class IntToBoolConverter : JsonConverter<bool>
    {
        public override bool Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType == JsonTokenType.True)
                return true;
            if (reader.TokenType == JsonTokenType.False)
                return false;

            if (reader.TokenType == JsonTokenType.Number)
                return reader.GetInt32() == 1;

            return false;
        }

        public override void Write(Utf8JsonWriter writer, bool value, JsonSerializerOptions options) => writer.WriteBooleanValue(value);
    }

    // ha string helyett int jon akkor ez intet csinal
    public class NumberToStringConverter : JsonConverter<string>
    {
        public override string Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            // int -> string
            if (reader.TokenType == JsonTokenType.Number)
                return reader.GetInt64().ToString();

            // string -> string
            if (reader.TokenType == JsonTokenType.String)
                return reader.GetString() ?? string.Empty;

            return string.Empty;
        }

        public override void Write(Utf8JsonWriter writer, string value, JsonSerializerOptions options) => writer.WriteStringValue(value);
    }
}