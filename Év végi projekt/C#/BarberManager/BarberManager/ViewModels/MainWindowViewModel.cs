using BarberManager.Services;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace BarberManager.ViewModels;

public partial class MainWindowViewModel : ViewModelBase
{
    public ApiService Api { get; } = new ApiService();

    [ObservableProperty]
    private ViewModelBase _currentPage;

    [ObservableProperty]
    private bool _isLoggedIn;

    public MainWindowViewModel()
    {
        IsLoggedIn = false;
        ShowLoginScreen();
    }

    private void ShowLoginScreen()
    {
        var loginVm = new LoginViewModel(Api);

        loginVm.OnLoginSuccess = () =>
        {
            IsLoggedIn = true;
            CurrentPage = new AppointmentsViewModel();
        };

        CurrentPage = loginVm;
    }

    [RelayCommand]
    public void Logout()
    {
        IsLoggedIn = false;
        Api.Logout();
        ShowLoginScreen();
    }

    [RelayCommand]
    public void NavigateToAppointments()
    {
        CurrentPage = new AppointmentsViewModel();
    }

    [RelayCommand]
    public void NavigateToTest()
    {
        CurrentPage = new TestViewModel();
    }
}