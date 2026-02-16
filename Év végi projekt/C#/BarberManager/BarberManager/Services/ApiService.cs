using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Threading.Tasks;
using BarberManager.Models;

namespace BarberManager.Services
{
    public class ApiService
    {
        // Beallitasok
        private const string BaseUrl = "http://localhost:3000";

        private readonly HttpClient _httpClient;
        private string _jwtToken = string.Empty;

        public ApiService()
        {
            _httpClient = new HttpClient
            {
                BaseAddress = new Uri(BaseUrl)
            };
        }



    }
}