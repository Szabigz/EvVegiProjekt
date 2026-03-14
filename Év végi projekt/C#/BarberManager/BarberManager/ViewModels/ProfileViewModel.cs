using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using BarberManager.Services;
using System.Threading.Tasks;

namespace BarberManager.ViewModels
{
    public partial class ProfileViewModel : ViewModelBase
    {
        private readonly ApiService _api;
        private readonly MainWindowViewModel _mainVm; 
        private int _barberId;

        [ObservableProperty] private string _barberName = string.Empty;
        [ObservableProperty] private string _barberEmail = string.Empty;
        [ObservableProperty] private string _barberPhone = string.Empty;

        [ObservableProperty] private string _statusMessage = string.Empty;
        [ObservableProperty] private bool _isSaving;

        public ProfileViewModel(ApiService api, MainWindowViewModel mainVm)
        {
            _api = api;
            _mainVm = mainVm;
            _ = LoadProfileAsync();
        }

        private async Task LoadProfileAsync()
        {
            var barber = await _api.GetBarberInfoAsync();
            if (barber != null)
            {
                _barberId = barber.Id;
                BarberName = barber.Name;
                BarberEmail = barber.Email;
                BarberPhone = barber.PhoneNum.ToString();
            }
        }

        [RelayCommand]
        public async Task SaveProfileAsync()
        {
            if (string.IsNullOrWhiteSpace(BarberName))
            {
                StatusMessage = "A név nem lehet üres!";
                return;
            }

            IsSaving = true;
            StatusMessage = "Mentés folyamatban...";

            var result = await _api.UpdateBarberProfileAsync(_barberId, BarberName, BarberPhone);

            StatusMessage = result.Message;

            if (result.IsSuccess)
            {
                _mainVm.RefreshBarberName(BarberName);
            }

            IsSaving = false;
        }
    }
}