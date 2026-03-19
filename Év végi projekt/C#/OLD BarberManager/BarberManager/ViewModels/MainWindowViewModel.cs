using BarberManager.Services;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Threading.Tasks;

namespace BarberManager.ViewModels;

public partial class MainWindowViewModel : ViewModelBase
{
    public ApiService Api { get; } = new ApiService();

    [ObservableProperty] private ViewModelBase _currentPage = null!;
    [ObservableProperty] private bool _isLoggedIn;
    [ObservableProperty] private Models.Barber? _currentBarber;

    public MainWindowViewModel()
    {
        ShowLoginScreen();
    }

    private void ShowLoginScreen()
    {
        var loginVm = new LoginViewModel(Api);
        loginVm.OnLoginSuccess = async () =>
        {
            CurrentBarber = await Api.GetBarberInfoAsync();
            IsLoggedIn = true;
            NavigateToAppointments();
        };
        CurrentPage = loginVm;
    }

    [RelayCommand]
    public void Logout()
    {
        IsLoggedIn = false;
        CurrentBarber = null;
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


    public void RefreshBarberName(string newName)
    {
        if (CurrentBarber != null)
        {
            CurrentBarber = new Models.Barber
            {
                Id = CurrentBarber.Id,
                Email = CurrentBarber.Email,
                PhoneNum = CurrentBarber.PhoneNum,
                Name = newName
            };
        }
    }
}
