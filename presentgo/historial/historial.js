// Botón inicio (abajo)
document.getElementById("btnInicio").addEventListener("click", () => {
    window.location.href = "../home/home.html";
});

// Botón atrás (flecha)
document.getElementById("btnBack").addEventListener("click", () => {
    window.history.back();
});

// Botón home (icono arriba derecha)
document.getElementById("btnHome").addEventListener("click", () => {
    window.location.href = "../home/home.html";
});

// Cargar historial real desde la API
const lista = document.getElementById("listaHistorial");

async function cargarHistorial() {
    try {
        const historial = await apiFetch('/historial');
        lista.innerHTML = "";

        if (historial.length === 0) {
            lista.innerHTML = '<p style="text-align:center;color:#999;padding:20px">Todavía no tienes historial. ¡Haz el test!</p>';
            return;
        }

        historial.forEach(p => {
            const fecha = new Date(p.fecha).toLocaleDateString('es-ES');
            lista.innerHTML += `
                <div class="producto">
                    <div>
                        <span>${p.nombre}</span>
                        <small style="display:block;color:#aaa;font-size:11px">${fecha} · ${p.categoria}</small>
                    </div>
                    <span>${parseFloat(p.precio).toFixed(2)}€</span>
                </div>
            `;
        });
    } catch (err) {
        lista.innerHTML = '<p style="text-align:center;color:#999;padding:20px">Inicia sesión para ver tu historial.</p>';
    }
}

cargarHistorial();
