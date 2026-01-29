using CommunityToolkit.Mvvm.Input;
using System;
using System.Windows.Input;

namespace BarberManager.ViewModels;

public class MainWindowViewModel : ViewModelBase
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

        PrevWeek = new RelayCommand(() =>
        {
            if (_weekShift > -2)
            {
                _weekShift--;
                CurrentMonday = CurrentMonday.AddDays(-7);
            }
        });
    }

    private DateTime GetMonday(DateTime date)
    {
        int diff = (7 + (date.DayOfWeek - DayOfWeek.Monday)) % 7;
        return date.AddDays(-diff);
    }
}
