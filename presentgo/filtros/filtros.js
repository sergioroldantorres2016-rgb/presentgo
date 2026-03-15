// Botón aplicar → ir a resultados por filtro
document.getElementById("btnAplicar").addEventListener("click", async () => {
    const seleccion = document.querySelector("input[name='precio']:checked");

    if (!seleccion) {
        alert("Selecciona un rango de precio.");
        return;
    }

    const rangos = {
        'menos25':  { min: 0,   max: 25  },
        'de25a50':  { min: 25,  max: 50  },
        'de50a100': { min: 50,  max: 100 },
        'mas100':   { min: 100, max: 9999 }
    };

    const rango = rangos[seleccion.value];
    if (rango) {
        localStorage.setItem("filtroPrecioMin", rango.min);
        localStorage.setItem("filtroPrecioMax", rango.max);
    }

    localStorage.setItem("filtroPrecio", seleccion.value);

    // Ir a resultados de categoría con filtro de precio
    window.location.href = "../categoria-resultados/categoria.html";
});

// Botón atrás
document.getElementById("btnBack").addEventListener("click", () => {
    window.history.back();
});
