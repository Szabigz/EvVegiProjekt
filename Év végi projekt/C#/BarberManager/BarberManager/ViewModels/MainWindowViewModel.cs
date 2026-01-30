using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace BarberManager.ViewModels;

public partial class MainWindowViewModel : ViewModelBase
{
    // ez hogy melyik oldal aktiv jelenleg
    [ObservableProperty]
    private ViewModelBase _currentPage;

    // bal oldal lathatosaga
    [ObservableProperty]
    private bool _isLoggedIn;

    public MainWindowViewModel()
    {
        // Induláskor nincs bejelentkezve
        IsLoggedIn = false;
        ShowLoginScreen();
    }

    private void ShowLoginScreen()
    {
        var loginVm = new LoginViewModel();

        // ha sikeres a login
        loginVm.OnLoginSuccess = () =>
        {
            IsLoggedIn = true;
            // default ablak
            CurrentPage = new AppointmentsViewModel();
        };

        CurrentPage = loginVm;
    }

    [RelayCommand]
    public void Logout()
    {
        IsLoggedIn = false;
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