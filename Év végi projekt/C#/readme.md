# BarberManager - C# Asztali Alkalmazás

Ez a Slick Barber Shop rendszer asztali adminisztrációs felülete. Az alkalmazás célja az időpontok, szolgáltatások és statisztikák kezelése a fodrászok számára.


* Keretrendszer: Avalonia UI (MVVM)
* Logika: CommunityToolkit.Mvvm (.NET 8)

## Projekt Mappaszerkezet 
### 2026-01-29

```text
Év végi projekt/C#/
├── BarberManager/
│   ├── BarberManager/
│   │   ├── App.axaml
│   │   ├── App.axaml.cs
│   │   ├── app.manifest
│   │   ├── Assets/
│   │   │   └── avalonia-logo.ico
│   │   ├── BarberManager.csproj
│   │   ├── Program.cs
│   │   ├── ViewLocator.cs
│   │   ├── ViewModels/
│   │   │   ├── AppointmentsViewModel.cs
│   │   │   ├── MainWindowViewModel.cs
│   │   │   ├── TestViewModel.cs
│   │   │   └── ViewModelBase.cs
│   │   └── Views/
│   │       ├── AppointmentsView.axaml
│   │       ├── AppointmentsView.axaml.cs
│   │       ├── MainWindow.axaml
│   │       ├── MainWindow.axaml.cs
│   │       ├── TestView.axaml
│   │       └── TestView.axaml.cs
│   └── BarberManager.sln
├── readme.md
└── txt.txt
