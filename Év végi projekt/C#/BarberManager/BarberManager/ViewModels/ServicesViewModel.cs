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
    public partial class ServicesViewModel : ViewModelBase
    {
        private readonly ApiService _api;

        [ObservableProperty] private ObservableCollection<Service> _services = new();
        [ObservableProperty] private bool _isLoading;
        [ObservableProperty] private string _errorMessage = string.Empty;
        [ObservableProperty] private bool _isEditing;
        [ObservableProperty] private Service? _selectedService;

        [ObservableProperty] private string _priceInput = "";
        [ObservableProperty] private string _durationInput = "30";

        public ServicesViewModel(ApiService api)
        {
            _api = api;
            _ = LoadServicesAsync();
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
            PriceInput = "";
            DurationInput = "30";
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
            PriceInput = service.Price.ToString();
            DurationInput = service.DurationMinutes.ToString();
            IsEditing = true;
            ErrorMessage = string.Empty;
        }

        [RelayCommand]
        public async Task SaveService()
        {
            if (SelectedService == null) return;

            if (string.IsNullOrWhiteSpace(SelectedService.Name)) { ErrorMessage = "Add meg a szolgáltatás nevét!"; return; }
            if (string.IsNullOrWhiteSpace(SelectedService.Description)) { ErrorMessage = "Írj egy rövid leírást is!"; return; }

            if (!int.TryParse(PriceInput, out int parsedPrice) || parsedPrice <= 0)
            {
                ErrorMessage = "Az ár csak pozitív egész szám lehet!";
                return;
            }

            if (!int.TryParse(DurationInput, out int parsedDuration) || parsedDuration < 30 || parsedDuration > 60)
            {
                ErrorMessage = "Az időtartamnak 30 és 60 perc közé kell esnie!";
                return;
            }

            SelectedService.Price = parsedPrice;
            SelectedService.DurationMinutes = parsedDuration;

            IsLoading = true;
            ErrorMessage = string.Empty;
            try
            {
                var res = SelectedService.Id == 0 ? await _api.CreateServiceAsync(SelectedService) : await _api.UpdateServiceAsync(SelectedService);

                if (res.IsSuccess)
                {
                    IsEditing = false;
                    await LoadServicesAsync();
                }
                else
                {
                    if (res.Message.Contains("Mar van ilyen") || res.Message.Contains("already exists"))
                        ErrorMessage = "Ilyen nevű szolgáltatásod már van, válassz másikat!";
                    else
                        ErrorMessage = "Nem sikerült a mentés. Ellenőrizd az adatokat!";
                }
            }
            catch { ErrorMessage = "Hálózati hiba történt a szerverrel."; }
            finally { IsLoading = false; }
        }

        [RelayCommand] public void CancelEdit() => IsEditing = false;

        [RelayCommand]
        public async Task DeleteService(Service service)
        {
            if (service == null) return;
            IsLoading = true;
            var result = await _api.DeleteServiceAsync(service.Id);
            if (result.IsSuccess)
                await LoadServicesAsync();
            else
                ErrorMessage = "Ezt a szolgáltatást most nem tudjuk törölni.";
            IsLoading = false;
        }
    }
}