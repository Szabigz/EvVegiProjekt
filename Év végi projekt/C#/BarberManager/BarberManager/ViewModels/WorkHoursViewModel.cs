using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BarberManager.Models;
using BarberManager.Services;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace BarberManager.ViewModels
{
    public partial class WorkDayDisplay : ObservableObject
    {
        public int DayNumber { get; set; }
        [ObservableProperty] private string _dayName = "";
        [ObservableProperty] private string _start = "08:00";
        [ObservableProperty] private string _end = "16:00";
        public int DbId { get; set; }
    }

    public partial class WorkHoursViewModel : ViewModelBase
    {
        private readonly ApiService _api;

        [ObservableProperty] private ObservableCollection<WorkDayDisplay> _days = new();
        [ObservableProperty] private bool _isLoading;
        [ObservableProperty] private string _statusMessage = "";

        public WorkHoursViewModel(ApiService api)
        {
            _api = api;
            string[] nevek = { "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat" };
            for (int i = 0; i < 6; i++)
            {
                Days.Add(new WorkDayDisplay { DayNumber = i + 1, DayName = nevek[i] });
            }

            _ = LoadData();
        }

        public async Task LoadData()
        {
            IsLoading = true;
            var results = await _api.GetMyWorkHoursAsync();

            foreach (var dbItem in results)
            {
                var uiItem = Days.FirstOrDefault(d => d.DayNumber == dbItem.DayOfWeek);
                if (uiItem != null)
                {
                    uiItem.DbId = dbItem.Id;
                    uiItem.Start = dbItem.StartTime.Length >= 5 ? dbItem.StartTime.Substring(0, 5) : dbItem.StartTime;
                    uiItem.End = dbItem.EndTime.Length >= 5 ? dbItem.EndTime.Substring(0, 5) : dbItem.EndTime;
                }
            }
            IsLoading = false;
        }


        [RelayCommand]
        public async Task SaveAll()
        {
            StatusMessage = "";

            foreach (var day in Days)
            {
                if (!TimeSpan.TryParse(day.Start, out var s) || !TimeSpan.TryParse(day.End, out var e))
                {
                    StatusMessage = "HH:mm formátumot használj (pl. 08:30)!";
                    return;
                }

                if (s >= e)
                {
                    StatusMessage = $"{day.DayName}: A kezdésnek előbb kell lennie a végzésnél!";
                    return;
                }
            }

            IsLoading = true;
            StatusMessage = "Mentés folyamatban...";
            bool allOk = true;

            foreach (var day in Days)
            {
                var wh = new WorkHour
                {
                    Id = day.DbId,
                    DayOfWeek = day.DayNumber,
                    StartTime = day.Start + ":00",
                    EndTime = day.End + ":00"
                };

                var success = await _api.SaveWorkHourAsync(wh);
                if (!success) allOk = false;
            }

            StatusMessage = allOk ? "Minden változtatást sikeresen mentettünk!" : "Néhány napot nem sikerült menteni.";
            IsLoading = false;
            await LoadData();
        }
    }
}