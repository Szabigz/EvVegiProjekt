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

        // --- naptar tartalma es panelek ---
        [ObservableProperty] private ObservableCollection<AppointmentCard> _appointments = new();
        [ObservableProperty] private bool _isAddingAppointment;
        [ObservableProperty] private bool _isViewingDetails;
        [ObservableProperty] private AppointmentCard? _selectedAppointment;
        [ObservableProperty] private string _actionButtonText = "Időpont Lemondása";

        // --- uj foglalas adatok, + dropdown adatok ---
        [ObservableProperty] private ObservableCollection<User> _allUsers = new();
        [ObservableProperty] private ObservableCollection<Service> _allServices = new();

        [ObservableProperty] private User? _newSelectedUser;
        [ObservableProperty] private Service? _newSelectedService;
        [ObservableProperty] private DateTimeOffset _newDate = DateTimeOffset.Now;
        [ObservableProperty] private string _newTime = "10:00";
        [ObservableProperty] private string _newComment = string.Empty;
        [ObservableProperty] private string _addErrorMessage = string.Empty;
        [ObservableProperty] private bool _isSaving;

        // datum figyeles
        public DateTime CurrentMonday
        {
            get => _currentMonday;
            set { SetProperty(ref _currentMonday, value); UpdateDays(); }
        }

        // napok
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
            _ = LoadDropdownsAsync(); // vendegek es szolgaltatasok betoltese indulaskor
        }

        private async Task LoadDropdownsAsync()
        {
            var users = await _api.GetAllUsersAsync();
            var services = await _api.GetServicesAsync();

            AllUsers = new ObservableCollection<User>(users);
            AllServices = new ObservableCollection<Service>(services);
        }

        public async Task LoadData()
        {
            var data = await _api.GetMyAppointmentsAsync();
            var newList = new ObservableCollection<AppointmentCard>();

            foreach (var dbApp in data)
            {
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

        [RelayCommand] public void CloseDetails() { IsViewingDetails = false; SelectedAppointment = null; }

        [RelayCommand]
        public void ShowAddPanel()
        {
            AddErrorMessage = string.Empty;
            NewComment = string.Empty;
            NewTime = "10:00";
            NewSelectedUser = null;
            NewSelectedService = null;
            NewDate = DateTimeOffset.Now;

            IsAddingAppointment = true;
        }

        [RelayCommand] public void CloseAddPanel() => IsAddingAppointment = false;

        // ---  uj foglalas kuldes ---
        [RelayCommand]
        public async Task SaveAppointmentAsync()
        {
            if (NewSelectedService == null) { AddErrorMessage = "Válassz szolgáltatást!"; return; }

            string[] timeParts = NewTime.Split(':');
            if (timeParts.Length < 2 || !int.TryParse(timeParts[0], out int hour) || !int.TryParse(timeParts[1], out int min))
            {
                AddErrorMessage = "Rossz időformátum! (Pl.: 10:30)";
                return;
            }

            IsSaving = true;
            AddErrorMessage = string.Empty;

            try
            {
                // idozona nelkuli datum es ido
                DateTime raw = NewDate.DateTime.Date;
                DateTime startDate = new DateTime(raw.Year, raw.Month, raw.Day, hour, min, 0, DateTimeKind.Unspecified);

                int duration = NewSelectedService.DurationMinutes > 0 ? NewSelectedService.DurationMinutes : 30;
                DateTime endDate = startDate.AddMinutes(duration);

                var result = await _api.PostAppointmentAsync(NewSelectedService.Id, NewSelectedUser?.Id, startDate, endDate, NewComment);

                if (result.IsSuccess)
                {
                    IsAddingAppointment = false;
                    await LoadData();
                }
                else { AddErrorMessage = result.Message; }
            }
            catch { AddErrorMessage = "Hiba történt a mentés során."; }
            finally { IsSaving = false; }
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
                // sima lemondas
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