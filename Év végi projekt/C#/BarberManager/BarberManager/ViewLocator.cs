using System;
using System.Diagnostics.CodeAnalysis;
using Avalonia.Controls;
using Avalonia.Controls.Templates;
using BarberManager.ViewModels;

namespace BarberManager;

public class ViewLocator : IDataTemplate
{
    public Control? Build(object? param)
    {
        if (param is null) return null;

        var name = param.GetType().FullName!.Replace("ViewModel", "View", StringComparison.Ordinal);

        if (OperatingSystem.IsAndroid() || OperatingSystem.IsIOS())
        {
            var mobileName = name + "Mobile";
            var mobileType = Type.GetType(mobileName);
            if (mobileType != null)
            {
                return (Control)Activator.CreateInstance(mobileType)!;
            }
        }

        var type = Type.GetType(name);
        if (type != null)
        {
            return (Control)Activator.CreateInstance(type)!;
        }

        return new TextBlock { Text = "Not Found: " + name };
    }

    public bool Match(object? data) => data is ViewModelBase;
}