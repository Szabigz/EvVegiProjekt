using System;
using System.Globalization;
using System.IO;
using Avalonia.Data.Converters;
using Avalonia.Media.Imaging;

namespace BarberManager.Converters;

public class Base64ToImageConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        if (value is string base64String && !string.IsNullOrEmpty(base64String))
        {
            try
            {
                string cleanBase64 = base64String.Contains(",") ? base64String.Split(',')[1] : base64String;
                byte[] imageBytes = System.Convert.FromBase64String(cleanBase64);
                using var ms = new MemoryStream(imageBytes);
                return new Bitmap(ms);
            }
            catch { return null; }
        }
        return null;
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture) => throw new NotImplementedException();
}