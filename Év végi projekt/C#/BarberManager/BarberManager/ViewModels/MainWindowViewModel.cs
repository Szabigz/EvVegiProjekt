using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace BarberManager.ViewModels;

public partial class MainWindowViewModel : ViewModelBase
{
    // Ez tárolja, hogy éppen melyik nézet aktív
    [ObservableProperty]
    private ViewModelBase _currentPage;

    public MainWindowViewModel()
    {
        // Induláskor időpontok nézet
        CurrentPage = new AppointmentsViewModel();
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