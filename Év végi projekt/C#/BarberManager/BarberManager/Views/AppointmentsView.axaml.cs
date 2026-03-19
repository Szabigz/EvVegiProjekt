using System.Linq;
using Avalonia;
using Avalonia.Controls;
using Avalonia.Markup.Xaml;
using Avalonia.Media;
using BarberManager.ViewModels;


namespace BarberManager;

public partial class AppointmentsView : UserControl
{
    public AppointmentsView()
    {
        InitializeComponent();
        this.DataContextChanged += (s, e) => {
            if (DataContext is AppointmentsViewModel vm)
            {
                vm.PropertyChanged += (sender, args) => {
                    if (args.PropertyName == "Appointments" || args.PropertyName == "CurrentMonday")
                        DrawUI();
                };
                DrawUI();
            }
        };
    }
    //brutal
    private void DrawUI()
    {
        var vm = DataContext as AppointmentsViewModel;
        if (vm == null || CalendarContentGrid == null) return;

        // regi kartyak torlese
        var toRemove = CalendarContentGrid.Children.Where(c => c is Border b && b.Child is Grid).ToList();
        foreach (var child in toRemove) CalendarContentGrid.Children.Remove(child);

        // gyonyoru szinek
        string[] brightColors = { "#3498db", "#9b59b6", "#f1c40f", "#e67e22", "#1abc9c", "#fd79a8" };

        // foreach foglalas
        foreach (var app in vm.Appointments)
        {
            // ha nem ezen a heten van akkor nem akarok tudni rola
            if (app.StartTime.Date < vm.CurrentMonday || app.StartTime.Date > vm.CurrentMonday.AddDays(5)) continue;

            // hetfo 1. oszlop sombat 6.
            int col = ((int)app.StartTime.DayOfWeek + 6) % 7 + 1;

            // 8am a 0. sor, 30percenkent 1 sor
            int startRow = (app.StartTime.Hour - 8) * 2 + (app.StartTime.Minute >= 30 ? 1 : 0);
            int endRow = (app.EndTime.Hour - 8) * 2 + (app.EndTime.Minute >= 30 ? 1 : 0);
            int rowSpan = endRow - startRow;

            // ha nincs benne akkor hagyom
            if (startRow < 0 || startRow > 26) continue;

            // lemondott = szurke, tobbi szines
            string color = brightColors[app.Id % brightColors.Length];
            if (app.Status == "canceled") color = "#7f8c8d";
            if (app.Status == "available") color = "#dcdde1";
            if (app.Status == "completed") color = "#A8E6CF";

            // uj grid 
            var innerGrid = new Grid();
            innerGrid.RowDefinitions.Add(new RowDefinition(GridLength.Auto)); // nev
            innerGrid.RowDefinitions.Add(new RowDefinition(GridLength.Star)); // service
            innerGrid.RowDefinitions.Add(new RowDefinition(GridLength.Auto)); // status

            var topGrid = new Grid { ColumnDefinitions = new ColumnDefinitions("*,Auto, Auto") };

            // vendeg neve, ha lemondta akkor athuzott nev
            var nameText = new TextBlock
            {
                Text = app.GuestName,
                FontWeight = FontWeight.ExtraBold,
                FontSize = 13,
                Foreground = Brushes.White,
                TextWrapping = TextWrapping.Wrap
            };
            if (app.Status == "canceled") nameText.TextDecorations = TextDecorations.Strikethrough;
            Grid.SetColumn(nameText, 0);
            topGrid.Children.Add(nameText);

            // completed gomb (csak ha nem completed akkor van ott)
            if (app.Status == "booked")
            {
                var completedBtn = new Button
                {
                    Background = Brushes.Transparent,
                    Padding = new Thickness(0),
                    Margin = new Thickness(0, 0, 0, 0),
                    Cursor = new Avalonia.Input.Cursor(Avalonia.Input.StandardCursorType.Hand),
                    Content = new Avalonia.Controls.Shapes.Path
                    {
                        Fill = Brushes.White,
                        Stretch = Stretch.Uniform,
                        Width = 18,
                        Height = 18,
                        Data = Geometry.Parse("M17.5821 6.95711C17.9726 6.56658 17.9726 5.93342 17.5821 5.54289C17.1916 5.15237 16.5584 5.15237 16.1679 5.54289L5.54545 16.1653L1.70711 12.327C1.31658 11.9365 0.683417 11.9365 0.292893 12.327C-0.0976311 12.7175 -0.097631 13.3507 0.292893 13.7412L4.83835 18.2866C5.22887 18.6772 5.86204 18.6772 6.25256 18.2866L17.5821 6.95711Z M23.5821 6.95711C23.9726 6.56658 23.9726 5.93342 23.5821 5.54289C23.1915 5.15237 22.5584 5.15237 22.1678 5.54289L10.8383 16.8724C10.4478 17.263 10.4478 17.8961 10.8383 18.2866C11.2288 18.6772 11.862 18.6772 12.2525 18.2866L23.5821 6.95711Z")
                    },
                    Command = vm.MarkAsDoneCommand,
                    CommandParameter = app
                };
                ToolTip.SetTip(completedBtn, "Megjelölés készként");
                Grid.SetColumn(completedBtn, 1);
                topGrid.Children.Add(completedBtn);
            }



            // 3 potty gomb
            var detailsBtn = new Button
            {
                Background = Brushes.Transparent,
                Padding = new Thickness(4),
                Margin = new Thickness(0, -4, -4, 0),
                Cursor = new Avalonia.Input.Cursor(Avalonia.Input.StandardCursorType.Hand),
                Content = new Avalonia.Controls.Shapes.Path
                {
                    Fill = Brushes.White,
                    Stretch = Stretch.Uniform,
                    Width = 14,
                    Height = 14,
                    Data = Geometry.Parse("M14 5C14 6.10457 13.1046 7 12 7C10.8954 7 10 6.10457 10 5C10 3.89543 10.8954 3 12 3C13.1046 3 14 3.89543 14 5Z M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z M12 21C13.1046 21 14 20.1046 14 19C14 17.8954 13.1046 17 12 17C10.8954 17 10 17.8954 10 19C10 20.1046 10.8954 21 12 21Z")
                },
                Command = vm.ViewDetailsCommand,
                CommandParameter = app
            };
            ToolTip.SetTip(detailsBtn, "Részletek");
            Grid.SetColumn(detailsBtn, 2);
            topGrid.Children.Add(detailsBtn);

            Grid.SetRow(topGrid, 0);
            innerGrid.Children.Add(topGrid);

            // szolgaltatas neve, comment
            var middleStack = new StackPanel { VerticalAlignment = Avalonia.Layout.VerticalAlignment.Center };
            middleStack.Children.Add(new TextBlock { Text = app.ServiceName, FontSize = 10, Foreground = Brushes.White, Opacity = 0.9 });

            if (app.HasComment)
            {
                middleStack.Children.Add(new TextBlock
                {
                    Text = $"\"{app.Comment}\"",
                    FontSize = 10,
                    FontStyle = FontStyle.Italic,
                    Foreground = Brushes.White,
                    Opacity = 0.8,
                    Margin = new Thickness(0, 2, 0, 0),
                    TextTrimming = TextTrimming.CharacterEllipsis // ha tul hosszu
                });
            }
            Grid.SetRow(middleStack, 1);
            innerGrid.Children.Add(middleStack);

            // statusz genyo
            var statusPill = new Border
            {
                HorizontalAlignment = Avalonia.Layout.HorizontalAlignment.Left,
                Padding = new Thickness(4, 1),
                Background = Brush.Parse("#44000000"),
                CornerRadius = new CornerRadius(4),
                Child = new TextBlock { Text = app.Status.ToUpper(), FontSize = 8, FontWeight = FontWeight.Bold, Foreground = Brushes.White }
            };
            Grid.SetRow(statusPill, 2);
            innerGrid.Children.Add(statusPill);

            // kartya bordere
            var card = new Border
            {
                Background = Brush.Parse(color),
                CornerRadius = new CornerRadius(8),
                Margin = new Thickness(3),
                Padding = new Thickness(8),
                BoxShadow = BoxShadows.Parse("0 2 8 0 #33000000"),
                Child = innerGrid
            };

            // appendChild type shit
            Grid.SetColumn(card, col);
            Grid.SetRow(card, startRow);
            Grid.SetRowSpan(card, rowSpan > 0 ? rowSpan : 1);
            CalendarContentGrid.Children.Add(card);
        }
    }
}
