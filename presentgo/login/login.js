document.getElementById("btnLogin").addEventListener("click", async (e) => {
    e.preventDefault();

    const username = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value.trim();

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

        localStorage.setItem("token", data.token);
        localStorage.setItem("rol", data.rol);
        localStorage.setItem("nombreUsuario", data.nombre);

        window.location.href = "../home/home.html";
    } catch (err) {
        alert(err.message || "Error al iniciar sesión.");
    }
});
