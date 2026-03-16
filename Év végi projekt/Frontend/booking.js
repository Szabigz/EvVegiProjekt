//Vedelem
const token = sessionStorage.getItem("token")

if(!token){
    window.location.href = "login.html"
}

let selectedBarber = null
let selectedService = null
let selectedDate = null
let selectedTime = null


function scrollToStep(stepNumber) {
    const steps = document.querySelectorAll(".booking-step")
    if (steps[stepNumber]) {
        steps[stepNumber].scrollIntoView({ behavior: "smooth", block: "center" })
    }
}

//Fodraszok
document.querySelectorAll(".barber-card").forEach(card => {
    card.addEventListener("click", () => {
        document.querySelectorAll(".barber-card").forEach(c => c.classList.remove("selected"))
        card.classList.add("selected")
        selectedBarber = card.getAttribute("data-barber")
        scrollToStep(1)
    })
})

//Szolgaltatasok
document.querySelectorAll(".service-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".service-btn").forEach(b => b.classList.remove("selected"))
        btn.classList.add("selected")
        selectedService = btn.getAttribute("data-service")
        scrollToStep(2)
    })
})

//Naptar
const calendarBody = document.getElementById("calendarBody")
const monthYear = document.getElementById("monthYear")
let current = new Date()

function renderCalendar() {
    const year = current.getFullYear()
    const month = current.getMonth()

    monthYear.innerText = current.toLocaleString("hu-HU", { month: "long", year: "numeric" })

    calendarBody.innerHTML = ""

    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    let dayIndex = (firstDay + 6) % 7

    let row = document.createElement("tr")

    for (let i = 0; i < dayIndex; i++) row.appendChild(document.createElement("td"))

    for (let day = 1; day <= daysInMonth; day++) {
        if (dayIndex == 7) {
            calendarBody.appendChild(row)
            row = document.createElement("tr")
            dayIndex = 0
        }

        let cell = document.createElement("td")
        cell.innerText = day
        const dateObj = new Date(year, month, day)

        if (dateObj.getDay() == 0) {
            cell.classList.add("disabled-day")
        } else {
            cell.addEventListener("click", () => {
                selectedDate = dateObj
                highlightSelectedDay(cell)
            })
        }

        row.appendChild(cell)
        dayIndex++
    }

    calendarBody.appendChild(row)
}

function highlightSelectedDay(selectedCell) {
    document.querySelectorAll("#calendarBody td").forEach(td => td.classList.remove("selected-day"))
    selectedCell.classList.add("selected-day")
    scrollToStep(3)
    generateTimeSlots()
}

document.getElementById("prevMonth").onclick = () => { current.setMonth(current.getMonth() - 1); renderCalendar(); }
document.getElementById("nextMonth").onclick = () => { current.setMonth(current.getMonth() + 1); renderCalendar(); }

renderCalendar()

//Idopontok
const timeSlotsContainer = document.querySelector('.time-slot-wrapper')

async function generateTimeSlots() {
    timeSlotsContainer.innerHTML = ""
    if(!selectedBarber || !selectedDate) return

    const bookedTimes = await getBookedTimes(selectedBarber, selectedDate)

    const times = ["09:00","09:30","10:00","10:30","11:00","11:30","12:00",
                   "13:00","13:30","14:00","14:30","15:00","15:30",
                   "16:00","16:30","17:00","17:30","18:00","19:00"]

    times.forEach((time, index) => {
        const btn = document.createElement("button")
        btn.classList.add("time-slot-btn")
        btn.textContent = time

        if(bookedTimes.includes(time)){
            btn.disabled = true
            btn.classList.add("booked")
        } else {
            btn.addEventListener("click", () => {
                timeSlotsContainer.querySelectorAll("button").forEach(b => b.classList.remove("active"))
                btn.classList.add("active")
                selectedTime = time
                scrollToStep(3)
            })
        }

        timeSlotsContainer.appendChild(btn)
        setTimeout(() => btn.classList.add("show"), index * 50)
    })
}

async function getBookedTimes(barberID, date) {
    const formattedDate = date.toISOString().split("T")[0]
    const res = await fetch(`/appointmentsByBarber/${barberID}/${formattedDate}`)
    if(!res.ok) return []

    const data = await res.json()
    return data
        .filter(app => app.status === "booked") // csak a lefoglaltak
        .map(app => {
            const d = parseAppointmentDate(app.start_time)
            return d.toLocaleTimeString("hu-HU",{hour:"2-digit",minute:"2-digit"})
        })
}


//Foglalas veglegesitese

document.getElementById("finalBookingBtn").addEventListener("click", finalizeBooking)

async function finalizeBooking() {
    if (!selectedBarber) return alert("Kérlek válassz egy fodrászt!")
    if (!selectedService) return alert("Kérlek válassz egy szolgáltatást!")
    if (!selectedDate) return alert("Kérlek válassz egy napot!")
    if (!selectedTime) return alert("Kérlek válassz időpontot!")

    const [hour, minute] = selectedTime.split(":").map(Number)

    const start_time = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), hour, minute, 0).toISOString()
    const end_time = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), hour + 1, minute, 0).toISOString()

    const userID = 0
    const comment = ""

    const success = await bookAppointment(selectedBarber, selectedService, userID, start_time, end_time, comment)

    if (success) {
        const dateText = new Date(start_time).toLocaleDateString("hu-HU")
        alert(`Foglalás sikeres!\n
            Fodrász: ${selectedBarber}\n
            Szolgáltatás: ${selectedService}\n
            Dátum: ${dateText}\n
            Időpont: ${selectedTime}`)
        loadMyAppointment()
    } else {
        alert("Hiba történt a foglalás során!")
    }
}
async function bookAppointment(barberID, serviceID, start_time, end_time, comment) {

    const token = sessionStorage.getItem("token")

    const res = await fetch('/appoointmentUserPost', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ 
            barberID,
            serviceID,
            start_time,
            end_time,
            comment 
        })
    })

    return res.ok
}
function parseAppointmentDate(datetimeStr) {
    const [datePart, timePart] = datetimeStr.split(' ')
    const [year, month, day] = datePart.split('-').map(Number)
    const [hour, minute, second] = timePart.split(':').map(Number)
    return new Date(year, month - 1, day, hour, minute, second)
}
async function loadMyAppointment() {
    const token = sessionStorage.getItem("token")
    if(!token) return

    const res = await fetch("/appointmentMyUser", {
        headers: { "Authorization": "Bearer " + token }
    })
    if(!res.ok) return

    const data = await res.json()
    if(data.length === 0) return

    const appointment = data[0]
    const date = parseAppointmentDate(appointment.start_time)

    document.getElementById("selectedBarber").innerText = appointment.barber.name
    document.getElementById("selectedService").innerText = appointment.service.name
    document.getElementById("selectedDate").innerText = date.toLocaleDateString("hu-HU")
    document.getElementById("selectedTime").innerText = date.toLocaleTimeString("hu-HU", {hour:"2-digit", minute:"2-digit"})
}

loadMyAppointment()