async function userLogin(redirectUrl="/HTML/booking.html") {
    const name = document.getElementById("nameInput").value
    const email = document.getElementById("emailInput").value
    const password = document.getElementById("passwordInput").value

    try {
        const response = await fetch('http://localhost:3000/userLogin', {
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

async function userRegister() {
    const name = document.getElementById("nameInput").value
    const email = document.getElementById("emailInput").value
    const password = document.getElementById("passwordInput").value
    const phoneNum = document.getElementById("phoneNumInput").value

    try {
        const response = await fetch('http://localhost:3000/userReg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, phoneNum })
        })

        const data = await response.json()

        if (response.ok) {
            alert(data.message || "Sikeres regisztráció!")
            const modalTitle = document.querySelector("#loginModal .modal-title")
            const modalSubmitBtn = document.getElementById("modalSubmitBtn")
            const switchLink = document.getElementById("switchToRegister")
            const switchText = document.getElementById("switch")
            const phoneField = document.getElementById("phoneField")
            
            modalTitle.textContent = "Bejelentkezés"
            modalSubmitBtn.textContent = "Bejelentkezés"
            switchLink.textContent = "Regisztrálj!"
            switchText.textContent = "Még nincs fiókod? "
            phoneField.classList.add("d-none")
            document.getElementById("nameInput").removeAttribute("required")
            document.getElementById("phoneNumInput").removeAttribute("required")
        } else {
            alert("Regisztrációs hiba: " + data.message)
        }
    } catch (error) {
        console.error("Hálózati hiba:", error)
        alert("Nem sikerült csatlakozni a szerverhez.")
    }
}