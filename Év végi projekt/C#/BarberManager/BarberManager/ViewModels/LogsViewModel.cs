using System;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using BarberManager.Models;
using BarberManager.Services;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace BarberManager.ViewModels
{
    public partial class LogsViewModel : ViewModelBase
    {
        private readonly ApiService _api;

        [ObservableProperty]
        private ObservableCollection<LogEntry> _logs = new();
        [ObservableProperty]
        private bool _isLoading;
        [ObservableProperty]
        private string _statusMessage = string.Empty;

        public LogsViewModel(ApiService api)
        {
            _api = api;
            _ = LoadLogs();
        }

        [RelayCommand]
        public async Task LoadLogs()
        {
            IsLoading = true;
            StatusMessage = "";
            try
            {
                var data = await _api.GetMyLogsAsync();
                Logs.Clear();
                foreach (var item in data)
                {
                    Logs.Add(item);
                }
            }
            catch
            {
                StatusMessage = "Hiba a napló betöltésekor.";
            }
            finally
            {
                IsLoading = false;
            }
        }

        [RelayCommand]
        public async Task CleanupLogs()
        {
            IsLoading = true;
            bool success = await _api.CleanupOldLogsAsync();
            if (success)
            {
                await LoadLogs();
                StatusMessage = "30 napnál régebbi bejegyzések törölve.";
            }
            else
            {
                StatusMessage = "Hiba történt a törlés során.";
            }
            IsLoading = false;
        }
    }
}