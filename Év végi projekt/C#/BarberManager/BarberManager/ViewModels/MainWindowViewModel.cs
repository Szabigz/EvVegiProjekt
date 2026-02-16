using BarberManager.Services;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace BarberManager.ViewModels;

public partial class MainWindowViewModel : ViewModelBase
{
    // public for now, kesobb lehet konstruktorban tovabb adni tobbi vmnek
    public ApiService Api { get; } = new ApiService();

    // jelenlegi oldal
    [ObservableProperty]
    private ViewModelBase _currentPage;

    [ObservableProperty]
    private bool _isLoggedIn;

    public MainWindowViewModel()
    {
        // Kijelentkezve indul
        IsLoggedIn = false;
        ShowLoginScreen();
    }

    private void ShowLoginScreen()
    {
        var loginVm = new LoginViewModel();

        // ha sikeres login
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