const hamburgerBtn = document.getElementById('hamburgerBtn')
const mobileMenu = document.getElementById('mobileMenu')

if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('open')
        hamburgerBtn.classList.toggle('active')
    })
}

function closeMobileMenu() {
    if (hamburgerBtn && mobileMenu) {
        mobileMenu.classList.remove('open')
        hamburgerBtn.classList.remove('active')
    }
}