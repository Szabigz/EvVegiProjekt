using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using BarberManager.Models;
using BarberManager.Services;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace BarberManager.ViewModels
{
    public partial class AppointmentsViewModel : ViewModelBase
    {
        private readonly ApiService _api;
        private DateTime _currentMonday;

        [ObservableProperty]
        private ObservableCollection<AppointmentCard> _appointments = new();
        [ObservableProperty]
        private bool _isAddingAppointment;
        [ObservableProperty]
        private bool _isViewingDetails;
        [ObservableProperty]
        private AppointmentCard? _selectedAppointment;
        [ObservableProperty]
        private string _actionButtonText = "Időpont Lemondása";

        [ObservableProperty]
        private ObservableCollection<User> _allUsers = new();
        [ObservableProperty]
        private ObservableCollection<Service> _allServices = new();
        [ObservableProperty]
        private ObservableCollection<string> _availableTimeSlots = new();

        [ObservableProperty]
        private User? _newSelectedUser;
        [ObservableProperty]
        private Service? _newSelectedService;
        [ObservableProperty]
        private DateTimeOffset _newDate = DateTimeOffset.Now;
        [ObservableProperty]
        private string _newTime = "";
        [ObservableProperty]
        private string _newComment = string.Empty;
        [ObservableProperty]
        private string _addErrorMessage = string.Empty;
        [ObservableProperty]
        private bool _isSaving;

        public DateTime CurrentMonday
        {
            get => _currentMonday;
            set
            {
                SetProperty(ref _currentMonday, value);
                UpdateDays();
            }
        }
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
            _ = LoadDropdownsAsync();
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
                    GuestName = dbApp.User?.Name ?? "Vendég",
                    GuestEmail = dbApp.User?.Email ?? "",
                    GuestPhone = dbApp.User?.PhoneNum ?? "",
                    ServiceName = dbApp.Service?.Name ?? "Szolgáltatás",
                    ServicePrice = $"{dbApp.Service?.Price} Ft",
                    TimeString = $"{dbApp.StartTime:HH:mm} - {dbApp.EndTime:HH:mm}"
                });
            }
            Appointments = newList;
        }

        partial void OnNewDateChanged(DateTimeOffset value)
        {
            _ = LoadAvailableSlotsAsync();
        }

        private async Task LoadAvailableSlotsAsync()
        {
            AvailableTimeSlots.Clear();
            var barber = await _api.GetBarberInfoAsync();
            if (barber == null)
                return;
            var slots =
                await _api.GetAvailableSlotsAsync(barber.Id, NewDate.DateTime);
            foreach (var slot in slots)
                AvailableTimeSlots.Add(slot.ToString("HH:mm"));
            if (AvailableTimeSlots.Count > 0)
                NewTime = AvailableTimeSlots[0];
        }

        [RelayCommand]
        public void ShowAddPanel()
        {
            AddErrorMessage = "";
            NewComment = "";
            NewSelectedUser = null;
            NewSelectedService = null;
            NewDate = DateTimeOffset.Now;
            IsAddingAppointment = true;
        }

        [RelayCommand]
        public async Task SaveAppointmentAsync()
        {
            if (NewSelectedService == null || string.IsNullOrEmpty(NewTime))
            {
                AddErrorMessage = "Hiányzó adatok!";
                return;
            }
            IsSaving = true;
            try
            {
                var timeParts = NewTime.Split(':');
                int hour = int.Parse(timeParts[0]);
                int min = int.Parse(timeParts[1]);
                DateTime start = new DateTime(NewDate.Year, NewDate.Month, NewDate.Day,
                                              hour, min, 0);

                DateTime end = start.AddHours(1);

                var res = await _api.PostAppointmentAsync(
                    NewSelectedService.Id, NewSelectedUser?.Id, start, end, NewComment);
                if (res.IsSuccess)
                {
                    IsAddingAppointment = false;
                    await LoadData();
                }
                else
                    AddErrorMessage = res.Message;
            }
            catch
            {
                AddErrorMessage = "Rendszerhiba!";
            }
            finally
            {
                IsSaving = false;
            }
        }

        [RelayCommand]
        public async Task MarkAsDone(AppointmentCard app)
        {
            if (await _api.UpdateAppointmentStatusAsync(app.Id, "completed"))
                await LoadData();
        }
        [RelayCommand]
        public void ViewDetails(AppointmentCard app)
        {
            SelectedAppointment = app;
            ActionButtonText = (app.Status == "canceled" || app.Status == "completed")
                                   ? "Végleges Törlés"
                                   : "Időpont Lemondása";
            IsViewingDetails = true;
        }
        [RelayCommand]
        public void CloseDetails() => IsViewingDetails = false;
        [RelayCommand]
        public void CloseAddPanel() => IsAddingAppointment = false;
        [RelayCommand]
        public async Task NextWeek()
        {
            CurrentMonday = CurrentMonday.AddDays(7);
            await LoadData();
        }
        [RelayCommand]
        public async Task PrevWeek()
        {
            CurrentMonday = CurrentMonday.AddDays(-7);
            await LoadData();
        }
        [RelayCommand]
        public async Task ExecuteAction()
        {
            if (SelectedAppointment == null)
                return;
            bool success =
                (SelectedAppointment.Status == "canceled" ||
                 SelectedAppointment.Status == "completed")
                    ? await _api.CancelAppointmentAsync(SelectedAppointment.Id)
                    : await _api.UpdateAppointmentStatusAsync(SelectedAppointment.Id,
                                                              "canceled");
            if (success)
            {
                IsViewingDetails = false;
                await LoadData();
            }
        }
        private void UpdateDays()
        {
            OnPropertyChanged(nameof(Mon));
            OnPropertyChanged(nameof(Tue));
            OnPropertyChanged(nameof(Wed));
            OnPropertyChanged(nameof(Thu));
            OnPropertyChanged(nameof(Fri));
            OnPropertyChanged(nameof(Sat));
        }
        private DateTime GetMonday(DateTime d)
        {
            int diff = (7 + (d.DayOfWeek - DayOfWeek.Monday)) % 7;
            return d.AddDays(-diff).Date;
        }
    }
}