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

        [ObservableProperty] private bool _isCurrentPasswordVisible;

        [ObservableProperty] private bool _isNewPasswordVisible;

        [ObservableProperty] private bool _isConfirmPasswordVisible;

        public string CurrentPasswordIcon => IsCurrentPasswordVisible ? EyeOpenSvg : EyeClosedSvg;
        public string NewPasswordIcon => IsNewPasswordVisible ? EyeOpenSvg : EyeClosedSvg;
        public string ConfirmPasswordIcon => IsConfirmPasswordVisible ? EyeOpenSvg : EyeClosedSvg;

        private const string EyeOpenSvg = "M21.92,11.6C19.9,6.91,16.1,4,12,4S4.1,6.91,2.08,11.6a1,1,0,0,0,0,.8C4.1,17.09,7.9,20,12,20s7.9-2.91,9.92-7.6A1,1,0,0,0,21.92,11.6ZM12,18c-3.17,0-6.17-2.29-7.9-6C5.83,8.29,8.83,6,12,6s6.17,2.29,7.9,6C18.17,15.71,15.17,18,12,18ZM12,8a4,4,0,1,0,4,4A4,4,0,0,0,12,8Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,14Z";
        private const string EyeClosedSvg = "M14.7649 6.07595C14.9991 6.22231 15.0703 6.53078 14.9239 6.76495C14.4849 7.46742 13.9632 8.10644 13.3702 8.66304L14.5712 9.86405C14.7664 10.0593 14.7664 10.3759 14.5712 10.5712C14.3759 10.7664 14.0593 10.7664 13.8641 10.5712L12.6011 9.30816C11.8049 9.90282 10.9089 10.3621 9.93374 10.651L10.383 12.3276C10.4544 12.5944 10.2961 12.8685 10.0294 12.94C9.76266 13.0115 9.4885 12.8532 9.41703 12.5864L8.95916 10.8775C8.48742 10.958 8.00035 10.9999 7.5 10.9999C6.99964 10.9999 6.51257 10.958 6.04082 10.8775L5.58299 12.5864C5.51153 12.8532 5.23737 13.0115 4.97063 12.94C4.7039 12.8685 4.5456 12.5944 4.61706 12.3277L5.06624 10.651C4.09111 10.3621 3.19503 9.90281 2.3989 9.30814L1.1359 10.5711C0.940638 10.7664 0.624058 10.7664 0.428797 10.5711C0.233537 10.3759 0.233537 10.0593 0.428797 9.86404L1.62982 8.66302C1.03682 8.10643 0.515113 7.46742 0.0760677 6.76495C-0.0702867 6.53078 0.000898544 6.22231 0.235064 6.07595C0.46923 5.9296 0.777703 6.00078 0.924057 6.23495C1.40354 7.00212 1.989 7.68056 2.66233 8.2427C2.67315 8.25096 2.6837 8.25971 2.69397 8.26897C4.00897 9.35527 5.65536 9.9999 7.5 9.9999C10.3078 9.9999 12.6563 8.50629 14.0759 6.23495C14.2223 6.00078 14.5308 5.9296 14.7649 6.07595Z";

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



        [RelayCommand]
        public void ToggleCurrentPasswordVisibility()
        {
            IsCurrentPasswordVisible = !IsCurrentPasswordVisible;
            OnPropertyChanged(nameof(CurrentPasswordIcon));
        }

        [RelayCommand]
        public void ToggleNewPasswordVisibility()
        {
            IsNewPasswordVisible = !IsNewPasswordVisible;
            OnPropertyChanged(nameof(NewPasswordIcon));
        }

        [RelayCommand]
        public void ToggleConfirmPasswordVisibility()
        {
            IsConfirmPasswordVisible = !IsConfirmPasswordVisible;
            OnPropertyChanged(nameof(ConfirmPasswordIcon));
        }
    }
}