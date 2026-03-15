document.getElementById("btnCrearCuenta").addEventListener("click", async () => {
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const username = document.getElementById("usuario") ? document.getElementById("usuario").value.trim() : nombre.toLowerCase();
    const pass1 = document.getElementById("password").value.trim();
    const pass2 = document.getElementById("password2").value.trim();

    if (!nombre || !apellido || !pass1 || !pass2) {
        alert("Rellena todos los campos.");
        return;
    }

    if (pass1 !== pass2) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    // Si no hay campo usuario, usar nombre+apellido como username
    const usernameReal = username || (nombre + apellido).toLowerCase().replace(/\s/g, '');

    try {
        const data = await apiFetch('/auth/registro', {
            method: 'POST',
            body: JSON.stringify({ nombre, apellido, username: usernameReal, password: pass1 }),
            auth: false
        });

        localStorage.setItem("token", data.token);
        localStorage.setItem("rol", data.rol);
        localStorage.setItem("nombreUsuario", data.nombre);

        window.location.href = "../home/home.html";
    } catch (err) {
        alert(err.message || "Error al registrarse.");
    }
});
