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

        [ObservableProperty]
        private ObservableCollection<Service> _services = new();

        [ObservableProperty]
        private bool _isLoading;

        public ServicesViewModel(ApiService api)
        {
            _api = api;
        }

        [RelayCommand]
        public async Task LoadServicesAsync()
        {
            IsLoading = true;

            try
            {
                var list = await _api.GetServicesAsync();

                Services.Clear();
                foreach (var item in list)
                {
                    Services.Add(item);
                }
            }
            finally
            {
                IsLoading = false;
            }
        }
    }
}