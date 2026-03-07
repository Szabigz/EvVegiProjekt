using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
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
                if (response.IsSuccessStatusCode) return (true, "Sikeres regisztráció!");
                return (false, "Hiba: Már létezik ilyen felhasználó vagy hibás adatok.");
            }
            catch (Exception ex) { return (false, $"Szerver hiba: {ex.Message}"); }
        }

        // --- login ---
        public async Task<(bool IsSuccess, string Message)> LoginBarberAsync(string email, string name, string password)
        {
            var loginData = new { email, name, password };
            try
            {
                var response = await _httpClient.PostAsJsonAsync("/barberLogin", loginData);
                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadFromJsonAsync<LoginResponse>();
                    if (result != null && !string.IsNullOrEmpty(result.Token))
                    {
                        _jwtToken = result.Token;
                        SetAuthorizationHeader();
                        return (true, "Sikeres bejelentkezés!");
                    }
                }
                return (false, "Hibás név, email vagy jelszó!");
            }
            catch (Exception ex) { return (false, $"Hálózati hiba: {ex.Message}"); }
        }

        // --- barber lekeres ---
        public async Task<Barber?> GetBarberInfoAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync("/barberGet");
                if (response.IsSuccessStatusCode)
                {
                    var list = await response.Content.ReadFromJsonAsync<List<Barber>>();
                    return list?.FirstOrDefault();
                }
                return null;
            }
            catch { return null; }
        }

        // --- Szolgaltatasok lekeres ---
        public async Task<List<Service>> GetServicesAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync("/servicesGet");
                if (response.IsSuccessStatusCode)
                {
                    var services = await response.Content.ReadFromJsonAsync<List<Service>>();
                    return services ?? new List<Service>();
                }
                return new List<Service>();
            }
            catch
            {
                return new List<Service>();
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