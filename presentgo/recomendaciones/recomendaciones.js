// Botón volver
document.getElementById("btnBack").addEventListener("click", () => {
    window.history.back();
});

// BOTÓN INICIO
document.getElementById("btnInicio").addEventListener("click", () => {
    window.location.href = "../home/home.html";
});

// Cargar recomendaciones desde localStorage (puestas por test.js)
const lista = document.getElementById("listaRecomendaciones");

async function cargarRecomendaciones() {
    const guardadas = localStorage.getItem("recomendaciones");

    let recomendaciones = [];

    if (guardadas) {
        recomendaciones = JSON.parse(guardadas);
    } else {
        // Si no hay respuestas del test, mostrar productos populares
        try {
            recomendaciones = await apiFetch('/productos', { auth: false });
            recomendaciones = recomendaciones.slice(0, 6);
        } catch (err) {
            lista.innerHTML = '<p style="text-align:center;color:#999">No se pudieron cargar los productos.</p>';
            return;
        }
    }

    lista.innerHTML = "";
    recomendaciones.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("reco");
        div.innerHTML = `
            <span>${item.nombre}</span>
            <span class="precio">${parseFloat(item.precio).toFixed(2)}€</span>
        `;
        lista.appendChild(div);
    });

    // Limpiar para próxima vez
    localStorage.removeItem("recomendaciones");
}

cargarRecomendaciones();
