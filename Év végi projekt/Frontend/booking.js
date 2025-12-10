// ===== GLOBAL STATE =====
let selectedDate = null;
let selectedBarber = null;
let selectedTime = null;

// ===== CALENDAR =====
const calendarBody = document.getElementById("calendarBody");
const monthYear = document.getElementById("monthYear");
let current = new Date();

function renderCalendar() {
    const year = current.getFullYear();
    const month = current.getMonth();

    monthYear.innerText = current.toLocaleString("hu-HU", { month: "long", year: "numeric" });
    monthYear.style.color = "white";
    monthYear.style.backgroundColor = "rgba(0,0,0,0.6)";
    monthYear.style.borderRadius = "10px";

    calendarBody.innerHTML = "";

    const firstDay = new Date(year, month, 1).getDay(); 
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let dayIndex = (firstDay + 6) % 7; // hétfői kezdés

    let row = document.createElement("tr");

    for (let i = 0; i < dayIndex; i++) row.appendChild(document.createElement("td"));

    for (let day = 1; day <= daysInMonth; day++) {
        if (dayIndex === 7) {
            calendarBody.appendChild(row);
            row = document.createElement("tr");
            dayIndex = 0;
        }

        let cell = document.createElement("td");
        cell.innerText = day;
        const dateObj = new Date(year, month, day);

        if (dateObj.getDay() === 0) {
            cell.classList.add("disabled-day"); // vasárnap
        } else {
            cell.addEventListener("click", () => {
                selectedDate = dateObj;
                highlightSelectedDay(cell);
            });
        }

        row.appendChild(cell);
        dayIndex++;
    }

    calendarBody.appendChild(row);
}

function highlightSelectedDay(selectedCell) {
    // korábbi kijelölés törlése
    document.querySelectorAll("#calendarBody td").forEach(td => td.classList.remove("selected-day"));
    selectedCell.classList.add("selected-day");

    // időpontok betöltése
    generateTimeSlots();

    // wrapper megjelenítése animáltan
    const wrapper = document.querySelector('.time-slot-wrapper');
    wrapper.classList.add('show');

    // scroll simán a wrapperhez
    wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.getElementById("prevMonth").onclick = () => { current.setMonth(current.getMonth() - 1); renderCalendar(); };
document.getElementById("nextMonth").onclick = () => { current.setMonth(current.getMonth() + 1); renderCalendar(); };

renderCalendar();

// ===== BARBER SELECTION =====
document.querySelectorAll(".barber-list .card").forEach(card => {
    card.addEventListener("click", () => {
        document.querySelectorAll(".barber-list .card").forEach(c => c.classList.remove("selected-barber"));
        card.classList.add("selected-barber");
        selectedBarber = card.querySelector(".card-title").innerText;
    });
});

// ===== TIME SLOTS =====
const timeSlotsContainer = document.querySelector('.time-slot-wrapper');

function generateTimeSlots() {
    timeSlotsContainer.innerHTML = "";

    const times = ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00"];

    times.forEach((time, index) => {
        const btn = document.createElement("button");
        btn.classList.add("btn", "btn-outline-dark", "time-slot-btn");
        btn.textContent = time;

        btn.addEventListener("click", () => {
            timeSlotsContainer.querySelectorAll("button").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            selectedTime = time;
        });

        timeSlotsContainer.appendChild(btn);

        // animáció késleltetéssel
        setTimeout(() => {
            btn.classList.add("show");
        }, index * 50);
    });
}

// ===== FINAL BOOKING =====
document.getElementById("finalBookingBtn").addEventListener("click", finalizeBooking);

function finalizeBooking() {
    if (!selectedDate) return alert("Kérlek válassz egy napot!");
    if (!selectedBarber) return alert("Kérlek válassz egy barber-t!");
    if (!selectedTime) return alert("Kérlek válassz időpontot!");

    const dateText = selectedDate.toLocaleDateString("hu-HU");
    alert(`Foglalás sikeres! \nDátum: ${dateText}\nIdőpont: ${selectedTime}\nBarber: ${selectedBarber}`);
}
