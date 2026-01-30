using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System;

namespace BarberManager.ViewModels
{
    public partial class LoginViewModel : ViewModelBase
    {
        public Action? OnLoginSuccess { get; set; }

        [ObservableProperty]
        private string _username = string.Empty;

        [ObservableProperty]
        private string _password = string.Empty;

        [ObservableProperty]
        private string _errorMessage = string.Empty;

        [RelayCommand]
        public void Login()
        {
            //most csak admin kell a bejelentkezeshez
            if (!string.IsNullOrWhiteSpace(Username) && Password == "admin")
            {
                ErrorMessage = "";
                OnLoginSuccess?.Invoke();
            }
            else
            {
                ErrorMessage = "Hibás felhasználónév vagy jelszó!";
            }
        }
    }
}