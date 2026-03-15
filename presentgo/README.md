# 🎁 Present&Go — Guía de instalación y uso

## ¿Qué hay de nuevo?

Se ha añadido un **backend completo** en Node.js que conecta el frontend con una base de datos real. Todo lo que antes era datos de prueba o `localStorage` ahora funciona de verdad:

| Funcionalidad | Antes | Ahora |
|---|---|---|
| Login / Registro | Falso (localStorage) | BD real con contraseñas cifradas |
| Test → Recomendaciones | Hardcodeado | Motor de recomendación por puntuación |
| Categorías / Filtros | Hardcodeado | Productos reales desde BD |
| Historial | Hardcodeado | Guardado por usuario autenticado |
| Admin – Usuarios | Lista falsa | CRUD real |

---

## Requisitos

- **Node.js** v18 o superior → https://nodejs.org
- Nada más. La base de datos (SQLite) se crea sola al arrancar.

---

## Instalación (primera vez)

```bash
# 1. Entra en la carpeta del proyecto
cd "Present&Go"

# 2. Instala las dependencias
npm install
```

---

## Arrancar el servidor

```bash
node server.js
```

Verás en la consola:
```
🎁 Present&Go backend corriendo en http://localhost:3000
   Admin por defecto → usuario: admin | contraseña: admin123
```

Ahora abre el navegador en: **http://localhost:3000**

---

## Credenciales por defecto

| Tipo | Usuario | Contraseña |
|---|---|---|
| Admin | `admin` | `admin123` |

> ⚠️ Cambia la contraseña del admin en producción.

---

## Estructura del proyecto

```
Present&Go/
├── server.js           ← Backend (Node.js + Express + SQLite)
├── api.js              ← Helper compartido para fetch (usado por el frontend)
├── package.json        ← Dependencias
├── presentgo.db        ← Base de datos (se crea automáticamente)
│
├── login/              ← Login de usuario
├── registro/           ← Registro de usuario
├── home/               ← Pantalla principal
├── test/               ← Test de personalidad (10 preguntas)
├── recomendaciones/    ← Resultados del test
├── categorias/         ← Explorar por categoría
├── categoria-resultados/ ← Productos de una categoría
├── filtros/            ← Filtrar por precio
├── historial/          ← Historial de recomendaciones
├── perfil/             ← Perfil del usuario
├── admin-login/        ← Login de administrador
├── admin/              ← Panel de administración
└── registro-admin/     ← Crear nuevo administrador
```

---

## API — Endpoints disponibles

### Autenticación
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/registro` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |

### Productos
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/productos` | Listar productos (con filtros opcionales: `?categoria=moda&precio_max=50`) |
| GET | `/api/categorias` | Listar categorías disponibles |

### Test y Recomendaciones
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/test/recomendar` | Enviar respuestas y recibir top 6 recomendaciones |

### Usuario (requiere login)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/historial` | Historial del usuario |
| GET | `/api/perfil` | Datos del perfil |

### Admin (requiere login de admin)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/admin/usuarios` | Listar todos los usuarios |
| DELETE | `/api/admin/usuarios/:id` | Eliminar usuario |
| POST | `/api/admin/registro` | Crear nuevo admin |
| GET | `/api/admin/stats` | Estadísticas generales |

---

## Tecnologías usadas

- **Express** — servidor web
- **better-sqlite3** — base de datos SQLite (sin configuración)
- **bcryptjs** — cifrado de contraseñas
- **jsonwebtoken** — autenticación por token (JWT)
- **cors** — permite peticiones desde el frontend

---

## Desarrollo con auto-recarga

```bash
npm run dev
```
*(requiere que nodemon esté disponible: `npm install -g nodemon`)*
