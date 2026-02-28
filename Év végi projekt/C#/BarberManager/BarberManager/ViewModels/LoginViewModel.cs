using BarberManager.Services;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace BarberManager.ViewModels
{
    public partial class LoginViewModel : ViewModelBase
    {
        private readonly ApiService _api;
        public Action? OnLoginSuccess { get; set; }

        public LoginViewModel(ApiService api)
        {
            _api = api;
            IsRegisterMode = false;
        }

        [ObservableProperty] private string _name = string.Empty;
        [ObservableProperty] private string _email = string.Empty;
        [ObservableProperty] private string _password = string.Empty;
        [ObservableProperty] private string _phoneNum = string.Empty;
        [ObservableProperty] private string _errorMessage = string.Empty;
        [ObservableProperty] private bool _isRegisterMode;

        // Dinamikus szoveg (szebb es rovidebb)
        public string TitleText => IsRegisterMode ? "Fodrász Regisztráció" : "Fodrász Bejelentkezés";
        public string SubmitButtonText => IsRegisterMode ? "Regisztráció" : "Bejelentkezés";
        public string SwitchModeText => IsRegisterMode ? "Már van fiókod? Lépj be!" : "Még nincs fiókod? Regisztrálj!";

        [RelayCommand]
        public void ToggleMode()
        {
            IsRegisterMode = !IsRegisterMode;
            OnPropertyChanged(nameof(TitleText));
            OnPropertyChanged(nameof(SubmitButtonText));
            OnPropertyChanged(nameof(SwitchModeText));
            ErrorMessage = string.Empty;
        }

        [RelayCommand]
        public async Task SubmitAsync()
        {
            ErrorMessage = string.Empty;

            if (IsRegisterMode)
            {
                if (string.IsNullOrWhiteSpace(Name) || string.IsNullOrWhiteSpace(Email) ||
                    string.IsNullOrWhiteSpace(Password) || string.IsNullOrWhiteSpace(PhoneNum))
                {
                    ErrorMessage = "Minden mezőt tölts ki!";
                    return;
                }

                var (isSuccess, message) = await _api.RegisterBarberAsync(Email, Name, Password, PhoneNum);
                if (isSuccess)
                {
                    ToggleMode();
                    ErrorMessage = "Sikeres regisztráció! Jelentkezz be.";
                }
                else ErrorMessage = message;
            }
            else
            {
                if (string.IsNullOrWhiteSpace(Name) || string.IsNullOrWhiteSpace(Email) || string.IsNullOrWhiteSpace(Password))
                {
                    ErrorMessage = "Név, Email és Jelszó kötelező!";
                    return;
                }

                var (isSuccess, message) = await _api.LoginBarberAsync(Email, Name, Password);
                if (isSuccess) OnLoginSuccess?.Invoke();
                else ErrorMessage = message;
            }
        }
    }
}