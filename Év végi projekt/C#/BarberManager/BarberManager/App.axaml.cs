using Avalonia;
using Avalonia.Controls.ApplicationLifetimes;
using Avalonia.Data.Core;
using Avalonia.Data.Core.Plugins;
using Avalonia.Markup.Xaml;
using BarberManager.ViewModels;
using BarberManager.Views;
using System;
using System.Linq;

namespace BarberManager;

public partial class App : Application
{
    public override void Initialize()
    {
        AvaloniaXamlLoader.Load(this);
    }

    public override void OnFrameworkInitializationCompleted()
    {
        try
        {
            if (ApplicationLifetime is IClassicDesktopStyleApplicationLifetime desktop)
            {
                desktop.MainWindow = new MainWindow
                {
                    DataContext = new MainViewModel()
                };
            }
            else if (ApplicationLifetime is ISingleViewApplicationLifetime singleViewPlatform)
            {
                // Próbáljuk meg elõször a sima MainView-val (ami asztalin megy)
                // Ha ezzel elindul, akkor a hiba a MainViewMobile.axaml-ben van!
                singleViewPlatform.MainView = new MainViewMobile
                {
                    DataContext = new MainViewModel()
                };
            }
        }
        catch (Exception ex)
        {
            // Ha van hiba, írjuk ki a konzolra (ADB-vel látszik majd)
            System.Diagnostics.Debug.WriteLine("CRASH: " + ex.Message);
        }

        base.OnFrameworkInitializationCompleted();
    }

    private void DisableAvaloniaDataAnnotationValidation()
    {
        // Get an array of plugins to remove
        var dataValidationPluginsToRemove =
            BindingPlugins.DataValidators.OfType<DataAnnotationsValidationPlugin>().ToArray();

        // remove each entry found
        foreach (var plugin in dataValidationPluginsToRemove)
        {
            BindingPlugins.DataValidators.Remove(plugin);
        }
    }
}