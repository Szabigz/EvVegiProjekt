using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System;

namespace BarberManager.ViewModels
{
    public partial class AppointmentsViewModel : ViewModelBase
    {
        private DateTime _currentMonday;
        private int _weekShift;

        public DateTime CurrentMonday
        {
            get => _currentMonday;
            set
            {
                SetProperty(ref _currentMonday, value);
                OnPropertyChanged(nameof(Mon));
                OnPropertyChanged(nameof(Tue));
                OnPropertyChanged(nameof(Wed));
                OnPropertyChanged(nameof(Thu));
                OnPropertyChanged(nameof(Fri));
                OnPropertyChanged(nameof(Sat));
            }
        }

        public string Mon => CurrentMonday.ToString("MM.dd");
        public string Tue => CurrentMonday.AddDays(1).ToString("MM.dd");
        public string Wed => CurrentMonday.AddDays(2).ToString("MM.dd");
        public string Thu => CurrentMonday.AddDays(3).ToString("MM.dd");
        public string Fri => CurrentMonday.AddDays(4).ToString("MM.dd");
        public string Sat => CurrentMonday.AddDays(5).ToString("MM.dd");

        public AppointmentsViewModel()
        {
            CurrentMonday = GetMonday(DateTime.Today);
        }

        [RelayCommand]
        public void NextWeek()
        {
            if (_weekShift < 4)
            {
                _weekShift++;
                CurrentMonday = CurrentMonday.AddDays(7);
            }
        }

        [RelayCommand]
        public void PrevWeek()
        {
            if (_weekShift > -2)
            {
                _weekShift--;
                CurrentMonday = CurrentMonday.AddDays(-7);
            }
        }

        private DateTime GetMonday(DateTime date)
        {
            int diff = (7 + (date.DayOfWeek - DayOfWeek.Monday)) % 7;
            return date.AddDays(-diff);
        }
    }
}