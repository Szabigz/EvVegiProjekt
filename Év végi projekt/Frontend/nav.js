document.addEventListener("DOMContentLoaded", function() {
    const scrollToElement = (elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const infoBtn = document.getElementById("info");
    if (infoBtn) infoBtn.addEventListener("click", () => scrollToElement("info-div"));

    const teamBtn = document.getElementById("team");
    if (teamBtn) teamBtn.addEventListener("click", () => scrollToElement("team-div"));

    const worksBtn = document.getElementById("works");
    if (worksBtn) worksBtn.addEventListener("click", () => scrollToElement("works-div"));

    const pricesBtn = document.getElementById("prices");
    if (pricesBtn) pricesBtn.addEventListener("click", () => scrollToElement("prices-div"));

    const bookBtn = document.getElementById("book-appointments");
    if (bookBtn) bookBtn.addEventListener("click", () => scrollToElement("book-appointment-div"));

    const locationBtn = document.getElementById("location");
    if (locationBtn) locationBtn.addEventListener("click", () => scrollToElement("location-div"));
});