// ===============================
// CARGAR NOMBRE DEL USUARIO
// ===============================
const nombreGuardado = localStorage.getItem("nombreUsuario");
if (nombreGuardado) {
    document.getElementById("nombreUsuario").textContent = nombreGuardado;
}

// ===============================
// DETECTAR ROL DEL USUARIO
// ===============================
const rol = localStorage.getItem("rol");

// Elementos del DOM
const adminIcon = document.getElementById("adminIcon");
const adminOption = document.getElementById("adminOption");

// ===============================
// SI ES ADMIN → MOSTRAR OPCIONES
// ===============================
if (rol === "admin") {

    // Mostrar icono admin
    adminIcon.style.display = "block";

    // Mostrar opción "Administrar"
    adminOption.style.display = "block";

    // Al pulsar el icono admin → ir al panel admin
    adminIcon.addEventListener("click", () => {
        window.location.href = "../admin/admin.html";
    });

    // Al pulsar la opción "Administrar" → ir al panel admin
    adminOption.addEventListener("click", () => {
        window.location.href = "../admin/admin.html";
    });

} else {

    // Ocultar icono y opción admin si NO es admin
    adminIcon.style.display = "none";
    adminOption.style.display = "none";
}

// ===============================
// BOTÓN INICIO
// ===============================
document.getElementById("btnInicio").addEventListener("click", () => {
    window.location.href = "../home/home.html";
});

// ===============================
// BOTÓN CERRAR SESIÓN
// ===============================
document.getElementById("btnCerrar").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../login/login.html";
});
