document.getElementById("btnAdminLogin").addEventListener("click", async () => {

    const username = document.getElementById("adminUser").value.trim();
    const password = document.getElementById("adminPass").value.trim();

    if (!username || !password) {
        alert("Debes completar usuario y contraseña.");
        return;
    }

    try {
        const data = await apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            auth: false
        });

        if (data.rol !== 'admin') {
            alert("Esta cuenta no tiene permisos de administrador.");
            return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("rol", data.rol);
        localStorage.setItem("nombreUsuario", data.nombre);

        window.location.href = "../home/home.html";
    } catch (err) {
        alert(err.message || "Credenciales incorrectas.");
    }

});
