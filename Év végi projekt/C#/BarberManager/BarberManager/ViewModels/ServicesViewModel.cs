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
        public void SaveService()
        {
            // api call
            IsEditing = false; // mentes utan -> lista nezet
        }
    }
}