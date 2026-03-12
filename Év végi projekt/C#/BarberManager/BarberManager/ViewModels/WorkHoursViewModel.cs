using CommunityToolkit.Mvvm.Input;
using BarberManager.Services;
using System.Diagnostics;

namespace BarberManager.ViewModels
{
    public partial class WorkHoursViewModel : ViewModelBase
    {
        private readonly ApiService _api;
        public WorkHoursViewModel(ApiService api) => _api = api;

        [RelayCommand]
        public void SaveSchedule()
        {
            // nem csinal semmit mert nincs kesz a fasszopo backend
            Debug.WriteLine("Heti rend mentése gomb megnyomva.");
        }
    }
}