// Botón aplicar → siguiente pantalla
document.getElementById("btnAplicar").addEventListener("click", () => {
    const seleccion = document.querySelector("input[name='categoria']:checked");

    if (!seleccion) {
        alert("Selecciona una categoría.");
        return;
    }

    // Guardar categoría elegida
    localStorage.setItem("categoriaElegida", seleccion.value);

    // Ir a la pantalla de resultados por categoría
    window.location.href = "../categoria-resultados/categoria.html";
});

// Botón atrás
document.getElementById("btnBack").addEventListener("click", () => {
    window.history.back();
});
