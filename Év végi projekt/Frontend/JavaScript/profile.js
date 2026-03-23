let currentUserId = null
document.addEventListener("DOMContentLoaded", async () => {
    /*Megnezzuk be van e jelentkezve*/
    const token = sessionStorage.getItem('token')

    if (!token) {
        window.location.href = "/HTML/mainpage.html"
        return;
    }

    try {
        /*Felhasznalo adatainak betoltese*/
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
            currentUserId=user.id

            if (user) {
                document.getElementById('display-name').textContent = user.name
                document.getElementById('display-email').textContent = user.email
                document.getElementById('display-phone').textContent = user.phoneNum
            }
        } else {

            sessionStorage.removeItem('token')
            window.location.href = "/HTML/mainpage.html"
        }
    } catch (error) {
        console.error("Hiba:", error)
    }
    /*Kijelentkes gomb*/
    document.getElementById('logoutBtn').addEventListener('click', () => {
        sessionStorage.removeItem('token')
        window.location.href = "/HTML/mainpage.html"
    })
})

/*Idopontok betoltese*/
loadMyAppointment()
async function loadMyAppointment() {
    const token = sessionStorage.getItem("token")
    const container = document.getElementById("appointmentDiv")

    if (!token || !container) return;

    try {
        const res = await fetch("http://localhost:3000/appointmentMyUser", {
            headers: { "Authorization": "Bearer " + token }
        })

        if (!res.ok) throw new Error("Hiba a lekérésnél")

        const data = await res.json()
        /*Ha nincs foglalas*/
        if (!data || data.length == 0) {
            container.innerHTML = `<div class="col-12"><p class="text-white mt-3" style="text-align: center";>Jelenleg nincs aktív foglalásod.</p></div>`
            return;
        }

        container.innerHTML = "";
        /*Ha van*/
        data.forEach(appointment => {
            const date = new Date(appointment.start_time);
            /*Foglalas divek letrehozasa*/
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

/*Felhasznalo adatainak modositasa (jelszo, felhasznalonev*/
function editField(type) {
    const container = document.getElementById(`${type}-container`)
    const originalValue = type == 'phone' ? document.getElementById('display-phone').innerText : ""

    if (type == 'phone') {
        container.innerHTML = `
            <input type="text" id="input-phone" class="form-control form-control-sm w-50" value="${originalValue}">
            <button class="btn btn-sm btn-dark text-light"" onclick="saveUpdate('phone')">Mentés</button>
            <button class="btn btn-sm btn-outline-light" onclick="location.reload()">Mégse</button>
        `;
    } else {
        container.innerHTML = `
            <input type="password" id="input-password" class="form-control form-control-sm w-50" placeholder="Új jelszó">
            <button class="btn btn-sm btn-dark text-light" onclick="saveUpdate('password')">Mentés</button>
            <button class="btn btn-sm btn-outline-light" onclick="location.reload()">Mégse</button>
        `;
    }
}

/*Modositasok elmentese*/ 
async function saveUpdate(type) {
    const token = sessionStorage.getItem('token')
    let bodyData = {}

    if (type == 'phone') {
        bodyData.phoneNum = document.getElementById('input-phone').value
    } else {
        bodyData.password = document.getElementById('input-password').value
        if (!bodyData.password) return alert("Adj meg egy új jelszót!")
    }

    try {
        const response = await fetch(`http://localhost:3000/userUpdate/${currentUserId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bodyData)
        })

        const resData = await response.json()

        if (response.ok) {
            alert("Sikeres módosítás!")
            location.reload()
        } else {
            alert("Hiba: " + resData.message)
        }
    } catch (error) {
        console.error("Hiba a küldéskor:", error)
    }
}

/*Idopont lemondasa*/
async function cancelAppointment(id) {
    const confirmCancel = confirm("Biztosan le szeretnéd mondani ezt az időpontot?")
    
    if (!confirmCancel) return;

    const token = sessionStorage.getItem("token")

    try {
        const res = await fetch(`http://localhost:3000/appointmentDelete/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (res.ok) {
            alert("Időpont sikeresen lemondva.");
            loadMyAppointment()
        } else {
            const errorText = await res.text()
            alert("Hiba: " + errorText)
        }
    } catch (err) {
        console.error("Hiba a lemondás során:", err)
        alert("Hálózati hiba történt a lemondáskor.")
    }
}