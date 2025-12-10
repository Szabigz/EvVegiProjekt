function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1).getDay(); // 0=vasárnap
    const lastDate = new Date(year, month + 1, 0).getDate();

    const today = new Date();

    monthYear.textContent = date.toLocaleString('hu-HU', { month: 'long', year: 'numeric' });

    calendarBody.innerHTML = '';

    let row = document.createElement('tr');

    // Üres cellák az első sor elejére, ha a hónap nem vasárnappal kezdődik
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('td');
        row.appendChild(emptyCell);
    }

    for (let day = 1; day <= lastDate; day++) {
        const cell = document.createElement('td');
        cell.textContent = day;

        const weekday = new Date(year, month, day).getDay();

        // Vasárnap: disabled
        if (weekday === 0) {
            cell.classList.add('disabled-day');
        } else {
            // kattintható nap
            cell.addEventListener('click', () => {
                selectedDate = new Date(year, month, day);
                highlightSelectedDay(cell);
                generateTimeSlots();
            });
        }

        // Mai nap kiemelése
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            cell.classList.add('today');
        }

        row.appendChild(cell);

        // Sor lezárása 7 cella után
        if (row.children.length === 7) {
            calendarBody.appendChild(row);
            row = document.createElement('tr');
        }
    }

    // Utolsó sor kitöltése üres cellákkal, ha szükséges
    while (row.children.length > 0 && row.children.length < 7) {
        const emptyCell = document.createElement('td');
        row.appendChild(emptyCell);
    }

    if (row.children.length > 0) {
        calendarBody.appendChild(row);
    }
}
