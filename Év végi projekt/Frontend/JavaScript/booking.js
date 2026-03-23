//Vedelem
const token = sessionStorage.getItem("token")

if(!token){
    window.location.href = "/HTML/mainpage.html"
}

//Alaphelyzet
let selectedBarber = null
let selectedService = null
let selectedDate = null
let selectedTime = null

//Lepegetes
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
        loadServices()

    })
})

//Szolgaltatasok
async function loadServices() {
    const container = document.getElementById("serviceContainer")
    container.innerHTML = ""

    const res = await fetch(`/services?barberID=${selectedBarber}`)
    if (!res.ok) return

    const services = await res.json()

    services.forEach(service => {
        const btn = document.createElement("button")
        btn.classList.add("service-btn")

        btn.setAttribute("data-service", service.id)
        btn.innerHTML = `${service.name}<br>${service.price} Ft`

        btn.addEventListener("click", () => {
            document.querySelectorAll(".service-btn").forEach(b => b.classList.remove("selected"))
            btn.classList.add("selected")
            
            selectedService = service.id
            scrollToStep(2)
        })

        container.appendChild(btn)
    })
}
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
    
    const today = new Date()
    const todayYear = today.getFullYear()
    const todayMonth = today.getMonth()
    const todayDate = today.getDate()

    monthYear.innerText = current.toLocaleString("hu-HU", { month: "long", year: "numeric" })
    calendarBody.innerHTML = ""

    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    let dayIndex = (firstDay + 6) % 7

    let row = document.createElement("tr")
    for (let i = 0; i < dayIndex; i++) row.appendChild(document.createElement("td"))

    for (let day = 1; day <= daysInMonth; day++) {
        if (dayIndex == 7) {
            calendarBody.appendChild(row);
            row = document.createElement("tr");
            dayIndex = 0
        }

        const cell = document.createElement("td")
        cell.innerText = day
        const dateObj = new Date(year, month, day)

        const isSunday = dateObj.getDay() == 0
        
        let isPast = false
        if (year < todayYear) {
            isPast = true
        } else if (year == todayYear) {
            if (month < todayMonth) {
                isPast = true
            } else if (month == todayMonth) {
                if (day < todayDate) isPast = true
            }
        }

        if (isSunday || isPast) {
            cell.classList.add("disabled-day")

        } else {
            
            cell.style.cursor = "pointer"
            cell.addEventListener("click", () => {
                selectedDate = dateObj
                highlightSelectedDay(cell)
            });
        }

        row.appendChild(cell)
        dayIndex++
    }
    calendarBody.appendChild(row)

    const isCurrentMonth = (year == todayYear && month == todayMonth)
    document.getElementById("prevMonth").disabled = isCurrentMonth
}
function highlightSelectedDay(cell) {
    document.querySelectorAll("#calendarBody td").forEach(td => td.classList.remove("selected-day"))
    cell.classList.add("selected-day")
    scrollToStep(3)
    generateTimeSlots()

}

//Elozo/kovi honap
document.getElementById("prevMonth").onclick = () => { current.setMonth(current.getMonth() - 1); renderCalendar() }
document.getElementById("nextMonth").onclick = () => { current.setMonth(current.getMonth() + 1); renderCalendar() }

renderCalendar()

//Idopontok
const timeSlotsContainer = document.querySelector('.time-slot-wrapper')

async function generateTimeSlots() {
    const message=document.getElementById("noSlotsMessage")

    timeSlotsContainer.innerHTML = ""
    message.classList.add('d-none')

    if (!selectedBarber || !selectedDate) return
    
    const year = selectedDate.getFullYear()
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
    const day = String(selectedDate.getDate()).padStart(2, '0')
    const formattedDate = `${year}-${month}-${day}`

    try{
        const res = await fetch(`http://localhost:3000/availableSlots/${selectedBarber}/${formattedDate}`)
        
        if (!res.ok)
            return
        
        const slots = await res.json()

        if (slots.length == 0) {
            message.classList.remove('d-none')
            return;
        }
        slots.forEach((slot, index) => {
            const d = new Date(slot)
            const timeStr = d.toLocaleTimeString("hu-HU", { hour:"2-digit", minute:"2-digit" })

            const btn = document.createElement("button")
            btn.classList.add("time-slot-btn")
            btn.textContent = timeStr

            btn.addEventListener("click", () => {
                timeSlotsContainer.querySelectorAll("button").forEach(b => b.classList.remove("active"))
                btn.classList.add("active")
                selectedTime = timeStr
                scrollToStep(3)
            })

            timeSlotsContainer.appendChild(btn)
            setTimeout(() => btn.classList.add("show"), index * 50)
        })

    }
    catch(err){
        console.error("Hiba az időpontok betöltésekor: "+err)
    }
}

//Helyes datum formatum miatt segedfuggveny
function formatLocalDateTime(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const hour = String(date.getHours()).padStart(2, "0")
    const minute = String(date.getMinutes()).padStart(2, "0")
    const second = String(date.getSeconds()).padStart(2, "0")
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

//Foglalas veglegesitese

document.getElementById("finalBookingBtn").addEventListener("click", finalizeBooking)

async function finalizeBooking() {
    if (!selectedBarber) return alert("Kérlek válassz egy fodrászt!")
    if (!selectedService) return alert("Kérlek válassz egy szolgáltatást!")
    if (!selectedDate) return alert("Kérlek válassz egy napot!")
    if (!selectedTime) return alert("Kérlek válassz időpontot!")

    const comment = document.getElementById("commentInput").value || "Nincs megjegyzés";
    
    const timeParts = selectedTime.split(":")
    const hour = parseInt(timeParts[0])
    const minute = parseInt(timeParts[1])

    const start_time = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        hour,
        minute,
        0
    )

    const end_time = new Date(start_time.getTime() + 60 * 60 * 1000)

    const success = await bookAppointment(
        selectedBarber,
        selectedService,
        formatLocalDateTime(start_time),
        formatLocalDateTime(end_time),
        comment
    )

    if (success) {
        const dateText = start_time.toLocaleDateString("hu-HU")
        const timeText = start_time.toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" })
        
        const barberElem = document.querySelector(`.barber-card[data-barber="${selectedBarber}"] h5`)
        const barberName = barberElem ? barberElem.innerText : "Fodrász";

        const serviceElem = document.querySelector(`.service-btn[data-service="${selectedService}"]`)
        const serviceName = serviceElem ? serviceElem.innerText.split("\n")[0] : "Szolgáltatás"

        alert(`Foglalás sikeres!\n
            Fodrász: ${barberName}\n
            Szolgáltatás: ${serviceName}\n
            Dátum: ${dateText}\n
            Időpont: ${timeText}`)

        generateTimeSlots()
        window.location.href= "/HTML/profile.html"
    } else {
        alert("Hiba történt a foglalás során!")
    }
}

async function bookAppointment(barberID, serviceID, start_time, end_time, comment) {

    const token = sessionStorage.getItem("token")

    const res = await fetch('/appointmentUserPost', {
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

async function deleteAppointment(barberID, userID, start_time, end_time) {

    const token = sessionStorage.getItem("token")

    const res = await fetch('/appointmentDelete/:'+ userID, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ 
            barberID,
            start_time,
            end_time,
        })
    })

    return res.ok
}

