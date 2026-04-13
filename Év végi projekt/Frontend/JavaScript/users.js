/*Bejelentkezes*/ 
async function userLogin(redirectUrl="/HTML/booking.html") {
    const name = document.getElementById("nameInput").value
    const email = document.getElementById("emailInput").value
    const password = document.getElementById("passwordInput").value

    try {
        const response = await fetch(`${CONFIG.BASE_URL}/userLogin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        })

        const data = await response.json()

        if (response.ok) { 
            alert(data.message || "Sikeres bejelentkezés!")
            sessionStorage.setItem('token', data.token)
            window.location.href = redirectUrl
        } else {
            alert("Hiba: " + data.message)
        }
    } catch (error) {
        console.error("Hálózati hiba:", error)
        alert("A szerver nem érhető el!")
    }
}

/*Regisztracio*/
async function userRegister() {
    const name = document.getElementById("nameInput").value
    const email = document.getElementById("emailInput").value
    const password = document.getElementById("passwordInput").value
    const phoneNum = document.getElementById("phoneNumInput").value

    try {
        const response = await fetch(`${CONFIG.BASE_URL}/userReg`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, phoneNum })
        })

        const data = await response.json()
        
        if (response.ok) {
            alert(data.message || "Sikeres regisztráció! Rendszerünk most bejelentkeztet...")
            const redirect = sessionStorage.getItem('postLoginRedirect') || "/HTML/booking.html"
            await userLogin(redirect)
            
        } else {
            alert("Regisztrációs hiba: " + data.message)
        }
    } catch (error) {
        console.error("Hálózati hiba:", error)
        alert("Nem sikerült csatlakozni a szerverhez.")
    }
}

/*Fiok torlese*/
async function deleteUser(){
    const token = sessionStorage.getItem('token')

    try {
        const response = await fetch(`${CONFIG.BASE_URL}/userDelete/${currentUserId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (response.ok) {
            alert("Fiókod sikeresen törölve.")
            
            sessionStorage.removeItem('token')
            sessionStorage.removeItem('user')
            window.location.href = "/"
        } else {
            const resData = await response.json()
            alert("Hiba a törlés során: " + resData.message)
        }
    } catch (error) {
        console.error("Hiba a törléskor:", error)
        alert("Szerverhiba történt a törlés során.")
    }
}