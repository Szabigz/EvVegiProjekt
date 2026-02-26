document.addEventListener("DOMContentLoaded", () => {
    const bookingBtn = document.querySelector(".booking-btn");
    const loginModalEl = document.getElementById('loginModal');
    const loginModal = new bootstrap.Modal(loginModalEl);
    const loginForm = document.getElementById("loginForm");
    const modalTitle = loginModalEl.querySelector(".modal-title");
    const modalSubmitBtn = document.getElementById("modalSubmitBtn");
    const switchLink = document.getElementById("switchToRegister");
    const switchText=document.getElementById("switch")

    bookingBtn.addEventListener("click", (e) => {
        e.preventDefault();
        loginModal.show();
    });

    switchLink.addEventListener("click", (e) => {
        e.preventDefault();
        const nameField = document.getElementById("nameField");
    
        if (modalTitle.textContent == "Bejelentkezés") {
            modalTitle.textContent = "Regisztráció";
            modalSubmitBtn.textContent = "Regisztrálás";
            switchLink.textContent = "Bejelentkezés";
            switchText.textContent = "";
            nameField.classList.remove("d-none"); // Név mező látható
            document.getElementById("nameInput").setAttribute("required", true);
        } else {
            modalTitle.textContent = "Bejelentkezés";
            modalSubmitBtn.textContent = "Bejelentkezés";
            switchLink.textContent = "Regisztrálj!"; 
            switchText.textContent = "Még nincs fiókod? ";
            nameField.classList.add("d-none"); // Név mező rejtve
            document.getElementById("nameInput").removeAttribute("required");
        }
    });

    // Form submit
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        if (modalTitle.textContent == "Bejelentkezés") {
            const email = document.getElementById("emailInput").value;
            const password = document.getElementById("passwordInput").value;

            if(email && password){
                sessionStorage.setItem("loggedIn", "true");
                window.location.href = "booking.html";
            } else {
                alert("Kérlek töltsd ki mindkét mezőt!");
            }
        } else {
            const name = document.getElementById("nameInput").value;
            const email = document.getElementById("emailInput").value;
            const password = document.getElementById("passwordInput").value;

            if(name && email && password){
                alert("Sikeres regisztráció!");
                loginModal.hide();
            } else {
                alert("Kérlek töltsd ki az összes mezőt!");
            }
        }
    });
});