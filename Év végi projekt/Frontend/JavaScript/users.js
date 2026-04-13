/*Bejelentkezes*/ 
async function userLogin(redirectUrl="/HTML/booking.html") {
    const email = document.getElementById("emailInput").value
    const password = document.getElementById("passwordInput").value

    try {
        const response = await fetch(`${CONFIG.BASE_URL}/userLogin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })

        const data = await response.json()

        if (response.ok) { 
            showToast(data.message || "Sikeres bejelentkezés!", "success")
            sessionStorage.setItem('token', data.token)
            setTimeout(() => {
                window.location.href = redirectUrl
            }, 2000)
        } else {
            showToast("Hiba: " + data.message,"error")
        }
    } catch (error) {
        console.error("Hálózati hiba:", error)
        showToast("A szerver nem érhető el!", "error")
    }
}

/*Regisztracio*/
async function userRegister() {
    const name = document.getElementById("nameInput").value
    const email = document.getElementById("emailInput").value
    const password = document.getElementById("passwordInput").value
    const phoneNum = document.getElementById("phoneNumInput").value.trim()

    //Telefonszam validacio
    const startsWithPlus = phoneNum.startsWith('+')
    const startsWith06 = phoneNum.startsWith('06')
    const testValue = startsWithPlus ? phoneNum.slice(1) : phoneNum;
    const onlyNumbers = /^\d+$/.test(testValue);
    
    
    if (!startsWithPlus && !startsWith06) {
        return showToast("A telefonszámnak + vagy 06 jellel kell kezdődnie!", "error")
    }
    if (!onlyNumbers) {
        return showToast("A telefonszám csak számokat tartalmazhat!", "error")
    }
    if (phoneNum.length < 10) {
        return showToast("A megadott telefonszám túl rövid!", "error");
    }
    
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
            showToast(data.message || "Sikeres regisztráció! <br> Rendszerünk most bejelentkeztet...", "success")
            const redirect = sessionStorage.getItem('postLoginRedirect') || "/HTML/booking.html"
            setTimeout(async () => {
                await userLogin(redirect)
            }, 2000)
            
        } else {
            showToast("Regisztrációs hiba: " + data.message, "error")
        }
    } catch (error) {
        console.error("Hálózati hiba:", error)
        showToast("Nem sikerült csatlakozni a szerverhez.", "error")
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
            showToast("Fiókod sikeresen törölve.", "success")
            
            sessionStorage.removeItem('token')
            sessionStorage.removeItem('user')
            setTimeout(() => {
                window.location.href = "/"
            }, 2000)
        } else {
            const resData = await response.json()
            showToast("Hiba a törlés során: " + resData.message, "error")
        }
    } catch (error) {
        console.error("Hiba a törléskor:", error)
        showToast("Szerverhiba történt a törlés során.", "error")
    }
}