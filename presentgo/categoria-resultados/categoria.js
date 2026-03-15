// Recuperar categoría elegida
const categoria = localStorage.getItem("categoriaElegida");

// Mostrar título
document.getElementById("tituloCategoria").textContent =
    categoria ? categoria.charAt(0).toUpperCase() + categoria.slice(1) : "Categoría";

// Mostrar productos desde la API
const lista = document.getElementById("listaProductos");

async function cargarProductos() {
    try {
        const precioMin = localStorage.getItem("filtroPrecioMin") || '';
        const precioMax = localStorage.getItem("filtroPrecioMax") || '';
        let url = `/productos`;
        const params = [];
        if (categoria) params.push(`categoria=${categoria}`);
        if (precioMin) params.push(`precio_min=${precioMin}`);
        if (precioMax && precioMax !== '9999') params.push(`precio_max=${precioMax}`);
        if (params.length) url += '?' + params.join('&');
        // Limpiar filtros
        localStorage.removeItem("filtroPrecioMin");
        localStorage.removeItem("filtroPrecioMax");

        const productos = await apiFetch(url, { auth: false });

        if (!productos || productos.length === 0) {
            lista.innerHTML = "<p>No hay productos disponibles.</p>";
            return;
        }

        lista.innerHTML = "";
        productos.forEach(p => {
            lista.innerHTML += `
                <div class="producto">
                    <span>${p.nombre}</span>
                    <span>${parseFloat(p.precio).toFixed(2)}€</span>
                </div>
            `;
        });
    } catch (err) {
        lista.innerHTML = "<p>Error al cargar productos.</p>";
    }
}

if (categoria) {
    cargarProductos();
} else {
    lista.innerHTML = "<p>No hay categoría seleccionada.</p>";
}

// Botón inicio
document.getElementById("btnInicio").addEventListener("click", () => {
    window.location.href = "../home/home.html";
});

// Botón atrás
document.getElementById("btnBack").addEventListener("click", () => {
    window.history.back();
});
