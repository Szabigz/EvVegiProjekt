document.addEventListener("DOMContentLoaded", function () {
    const box = document.querySelector(".appointment-box")

    box.addEventListener("click", function () {
        this.classList.toggle("open")
    })
})

window.addEventListener('load', () => {
    const calendarDiv = document.getElementById('calendar-div')

    if (calendarDiv) {

        const bookingBottom = calendarDiv.getBoundingClientRect().bottom + window.scrollY
        
        document.body.style.minHeight = bookingBottom + 'px'
    }
})
