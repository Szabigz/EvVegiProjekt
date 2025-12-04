function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1).getDay(); 
    const lastDate = new Date(year, month + 1, 0).getDate();

    const today = new Date();
    monthYear.textContent = date.toLocaleString('hu-HU', { month: 'long', year: 'numeric' });

    calendarBody.innerHTML = '';
    let row = document.createElement('tr');


    let startDay = firstDay === 0 ? 7 : firstDay; 


    for (let i = 1; i < startDay; i++) {
        let cell = document.createElement('td');
        row.appendChild(cell);
    }

    for (let day = 1; day <= lastDate; day++) {
        const weekday = new Date(year, month, day).getDay(); 
        if (weekday === 0) continue; 

        if (row.children.length === 6) { 
            calendarBody.appendChild(row);
            row = document.createElement('tr');
        }

        let cell = document.createElement('td');
        cell.textContent = day;

        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            cell.classList.add('today');
        }

        row.appendChild(cell);
    }

    // utolsó sor kitöltése, ha kell
    while (row.children.length < 6) {
        let cell = document.createElement('td');
        row.appendChild(cell);
    }

    calendarBody.appendChild(row);
}
