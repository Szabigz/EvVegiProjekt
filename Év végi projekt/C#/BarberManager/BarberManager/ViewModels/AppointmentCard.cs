using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CommunityToolkit.Mvvm.ComponentModel;

namespace BarberManager.ViewModels
{
    public partial class AppointmentCard : ObservableObject
    {
        [ObservableProperty] private int _id;
        [ObservableProperty] private DateTime _startTime;
        [ObservableProperty] private DateTime _endTime;
        [ObservableProperty] private string _status = string.Empty;

        [ObservableProperty] private string _guestName = string.Empty;
        [ObservableProperty] private string _guestEmail = string.Empty;
        [ObservableProperty] private string _guestPhone = string.Empty;

        [ObservableProperty] private string _serviceName = string.Empty;
        [ObservableProperty] private string _servicePrice = string.Empty;
        [ObservableProperty] private string _timeString = string.Empty;
        [ObservableProperty] private string _comment = string.Empty;
        [ObservableProperty] private bool _hasComment;

        [ObservableProperty] private string _backgroundColor = "#3498db";
        [ObservableProperty] private bool _isCanceled;
    }
}
