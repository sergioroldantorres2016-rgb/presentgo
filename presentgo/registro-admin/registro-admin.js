document.getElementById("btnCrearAdmin").addEventListener("click", async () => {
    const nombre = document.getElementById("nombreAdmin").value.trim();
    const apellido = document.getElementById("apellidoAdmin").value.trim();
    const username = document.getElementById("usernameAdmin") ? document.getElementById("usernameAdmin").value.trim() : (nombre + apellido).toLowerCase().replace(/\s/g, '');
    const clave1 = document.getElementById("claveAdmin").value.trim();
    const clave2 = document.getElementById("claveAdmin2").value.trim();

    if (!nombre || !apellido || !clave1 || !clave2) {
        alert("Rellena todos los campos.");
        return;
    }

    if (clave1 !== clave2) {
        alert("Las claves no coinciden.");
        return;
    }

    try {
        await apiFetch('/admin/registro', {
            method: 'POST',
            body: JSON.stringify({ nombre, apellido, username, password: clave1 })
        });
        alert("Admin creado correctamente.");
        window.location.href = "../admin/admin.html";
    } catch (err) {
        alert(err.message || "Error al crear el admin.");
    }
});
