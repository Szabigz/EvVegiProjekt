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
            _httpClient = new HttpClient 
            {
                BaseAddress = new Uri(BaseUrl) 
            };
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
            catch (Exception ex) { return (false, ex.Message); }
        }

        // --- login ---
        public async Task<(bool IsSuccess, string Message)> LoginBarberAsync(string email, string name, string password)
        {
            var loginData = new { email, name, password };
            try
            {
                var response = await _httpClient.PostAsJsonAsync("/barberLogin", loginData);
                var content = await response.Content.ReadAsStringAsync();

                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var result = JsonSerializer.Deserialize<LoginResponse>(content, options);

                if (response.IsSuccessStatusCode && result != null && !string.IsNullOrEmpty(result.Token))
                {
                    _jwtToken = result.Token;
                    SetAuthorizationHeader();
                    return (true, "Sikeres bejelentkezés!");
                }
                return (false, result?.Message ?? "Hibás hitelesítés!");
            }
            catch (Exception ex) { return (false, $"Hálózati hiba: {ex.Message}"); }
        }

        // --- barber lekeres ---
        public async Task<Barber?> GetBarberInfoAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync("/barberGet");
                if (!response.IsSuccessStatusCode) return null;

                string json = await response.Content.ReadAsStringAsync();
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    NumberHandling = JsonNumberHandling.AllowReadingFromString | JsonNumberHandling.WriteAsString
                };

                if (json.Trim().StartsWith("["))
                {
                    var list = JsonSerializer.Deserialize<List<Barber>>(json, options);
                    return list?.FirstOrDefault();
                }
                return JsonSerializer.Deserialize<Barber>(json, options);
            }
            catch { return null; }
        }

        // --- Szolgaltatasok lekeres ---
        public async Task<List<Service>> GetServicesAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync("/servicesMy");
                if (response.IsSuccessStatusCode)
                {
                    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                    return await response.Content.ReadFromJsonAsync<List<Service>>(options) ?? new List<Service>();
                }
                return new List<Service>();
            }
            catch { return new List<Service>(); }
        }

        // --- szolgaltatasok letrehozas ---
        public async Task<(bool IsSuccess, string Message)> CreateServiceAsync(Service service)
        {
            SetAuthorizationHeader(); 

            
            var data = new
            {
                name = service.Name,
                description = service.Description,
                duration_minutes = service.DurationMinutes,
                price = service.Price
            };

            try
            {
                var response = await _httpClient.PostAsJsonAsync("/servicesPost", data);
                if (response.IsSuccessStatusCode)
                {
                    return (true, "Szolgáltatás sikeresen létrehozva!");
                }

                var error = await response.Content.ReadAsStringAsync();
                return (false, "Hiba: Lehet, hogy már létezik ilyen nevű szolgáltatás.");
            }
            catch (Exception ex)
            {
                return (false, $"Hálózati hiba: {ex.Message}");
            }
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
}