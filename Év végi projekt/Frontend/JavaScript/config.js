const CONFIG = {
    BASE_URL: "http://localhost:3000"
};
function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container')
    if (!container) {
        container = document.createElement('div')
        //Pozicionalas: jobb alul
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3'
        container.style.zIndex = '9999'
        document.body.appendChild(container)
    }

    //Bal oldali sav szine
    const statusColor = type == 'success' ? '#28a745' : '#dc3545'

    const toastEl = document.createElement('div')

    toastEl.className = `toast border-0`
    toastEl.style.background = 'transparent'
    toastEl.style.boxShadow = 'none';
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive')
    toastEl.setAttribute('aria-atomic', 'true')

    toastEl.innerHTML = `
        <div class="d-flex align-items-stretch" style="background-color: white; color: black; border-radius: 6px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
            <!-- Bal oldali vertikális színes sáv -->
            <div style="width: 6px; background-color: ${statusColor}; flex-shrink: 0;"></div>
            
            <!-- Tartalom és bezáró gomb -->
            <div class="d-flex w-100 align-items-center py-2 px-3">
                <div class="toast-body fw-bold flex-grow-1" style="font-size: 0.95rem; color: #212529; padding: 10px;">
                    ${message}
                </div>
                <button type="button" class="btn-close ms-2" data-bs-dismiss="toast" aria-label="Bezárás"></button>
            </div>
        </div>
    `;

    container.appendChild(toastEl)

    const bsToast = new bootstrap.Toast(toastEl, { delay: 3000 })
    bsToast.show()

    toastEl.addEventListener('hidden.bs.toast', () => {
        toastEl.remove()
    })
}