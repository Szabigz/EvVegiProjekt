let currentUserId = null
document.addEventListener("DOMContentLoaded", async () => {
    const token = sessionStorage.getItem('token')

    if (!token) {
        window.location.href = "/HTML/mainpage.html"
        return
    }

    try {
        const response = await fetch('http://localhost:3000/userGet', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        })

        if (response.ok) {
            const data = await response.json()
            const user = data[0];

            if (user) {
                document.getElementById('display-name').textContent = user.name
                document.getElementById('display-email').textContent = user.email
                document.getElementById('display-phone').textContent = user.phoneNum
            }
        } else {

            sessionStorage.removeItem('token')
            window.location.href = "/index.html"
        }
    } catch (error) {
        console.error("Hiba:", error)
    }

    document.getElementById('logoutBtn').addEventListener('click', () => {
        sessionStorage.removeItem('token')
        window.location.href = "/HTML/mainpage.html"
    })
})
loadMyAppointment()
async function loadMyAppointment() {
    const token = sessionStorage.getItem("token")
    const container = document.getElementById("appointmentDiv")

    if (!token || !container) return

    try {
        const res = await fetch("http://localhost:3000/appointmentMyUser", {
            headers: { "Authorization": "Bearer " + token }
        })

        if (!res.ok) throw new Error("Hiba a lekérésnél")

        const data = await res.json()
        
        if (!data || data.length == 0) {
            container.innerHTML = `<div class="col-12"><p class="text-white mt-3" style="text-align: center";>Jelenleg nincs aktív foglalásod.</p></div>`
            return;
        }

        container.innerHTML = "";

        data.forEach(appointment => {
            const date = new Date(appointment.start_time);
            
            const appointmentHtml = `
                <div class="col-lg-6 col-md-6 col-sm-12 mb-4">
                    <div class="appointment-card">
                        <h2 class="appointment-title">Foglalt Időpontod</h2>
                        <hr class="appointment-divider">
                        
                        <div class="row mt-3">
                            <div class="col-6 mb-2">
                                <small class="label-text">Barber:</small>
                                <strong class="value-text gold-text">${appointment.barber?.name || 'N/A'}</strong>
                            </div>
                            <div class="col-6 mb-2">
                                <small class="label-text">Szolgáltatás:</small>
                                <strong class="value-text">${appointment.service?.name || 'N/A'}</strong>
                            </div>
                            <div class="col-6">
                                <small class="label-text">Dátum:</small>
                                <span class="value-text">${date.toLocaleDateString("hu-HU")}</span>
                            </div>
                            <div class="col-6">
                                <small class="label-text">Időpont:</small>
                                <span class="value-text">${date.toLocaleTimeString("hu-HU", {hour:"2-digit", minute:"2-digit"})}</span>
                            </div>
                        </div>
                        <div class="cancel-container">
                            <button class="cancel-btn" onclick="cancelAppointment(${appointment.id})">Lemondás</button>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += appointmentHtml
        })
    } catch (err) {
        container.innerHTML = `<p class="text-danger">Hiba történt az adatok betöltésekor.</p>`
    }
}
