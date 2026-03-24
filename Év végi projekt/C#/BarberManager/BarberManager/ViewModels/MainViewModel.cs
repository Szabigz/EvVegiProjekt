using System;
using BarberManager.Services;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace BarberManager.ViewModels
{
    public partial class MainViewModel : ViewModelBase
    {
        public ApiService Api { get; } = new ApiService();

        [ObservableProperty]
        private ViewModelBase _currentPage = null!;
        [ObservableProperty]
        private bool _isLoggedIn;
        [ObservableProperty]
        private Models.Barber? _currentBarber;
        [ObservableProperty]
        private bool _isAdmin;
        [ObservableProperty]
        private bool _isMobile;

        public MainViewModel()
        {
            IsMobile = OperatingSystem.IsAndroid() || OperatingSystem.IsIOS();
            ShowLoginScreen();
        }

        private void ShowLoginScreen()
        {
            var loginVm = new LoginViewModel(Api);
            loginVm.OnLoginSuccess = async () => {
                CurrentBarber = await Api.GetBarberInfoAsync();
                if (CurrentBarber != null)
                {
                    IsLoggedIn = true;
                    IsAdmin = CurrentBarber.IsAdmin;

                    // ha admin
                    if (IsAdmin)
                        NavigateToAdminPanel();
                    // ha barber
                    else
                        NavigateToAppointments();
                }
                else
                {
                    loginVm.ErrorMessage = "Hiba a profil betöltésekor!";
                }
            };
            CurrentPage = loginVm;
        }

        [RelayCommand]
        public void Logout()
        {
            IsLoggedIn = false;
            CurrentBarber = null;
            IsAdmin = false;
            Api.Logout();
            ShowLoginScreen();
        }

        [RelayCommand]
        public void NavigateToAppointments() => CurrentPage = new AppointmentsViewModel(Api);
        [RelayCommand]
        public void NavigateToServices() => CurrentPage = new ServicesViewModel(Api);
        [RelayCommand]
        public void NavigateToWorkHours() => CurrentPage = new WorkHoursViewModel(Api);
        [RelayCommand]
        public void NavigateToProfile() => CurrentPage = new ProfileViewModel(Api, this);
        [RelayCommand]
        public void NavigateToLogs() => CurrentPage = new LogsViewModel(Api);
        [RelayCommand]
        public void NavigateToAdminPanel() => CurrentPage = new AdminPanelViewModel(Api);

        public void RefreshBarberName(string newName)
        {
            if (CurrentBarber != null)
            {
                CurrentBarber = new Models.Barber { Id = CurrentBarber.Id, Email = CurrentBarber.Email, PhoneNum = CurrentBarber.PhoneNum, Name = newName, IsAdmin = CurrentBarber.IsAdmin };
            }
        }
    }
}