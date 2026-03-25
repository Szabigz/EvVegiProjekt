document.addEventListener("DOMContentLoaded", function() {
    const priceTabBtns = document.querySelectorAll(".price-tab-btn")
    const priceTabContents = document.querySelectorAll(".price-tab-content")

    priceTabBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            const tabName = this.getAttribute("data-tab")

            //Aktiv gomb eltavolitasa
            priceTabBtns.forEach(b => b.classList.remove("active"))
            //Aktiv tartalom eltavolitasa
            priceTabContents.forEach(content => content.classList.remove("active"))

            //Uj aktiv beallitasa
            this.classList.add("active")
            document.getElementById(tabName).classList.add("active")
        })
    })

    //Alapertelmezes: elso tab aktív
    if (priceTabBtns.length > 0) {
        priceTabBtns[0].classList.add("active")
    }
    if (priceTabContents.length > 0) {
        priceTabContents[0].classList.add("active")
    }
})

document.addEventListener("DOMContentLoaded", () => {
    const teamContainer = document.getElementById("team-list-container")
    if (teamContainer) {
        loadTeamMembers()
    }
})

async function loadTeamMembers() {
    const container = document.getElementById("team-list-container")
    if (!container) return

    try {
        const res = await fetch('http://localhost:3000/barbersPublic')
        const barbers = await res.json()
        
        container.innerHTML = "" 

        barbers.forEach(barber => {
            const imgSrc = barber.profile_image || "/images/barber.png"
            const desc = barber.description || "Tapasztalt barber, várja vendégeit."
            
            container.innerHTML += `
                <div class="col-lg-5 col-md-6 col-sm-12 mb-4 d-flex justify-content-center">
                    <div class="team-card">
                        <img src="${imgSrc}" class="team-img" alt="${barber.name}">
                        <h5 class="team-name" style="color: #d4af37 font-size: 1.5rem">${barber.name}</h5>
                        <p class="mt-3" style="font-weight: bold color: white">Bemutatkozás:</p>
                        <p style="white-space: pre-wrap color: #eee font-style: italic line-height: 1.6">${desc}</p>
                    </div>
                </div>
            `
        })
    } catch (err) {
        console.error("Hiba a csapat betöltésekor:", err)
    }
}