using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using BarberManager.Services;
using System.Diagnostics;

namespace BarberManager.ViewModels
{
    public partial class ProfileViewModel : ViewModelBase
    {
        private readonly ApiService _api;

        [ObservableProperty] private string _barberName = "Pelda nev";
        [ObservableProperty] private string _barberEmail = "pelda@barbershop.hu";
        [ObservableProperty] private string _barberPhone = "+36 30 123 4567";

        public ProfileViewModel(ApiService api)
        {
            _api = api;
            // majd itt api call hogy ne pelda adatok legyenek
        }

        [RelayCommand]
        public void SaveProfile()
        {
            Debug.WriteLine($"VÁLTOZÁS: Profil mentése - {BarberName}, {BarberPhone}");
        }
    }
}