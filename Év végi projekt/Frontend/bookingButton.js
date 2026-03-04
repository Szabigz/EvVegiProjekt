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
        const phoneField = document.getElementById("phoneField");
    
        if (modalTitle.textContent == "Bejelentkezés") {
            modalTitle.textContent = "Regisztráció";
            modalSubmitBtn.textContent = "Regisztrálás";
            switchLink.textContent = "Bejelentkezés";
            switchText.textContent = "";
            phoneField.classList.remove("d-none"); // Phone mező látható
            document.getElementById("nameInput").setAttribute("required", true);
            document.getElementById("phoneNumInput").setAttribute("required", true);
        } else {
            modalTitle.textContent = "Bejelentkezés";
            modalSubmitBtn.textContent = "Bejelentkezés";
            switchLink.textContent = "Regisztrálj!"; 
            switchText.textContent = "Még nincs fiókod? ";
            phoneField.classList.add("d-none"); // Phone mező rejtve
            document.getElementById("nameInput").removeAttribute("required");
            document.getElementById("phoneNumInput").removeAttribute("required");

        }
    });

    // Form submit
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        if (modalTitle.textContent == "Bejelentkezés") {
            const name=document.getElementById("nameInput").value
            const email = document.getElementById("emailInput").value;
            const password = document.getElementById("passwordInput").value;
            if(name && email && password){
                sessionStorage.setItem("loggedIn", "true");
                window.location.href = "booking.html";
            } else {
                alert("Kérlek tölts ki minden mezőt!");
            }
        } else {
            const name = document.getElementById("nameInput").value;
            const email = document.getElementById("emailInput").value;
            const phone = document.getElementById("phoneNumInput").value;
            const password = document.getElementById("passwordInput").value;

            if(name && email && phone && password){
                alert("Sikeres regisztráció!");
                loginModal.hide();
            } else {
                alert("Kérlek töltsd ki az összes mezőt!");
            }
        }
    });
});