let currentUserId = null
document.addEventListener("DOMContentLoaded", async () => {
    /*Megnezzuk be van e jelentkezve*/
    const token = sessionStorage.getItem('token')

    if (!token) {
        window.location.href = "/"
        return;
    }

    try {
        /*Felhasznalo adatainak betoltese*/
        const response = await fetch(`${CONFIG.BASE_URL}/userGet`, {
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
            window.location.href = "/"
        }
    } catch (error) {
        console.error("Hiba:", error)
    }
    /*Kijelentkes gomb*/
    document.getElementById('logoutBtn').addEventListener('click', () => {
        sessionStorage.removeItem('token')
        showToast("Kijelentkezve", "success")
        setTimeout(() => {
            window.location.href = "/"
        }, 1500)
    })
})

/*Idopontok betoltese*/
loadMyAppointment()
async function loadMyAppointment() {
    const token = sessionStorage.getItem("token")
    const container = document.getElementById("appointmentDiv")

    if (!token || !container) return;

    try {
        const res = await fetch(`${CONFIG.BASE_URL}/appointmentMyUser`, {
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
            const date = new Date(appointment.end_time);
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
            <input type="text" id="input-phone" class="form-control form-control-sm w-50" maxlength="15" value="${originalValue}">
            <button class="btn btn-sm btn-dark text-light"" onclick="saveUpdate('phone')">Mentés</button>
            <button class="btn btn-sm btn-outline-light" onclick="location.reload()">Mégse</button>
        `;
    } else {
        container.innerHTML = `
            <input type="password" id="input-password" class="form-control form-control-sm w-50" placeholder="Új jelszó" minlenght="6">
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
        if (!bodyData.password || bodyData.password.length < 6) {
            return showToast("A jelszó legalább 6 karakter legyen!", "error")
        }
    }

    try {
        const response = await fetch(`${CONFIG.BASE_URL}/userUpdate/${currentUserId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bodyData)
        })

        const resData = await response.json()

        if (response.ok) {
            showToast("Sikeres módosítás!", "success")
            setTimeout(() => {
                location.reload()
            }, 2000)
        } else {
            showToast(resData.message, "error")
        }
    } catch (error) {
        console.error("Hiba a küldéskor:", error)
        showToast("Szerver hiba történt!", "error")
    }
}

/*Idopont lemondasa*/
async function cancelAppointment(id) {
    const confirmCancel = confirm("Biztosan le szeretnéd mondani ezt az időpontot?")
    
    if (!confirmCancel) return;

    const token = sessionStorage.getItem("token")

    try {
        const res = await fetch(`${CONFIG.BASE_URL}/appointmentDelete/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (res.ok) {
            showToast("Időpont sikeresen lemondva.","success");
            loadMyAppointment()
        } else {
            const errorText = await res.text()
            showToast("Hiba: " + errorText,"error")
        }
    } catch (err) {
        console.error("Hiba a lemondás során:", err)
        showToast("Hálózati hiba történt a lemondáskor.","error")
    }
}

/*Fiok torlese*/
document.getElementById('deleteUserBtn').addEventListener('click', async () => {
    const confirmDelete = confirm("Biztosan törölni szeretnéd a fiókodat? Ez a művelet nem vonható vissza!")
    if (!confirmDelete) return
    deleteUser();
})