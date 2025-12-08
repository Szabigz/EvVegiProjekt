document.addEventListener("DOMContentLoaded", function () {
    const box = document.querySelector(".contact-box");

    box.addEventListener("click", function () {
        this.classList.toggle("open");
    });
});