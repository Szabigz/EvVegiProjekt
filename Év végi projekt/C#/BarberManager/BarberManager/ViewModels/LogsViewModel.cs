using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BarberManager.Services;

namespace BarberManager.ViewModels
{
    public partial class LogsViewModel : ViewModelBase
    {
        private readonly ApiService _api;

        public LogsViewModel(ApiService api)
        {
            _api = api;

        }
    }
}
