document.addEventListener("DOMContentLoaded", () => {
    const bookingBtn = document.querySelector(".booking-btn")
    const loginModalEl = document.getElementById('loginModal')
    const loginModal = new bootstrap.Modal(loginModalEl)
    const loginForm = document.getElementById("loginForm")
    const modalTitle = loginModalEl.querySelector(".modal-title")
    const modalSubmitBtn = document.getElementById("modalSubmitBtn")
    const switchLink = document.getElementById("switchToRegister")
    const switchText=document.getElementById("switch")
    const profileBtn = document.querySelector(".profile-btn");
    
    /*Profil gomb*/
    profileBtn.addEventListener("click",(e)=>{
        e.preventDefault()
        const token = sessionStorage.getItem('token')
        if (token) {
            //Ha mar be van jelentkezve, egybol menjen a profilra
            window.location.href = "/HTML/profile.html"
        } else {
            //Ha nincs, nyiljon meg a modal
            sessionStorage.setItem('postLoginRedirect', "/HTML/profile.html")
            loginModal.show()
        }
    })

    /*Foglalas gomb*/
    bookingBtn.addEventListener("click", (e) => {
        e.preventDefault()
        const token = sessionStorage.getItem('token');
        if (token) {
            window.location.href = "/HTML/booking.html";
        } else {
            sessionStorage.setItem('postLoginRedirect', "/HTML/booking.html")
            loginModal.show()
        }
    })

    /*Bejelentkezes - Regisztracio*/
    switchLink.addEventListener("click", (e) => {
        e.preventDefault()
        const phoneField = document.getElementById("phoneField")
    
        if (modalTitle.textContent == "Bejelentkezés") {
            modalTitle.textContent = "Regisztráció"
            modalSubmitBtn.textContent = "Regisztrálás"
            switchLink.textContent = "Bejelentkezés"
            switchText.textContent = ""
            phoneField.classList.remove("d-none"); 
            document.getElementById("nameInput").setAttribute("required", true)
            document.getElementById("phoneNumInput").setAttribute("required", true)
        } else {
            modalTitle.textContent = "Bejelentkezés"
            modalSubmitBtn.textContent = "Bejelentkezés"
            switchLink.textContent = "Regisztrálj!"
            switchText.textContent = "Még nincs fiókod? "
            phoneField.classList.add("d-none") 
            document.getElementById("nameInput").removeAttribute("required")
            document.getElementById("phoneNumInput").removeAttribute("required")

        }
    })

    /*Veglegesites*/
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault()

        if (modalTitle.textContent == "Bejelentkezés") {
            const redirect = sessionStorage.getItem('postLoginRedirect') || "/HTML/booking.html";
            userLogin(redirect)
        } 
        else {
            userRegister()
        }
    })
})