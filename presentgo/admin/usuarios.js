const lista = document.getElementById("listaUsuarios");
let usuarios = [];

async function cargarUsuarios() {
    try {
        usuarios = await apiFetch('/admin/usuarios');
        lista.innerHTML = "";
        if (usuarios.length === 0) {
            lista.innerHTML = '<p style="text-align:center;color:#999">No hay usuarios registrados.</p>';
            return;
        }
        usuarios.forEach((u) => {
            lista.innerHTML += `
                <div class="usuario">
                    <input type="checkbox" class="checkUsuario" data-id="${u.id}">
                    <label>${u.nombre} ${u.apellido} <small style="color:#aaa">(${u.username}) — ${u.rol}</small></label>
                </div>
            `;
        });
    } catch (err) {
        lista.innerHTML = '<p style="color:red">Error al cargar usuarios. ¿Tienes permisos de admin?</p>';
    }
}

cargarUsuarios();

document.getElementById("btnBorrar").addEventListener("click", async () => {
    const checks = document.querySelectorAll(".checkUsuario:checked");

    if (checks.length === 0) {
        alert("Selecciona al menos un usuario.");
        return;
    }

    if (!confirm(`¿Eliminar ${checks.length} usuario(s)?`)) return;

    const ids = [...checks].map(c => c.dataset.id);
    let errores = 0;

    for (const id of ids) {
        try {
            await apiFetch(`/admin/usuarios/${id}`, { method: 'DELETE' });
        } catch {
            errores++;
        }
    }

    if (errores) alert(`No se pudieron eliminar ${errores} usuario(s).`);
    else alert('Usuarios eliminados correctamente.');

    cargarUsuarios();
});

document.getElementById("btnBack").addEventListener("click", () => {
    window.location.href = "admin.html";
});
