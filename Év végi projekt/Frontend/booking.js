// ===== GLOBAL STATE =====
let selectedBarber = null;
let selectedService = null;
let selectedDate = null;
let selectedTime = null;

// ===== SMOOTH SCROLL HELPER =====
function scrollToStep(stepNumber) {
    const steps = document.querySelectorAll(".booking-step");
    if (steps[stepNumber]) {
        steps[stepNumber].scrollIntoView({ behavior: "smooth", block: "center" });
    }
}

// ===== BARBER SELECTION =====
document.querySelectorAll(".barber-card").forEach(card => {
    card.addEventListener("click", () => {
        document.querySelectorAll(".barber-card").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        selectedBarber = card.getAttribute("data-barber");
        scrollToStep(1); // Scroll to service selection
    });
});

// ===== SERVICE SELECTION =====
document.querySelectorAll(".service-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".service-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedService = btn.getAttribute("data-service");
        scrollToStep(2); // Scroll to calendar
    });
});

// ===== CALENDAR =====
const calendarBody = document.getElementById("calendarBody");
const monthYear = document.getElementById("monthYear");
let current = new Date();

function renderCalendar() {
    const year = current.getFullYear();
    const month = current.getMonth();

    monthYear.innerText = current.toLocaleString("hu-HU", { month: "long", year: "numeric" });

    calendarBody.innerHTML = "";

    const firstDay = new Date(year, month, 1).getDay(); 
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let dayIndex = (firstDay + 6) % 7;

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
            cell.classList.add("disabled-day");
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
    document.querySelectorAll("#calendarBody td").forEach(td => td.classList.remove("selected-day"));
    selectedCell.classList.add("selected-day");
    scrollToStep(3); // Scroll to time slots
    generateTimeSlots();
}

document.getElementById("prevMonth").onclick = () => { current.setMonth(current.getMonth() - 1); renderCalendar(); };
document.getElementById("nextMonth").onclick = () => { current.setMonth(current.getMonth() + 1); renderCalendar(); };

renderCalendar();

// ===== TIME SLOTS =====
const timeSlotsContainer = document.querySelector('.time-slot-wrapper');

function generateTimeSlots() {
    timeSlotsContainer.innerHTML = "";

    const times = ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00"];

    times.forEach((time, index) => {
        const btn = document.createElement("button");
        btn.classList.add("time-slot-btn");
        btn.textContent = time;

        btn.addEventListener("click", () => {
            timeSlotsContainer.querySelectorAll("button").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            selectedTime = time;
            scrollToStep(3); // Stay on time slots or scroll to booking button
        });

        timeSlotsContainer.appendChild(btn);

        setTimeout(() => {
            btn.classList.add("show");
        }, index * 50);
    });
}

// ===== FINAL BOOKING =====
document.getElementById("finalBookingBtn").addEventListener("click", finalizeBooking);

function finalizeBooking() {
    if (!selectedBarber) return alert("Kérlek válassz egy fodrászt!");
    if (!selectedService) return alert("Kérlek válassz egy szolgáltatást!");
    if (!selectedDate) return alert("Kérlek válassz egy napot!");
    if (!selectedTime) return alert("Kérlek válassz időpontot!");

    const dateText = selectedDate.toLocaleDateString("hu-HU");
    alert(`Foglalás sikeres! \n\nFodrász: ${selectedBarber}\nSzolgáltatás: ${selectedService}\nDátum: ${dateText}\nIdőpont: ${selectedTime}`);
    
    // Foglalás adatok resetelése
    selectedBarber = null;
    selectedService = null;
    selectedDate = null;
    selectedTime = null;
}
