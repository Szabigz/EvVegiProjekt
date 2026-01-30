using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace BarberManager.ViewModels;

public partial class MainWindowViewModel : ViewModelBase
{
    private DateTime _currentMonday;
    private int _weekShift;

    public DateTime CurrentMonday
    {
        get => _currentMonday;
        set
        {
            _currentMonday = value;
            OnPropertyChanged(nameof(Mon));
            OnPropertyChanged(nameof(Tue));
            OnPropertyChanged(nameof(Wed));
            OnPropertyChanged(nameof(Thu));
            OnPropertyChanged(nameof(Fri));
            OnPropertyChanged(nameof(Sat));
            OnPropertyChanged(nameof(Sun));
        }
    }

    public string Mon => CurrentMonday.ToString("MM.dd");
    public string Tue => CurrentMonday.AddDays(1).ToString("MM.dd");
    public string Wed => CurrentMonday.AddDays(2).ToString("MM.dd");
    public string Thu => CurrentMonday.AddDays(3).ToString("MM.dd");
    public string Fri => CurrentMonday.AddDays(4).ToString("MM.dd");
    public string Sat => CurrentMonday.AddDays(5).ToString("MM.dd");
    public string Sun => CurrentMonday.AddDays(6).ToString("MM.dd");

    public ICommand NextWeek { get; }
    public ICommand PrevWeek { get; }

    public MainWindowViewModel()
    {
        CurrentMonday = GetMonday(DateTime.Today);

        NextWeek = new RelayCommand(() =>
        {
            if (_weekShift < 4)
            {
                _weekShift++;
                CurrentMonday = CurrentMonday.AddDays(7);
            }
        });

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