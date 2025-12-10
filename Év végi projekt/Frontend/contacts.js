document.addEventListener("DOMContentLoaded", function () {
    const box = document.querySelector(".contact-box");

    box.addEventListener("click", function () {
        this.classList.toggle("open");
    });
});

window.addEventListener('load', () => {
    const bookingDiv = document.getElementById('book-appointment-div');

    if (bookingDiv) {
        // Foglalás szakasz alja a dokumentumban
        const bookingBottom = bookingDiv.getBoundingClientRect().bottom + window.scrollY;
        
        // A body magasságát a foglalás végéig állítjuk
        document.body.style.minHeight = bookingBottom + 'px';
    }
});
function initMap() {
    // Cím koordinátái (Budapest, Fő utca 12)
    const budapest = { lat: 47.497913, lng: 19.040236 };

    // Térkép létrehozása a divben
    const map = new google.maps.Map(document.getElementById("location-div"), {
        zoom: 12,           // kb. 10 km körzet
        center: budapest
    });

    // Jelölő hozzáadása a címhez
    const marker = new google.maps.Marker({
        position: budapest,
        map: map,
        title: "Budapest, Fő utca 12"
    });
}
