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

            //ideiglenes szar hogy ne sirjon az xaml
            SelectedService = new Service { Name = "", Price = 0 };
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
            SelectedService = new Service { Name = "Új szolgáltatás", Price = 0 };
            IsEditing = true;
        }

        [RelayCommand]
        public void EditService(Service service)
        {
            SelectedService = service;
            IsEditing = true; // -> szerkeszto nezet
        }

        [RelayCommand]
        public void DeleteService(Service service)
        {
            Services.Remove(service);
        }

        [RelayCommand]
        public void CancelEdit()
        {
            IsEditing = false; // -> lista nezet
        }


        [RelayCommand]
        public async Task SaveService()
        {
            if (SelectedService == null) return;

            // Alapvető ellenőrzés
            if (string.IsNullOrWhiteSpace(SelectedService.Name) || SelectedService.Price <= 0)
            {
                ErrorMessage = "Kérlek töltsd ki a nevet és az árat!";
                return;
            }

            IsLoading = true;
            ErrorMessage = string.Empty;

            try
            {
                var result = await _api.CreateServiceAsync(SelectedService);

                if (result.IsSuccess)
                {
                    IsEditing = false; 
                    await LoadServicesAsync(); 
                }
                else
                {
                    ErrorMessage = result.Message;
                }
            }
            catch (Exception ex)
            {
                ErrorMessage = "Hiba történt a mentés során.";
            }
            finally
            {
                IsLoading = false;
            }
        }
    }
}