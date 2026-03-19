using System;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using BarberManager.Models;
using BarberManager.Services;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace BarberManager.ViewModels
{
    public partial class ServicesViewModel : ViewModelBase
    {
        private readonly ApiService _api;

        [ObservableProperty] private ObservableCollection<Service> _services = new();
        [ObservableProperty] private bool _isLoading;
        [ObservableProperty] private string _errorMessage = string.Empty;

        [ObservableProperty] private bool _isEditing;
        [ObservableProperty] private Service? _selectedService;

        public ServicesViewModel(ApiService api)
        {
            _api = api;
            SelectedService = new Service { Name = "", Price = 0, Description = "", DurationMinutes = 30 };
            _ = LoadServicesAsync(); // toltse be ha megnyitjuk
        }

        [RelayCommand]
        public async Task LoadServicesAsync()
        {
            IsLoading = true;
            try
            {
                var list = await _api.GetServicesAsync();
                Services.Clear();
                foreach (var item in list) Services.Add(item);
            }
            finally { IsLoading = false; }
        }

        [RelayCommand]
        public void ShowAddWindow()
        {
            SelectedService = new Service { Id = 0, Name = "", Price = 0, Description = "", DurationMinutes = 30 };
            IsEditing = true;
            ErrorMessage = string.Empty;
        }

        [RelayCommand]
        public void EditService(Service service)
        {
            if (service == null) return;

            
            SelectedService = new Service
            {
                Id = service.Id,
                Name = service.Name,
                Price = service.Price,
                Description = service.Description,
                DurationMinutes = service.DurationMinutes,
                BarberId = service.BarberId
            };
            IsEditing = true;
            ErrorMessage = string.Empty;
        }

        [RelayCommand]
        public async Task DeleteService(Service service)
        {
            if (service == null) return;
            IsLoading = true;
            try
            {
                var result = await _api.DeleteServiceAsync(service.Id);
                if (result.IsSuccess) await LoadServicesAsync();
                else ErrorMessage = result.Message;
            }
            finally { IsLoading = false; }
        }

        [RelayCommand]
        public void CancelEdit()
        {
            IsEditing = false;
        }

        [RelayCommand]
        public async Task SaveService()
        {
            if (SelectedService == null) return;

            if (string.IsNullOrWhiteSpace(SelectedService.Name) || SelectedService.Price <= 0)
            {
                ErrorMessage = "Kérlek töltsd ki a nevet és az árat!";
                return;
            }

            IsLoading = true;
            ErrorMessage = string.Empty;

            try
            {
                bool isSuccess;
                string message;

                if (SelectedService.Id == 0)
                {
                    // ID 0 = nincs az adatbazisban -> letrehozas
                    var result = await _api.CreateServiceAsync(SelectedService);
                    isSuccess = result.IsSuccess;
                    message = result.Message;
                }
                else
                {
                    // ID > 0 = mar letezik a dbben -> modositas
                    var result = await _api.UpdateServiceAsync(SelectedService);
                    isSuccess = result.IsSuccess;
                    message = result.Message;
                }

                if (isSuccess)
                {
                    IsEditing = false;
                    await LoadServicesAsync(); // lista frissites
                }
                else
                {
                    ErrorMessage = message;
                }
            }
            catch (Exception)
            {
                ErrorMessage = "Hiba történt a mentés során.";
            }

            // ha sikerul a try akkor ez lefut utana tulajdonkeppen nem fut le
            finally
            {
                IsLoading = false;
            }
        }
    }
}