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
        [ObservableProperty] private string _statusMessageColor = "Green"; 
        [ObservableProperty] private bool _isSaving;

        [ObservableProperty] private string _currentPassword = string.Empty;
        [ObservableProperty] private string _newPassword = string.Empty;
        [ObservableProperty] private string _confirmPassword = string.Empty;

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
                StatusMessageColor = "Red";
                return;
            }

            if (!string.IsNullOrEmpty(NewPassword) && NewPassword != ConfirmPassword)
            {
                StatusMessage = "Az új jelszavak nem egyeznek!";
                StatusMessageColor = "Red"; 
                return;
            }

            IsSaving = true;
            StatusMessage = "Mentés folyamatban...";
            StatusMessageColor = "Black";

            var result = await _api.UpdateBarberProfileAsync(
                _barberId,
                BarberName,
                BarberPhone,
                string.IsNullOrEmpty(NewPassword) ? null : NewPassword
            );

            StatusMessage = result.Message;
            StatusMessageColor = result.IsSuccess ? "Green" : "Red";

            if (result.IsSuccess)
            {
                _mainVm.RefreshBarberName(BarberName);
            }

            IsSaving = false;
        }
    }
}