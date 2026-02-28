using BarberManager.Models;
using System;
using System.ComponentModel;
using System.Diagnostics;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

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

        // --- Regisztracio ---
        public async Task<(bool IsSuccess, string Message)> RegisterBarberAsync(string email, string name, string password, string phoneNum)
        {
            var registerData = new
            {
                email = email,
                name = name,
                password = password,
                phoneNum = phoneNum,
                isAdmin = true
            };

            try
            {
                var response = await _httpClient.PostAsJsonAsync("/barberReg", registerData);
                if (response.IsSuccessStatusCode)
                    return (true, "Sikeres regisztráció!");

                var errorMsg = await response.Content.ReadAsStringAsync();
                return (false, "Hiba: Már létezik ilyen felhasználó vagy rossz adatok.");
            }
            catch (Exception ex)
            {
                return (false, $"Szerver hiba: {ex.Message}");
            }
        }

        // --- Bejelentkezes ---
        public async Task<(bool IsSuccess, string Message)> LoginBarberAsync(string email, string name, string password)
        {
            var loginData = new { email = email, name = name, password = password };
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
            catch (Exception ex)
            {
                return (false, $"Hálózati hiba: {ex.Message}");
            }
        }

        // --- Kijelentkezes ---
        public void Logout()
        {
            _jwtToken = string.Empty;
            _httpClient.DefaultRequestHeaders.Authorization = null;
        }

        // --- Barber Lekeres ---
        public async Task<Barber?> GetBarberInfoAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync("/barberGet");
                if (response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadFromJsonAsync<Barber>();
                }
                return null;
            }
            catch(Exception ex)
            {
                Debug.WriteLine($"Hiba a fodrász adatainak lekérésekor: {ex.Message}");
                return null;
            }
        }

        private class LoginResponse
        {
            [JsonPropertyName("message")]
            public string Message { get; set; } = string.Empty;

            [JsonPropertyName("token")]
            public string Token { get; set; } = string.Empty;
        }
    }
}