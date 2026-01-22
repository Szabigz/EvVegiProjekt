document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("info").addEventListener("click", function() {
        document.getElementById("info-div").scrollIntoView({ behavior: "smooth" });
    });

    document.getElementById("team").addEventListener("click", function() {
        document.getElementById("team-div").scrollIntoView({ behavior: "smooth" });
    });

    document.getElementById("works").addEventListener("click", function() {
        document.getElementById("works-div").scrollIntoView({ behavior: "smooth" });
    });

    document.getElementById("prices").addEventListener("click", function() {
        document.getElementById("prices-div").scrollIntoView({ behavior: "smooth" });
    });

    document.getElementById("book-appointments").addEventListener("click", function() {
        document.getElementById("book-appointment-div").scrollIntoView({ behavior: "smooth" });
    });

    document.getElementById("location").addEventListener("click", function() {
        document.getElementById("location-div").scrollIntoView({ behavior: "smooth" });
    });
});