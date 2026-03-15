// Preguntas del test
const preguntas = [
    {
        pregunta: "¿Qué tipo de persona es?",
        opciones: ["Creativa", "Deportista", "Tecnológica", "Romántica"]
    },
    {
        pregunta: "¿Cuál es su actividad favorita?",
        opciones: ["Arte y manualidades", "Deportes al aire libre", "Videojuegos", "Lectura"]
    },
    {
        pregunta: "¿Qué prefiere hacer en vacaciones?",
        opciones: ["Visitar museos", "Aventuras extremas", "Quedarse en casa", "Viajes románticos"]
    },
    {
        pregunta: "¿Qué relación tienes con esa persona?",
        opciones: ["Amigo/a", "Pareja", "Familiar", "Compañero/a"]
    },
    {
        pregunta: "¿Qué ocasión es?",
        opciones: ["Cumpleaños", "Aniversario", "Navidad", "Otro"]
    },
    {
        pregunta: "¿Qué estilo prefiere?",
        opciones: ["Elegante", "Casual", "Minimalista", "Colorido"]
    },
    {
        pregunta: "¿Qué tipo de películas prefiere?",
        opciones: ["Artísticas", "Acción", "Comedia", "Terror"]
    },
    {
        pregunta: "¿Qué personalidad tiene?",
        opciones: ["Extrovertida", "Introvertida", "Aventurera", "Tranquila"]
    },
    {
        pregunta: "¿Cómo pasa su tiempo libre?",
        opciones: ["Pintando o dibujando", "Haciendo ejercicio", "Con tecnología", "Con amigos/pareja"]
    },
    {
        pregunta: "¿Qué valora más en un regalo?",
        opciones: ["Originalidad", "Utilidad práctica", "Innovación", "Sentimiento"]
    }
];

let indice = 0;
const respuestas = [];

// Elementos
const preguntaHTML = document.getElementById("pregunta");
const opcionesHTML = document.getElementById("opciones");
const contadorHTML = document.getElementById("contador");
const btnSiguiente = document.getElementById("btnSiguiente");

// Cargar pregunta
function cargarPregunta() {
    const actual = preguntas[indice];

    preguntaHTML.textContent = actual.pregunta;
    contadorHTML.textContent = `${indice + 1}/10`;

    opcionesHTML.innerHTML = "";

    actual.opciones.forEach(op => {
        const div = document.createElement("div");
        div.classList.add("opcion");
        div.textContent = op;

        // Pre-seleccionar si ya respondió esta pregunta
        if (respuestas[indice] === op) div.classList.add("selected");

        div.addEventListener("click", () => {
            document.querySelectorAll(".opcion").forEach(o => o.classList.remove("selected"));
            div.classList.add("selected");
        });

        opcionesHTML.appendChild(div);
    });
}

cargarPregunta();

// Botón siguiente
btnSiguiente.addEventListener("click", async () => {
    const seleccionada = document.querySelector(".opcion.selected");

    if (!seleccionada) {
        alert("Selecciona una opción antes de continuar.");
        return;
    }

    respuestas[indice] = seleccionada.textContent;
    indice++;

    if (indice >= preguntas.length) {
        // Enviar respuestas al backend
        try {
            const recomendaciones = await apiFetch('/test/recomendar', {
                method: 'POST',
                body: JSON.stringify({ respuestas })
            });
            // Guardar recomendaciones para la siguiente pantalla
            localStorage.setItem("recomendaciones", JSON.stringify(recomendaciones));
        } catch (err) {
            console.error('Error al obtener recomendaciones:', err);
        }
        window.location.href = "../recomendaciones/recomendaciones.html";
        return;
    }

    cargarPregunta();
});

// Botón atrás
document.getElementById("btnBack").addEventListener("click", () => {
    if (indice > 0) {
        indice--;
        cargarPregunta();
    }
});
