using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using BarberManager.Services;
using BarberManager.Models;

namespace BarberManager.ViewModels
{
    public partial class AppointmentsViewModel : ViewModelBase
    {
        private readonly ApiService _api;
        private DateTime _currentMonday;
        private int _weekShift;

        // naptar tartalma
        [ObservableProperty] private ObservableCollection<AppointmentCard> _appointments = new();

        // panelek kapcsolgatasa
        [ObservableProperty] private bool _isAddingAppointment;
        [ObservableProperty] private bool _isViewingDetails;
        [ObservableProperty] private AppointmentCard? _selectedAppointment;

        // gomb szovege, attol fuggeon mit akarok csinalni
        [ObservableProperty] private string _actionButtonText = "Időpont Lemondása";

        // datum figyeles
        public DateTime CurrentMonday
        {
            get => _currentMonday;
            set { SetProperty(ref _currentMonday, value); UpdateDays(); }
        }

        // napok formázása... unom már
        public string Mon => CurrentMonday.ToString("MM.dd");
        public string Tue => CurrentMonday.AddDays(1).ToString("MM.dd");
        public string Wed => CurrentMonday.AddDays(2).ToString("MM.dd");
        public string Thu => CurrentMonday.AddDays(3).ToString("MM.dd");
        public string Fri => CurrentMonday.AddDays(4).ToString("MM.dd");
        public string Sat => CurrentMonday.AddDays(5).ToString("MM.dd");

        public AppointmentsViewModel(ApiService api)
        {
            _api = api;
            CurrentMonday = GetMonday(DateTime.Today);
            _ = LoadData();
        }

        // adatok lekerese backendbol, ha nem megy felrobbantom izraelt
        public async Task LoadData()
        {
            var data = await _api.GetMyAppointmentsAsync();
            var newList = new ObservableCollection<AppointmentCard>();

            foreach (var dbApp in data)
            {
                // adatbazisbol valami lathatot kell csinalni, ez lehete jobb is de erdekel
                newList.Add(new AppointmentCard
                {
                    Id = dbApp.Id,
                    StartTime = dbApp.StartTime,
                    EndTime = dbApp.EndTime,
                    Status = dbApp.Status,
                    Comment = dbApp.Comment ?? "",
                    HasComment = !string.IsNullOrEmpty(dbApp.Comment),

                    GuestName = dbApp.User?.Name ?? "Ismeretlen Vendég",
                    GuestEmail = dbApp.User?.Email ?? "Nincs email",
                    GuestPhone = dbApp.User?.PhoneNum ?? "Nincs telefon",

                    ServiceName = dbApp.Service?.Name ?? "Szolgáltatás",
                    ServicePrice = dbApp.Service != null ? $"{dbApp.Service.Price} Ft" : "Ismeretlen ár",

                    TimeString = $"{dbApp.StartTime:HH:mm} - {dbApp.EndTime:HH:mm}"
                });
            }
            Appointments = newList;
        }

        // kovi het
        [RelayCommand] public async Task NextWeek() { _weekShift++; CurrentMonday = CurrentMonday.AddDays(7); await LoadData(); }

        // elozo het
        [RelayCommand] public async Task PrevWeek() { _weekShift--; CurrentMonday = CurrentMonday.AddDays(-7); await LoadData(); }

        // reszletek gomb
        [RelayCommand]
        public void ViewDetails(AppointmentCard app)
        {
            if (app == null) return;
            SelectedAppointment = app;
            ActionButtonText = app.Status == "canceled" ? "Időpont Végleges Törlése" : "Időpont Lemondása";
            IsViewingDetails = true;
        }

        // panel bezarasa
        [RelayCommand]
        public void CloseDetails()
        {
            IsViewingDetails = false;
            SelectedAppointment = null;
        }

        // lemondas vagy torles
        [RelayCommand]
        public async Task ExecuteAction()
        {
            if (SelectedAppointment == null) return;

            if (SelectedAppointment.Status == "canceled")
            {
                // ha mar le van mondva akkor torles
                var success = await _api.CancelAppointmentAsync(SelectedAppointment.Id);
                if (success) { IsViewingDetails = false; await LoadData(); }
            }
            else
            {
                // csak egy sima lemondas nem tudom minek
                var success = await _api.UpdateAppointmentStatusAsync(SelectedAppointment.Id, "canceled");
                if (success) { IsViewingDetails = false; await LoadData(); }
            }
        }

        // ui frissites
        private void UpdateDays()
        {
            OnPropertyChanged(nameof(Mon)); OnPropertyChanged(nameof(Tue)); OnPropertyChanged(nameof(Wed));
            OnPropertyChanged(nameof(Thu)); OnPropertyChanged(nameof(Fri)); OnPropertyChanged(nameof(Sat));
        }

        // hetfo kiszamolas
        private DateTime GetMonday(DateTime date)
        {
            int diff = (7 + (date.DayOfWeek - DayOfWeek.Monday)) % 7;
            return date.AddDays(-diff).Date;
        }
    }
}