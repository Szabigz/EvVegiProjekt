document.addEventListener("DOMContentLoaded", () => {
    const bookingBtn = document.querySelector(".booking-btn")
    const loginModalEl = document.getElementById('loginModal')
    const loginModal = new bootstrap.Modal(loginModalEl)
    const loginForm = document.getElementById("loginForm")
    const modalTitle = loginModalEl.querySelector(".modal-title")
    const modalSubmitBtn = document.getElementById("modalSubmitBtn")
    const switchLink = document.getElementById("switchToRegister")
    const switchText=document.getElementById("switch")
    
    bookingBtn.addEventListener("click", (e) => {
        e.preventDefault()
        loginModal.show()
    });

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
    });

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault()

        if (modalTitle.textContent == "Bejelentkezés") {
            userLogin()
        } 
        else {
            userRegister()

        }
    })
})