document.addEventListener("DOMContentLoaded", function () {
    const box = document.querySelector(".contact-box")

    box.addEventListener("click", function () {
        this.classList.toggle("open")
    })
})

window.addEventListener('load', () => {
    const bookingDiv = document.getElementById('book-appointment-div')

    if (bookingDiv) {
        const bookingBottom = bookingDiv.getBoundingClientRect().bottom + window.scrollY
        document.body.style.minHeight = bookingBottom + 'px'
    }
})