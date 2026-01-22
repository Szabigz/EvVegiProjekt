document.addEventListener("DOMContentLoaded", function() {
    const priceTabBtns = document.querySelectorAll(".price-tab-btn");
    const priceTabContents = document.querySelectorAll(".price-tab-content");

    priceTabBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            const tabName = this.getAttribute("data-tab");

            // Aktív gomb eltávolítása
            priceTabBtns.forEach(b => b.classList.remove("active"));
            // Aktív tartalom eltávolítása
            priceTabContents.forEach(content => content.classList.remove("active"));

            // Új aktív beállítása
            this.classList.add("active");
            document.getElementById(tabName).classList.add("active");
        });
    });

    // Alapértelmezés: első tab aktív
    if (priceTabBtns.length > 0) {
        priceTabBtns[0].classList.add("active");
    }
    if (priceTabContents.length > 0) {
        priceTabContents[0].classList.add("active");
    }
});
