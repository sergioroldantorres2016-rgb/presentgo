const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'presentgo_secret_2024';

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ─── Base de Datos JSON (sin compilación, puro Node.js) ───────────────────────
const DB_FILE = path.join(__dirname, 'database.json');

function loadDB() {
  if (!fs.existsSync(DB_FILE)) return { usuarios: [], productos: [], historial: [] };
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function nextId(arr) {
  return arr.length === 0 ? 1 : Math.max(...arr.map(x => x.id)) + 1;
}

// ─── Seed inicial ─────────────────────────────────────────────────────────────
function seedDB() {
  const db = loadDB();

  if (db.productos.length === 0) {
    db.productos = [
      { id:1,  nombre:'Auriculares Bluetooth Sony', precio:29.99, categoria:'tecnologia', etiquetas:['tecnologica','introvertida','innovacion'] },
      { id:2,  nombre:'Altavoz Portátil JBL',        precio:39.99, categoria:'tecnologia', etiquetas:['tecnologica','aventurera','util'] },
      { id:3,  nombre:'Smartwatch Fitbit',            precio:49.99, categoria:'tecnologia', etiquetas:['deportista','tecnologica','util'] },
      { id:4,  nombre:'Teclado Mecánico RGB',         precio:59.99, categoria:'tecnologia', etiquetas:['tecnologica','introvertida','innovacion'] },
      { id:5,  nombre:'Cámara Instantánea Fuji',      precio:79.99, categoria:'tecnologia', etiquetas:['creativa','romantica','sentimiento'] },
      { id:6,  nombre:'Sudadera Cold Culture',        precio:75.00, categoria:'moda',       etiquetas:['casual','extrovertida','colorido'] },
      { id:7,  nombre:'Sudadera Nude Project',        precio:85.00, categoria:'moda',       etiquetas:['minimalista','tranquila','elegante'] },
      { id:8,  nombre:'Gorra New Era',                precio:34.99, categoria:'moda',       etiquetas:['deportista','casual','extrovertida'] },
      { id:9,  nombre:'Bolso de cuero artesanal',     precio:89.99, categoria:'moda',       etiquetas:['creativa','elegante','sentimiento'] },
      { id:10, nombre:'Zapatillas Nike Air Max',      precio:120.00,categoria:'moda',       etiquetas:['deportista','aventurera','util'] },
      { id:11, nombre:'Lámpara LED Ambiente',         precio:14.99, categoria:'hogar',      etiquetas:['creativa','tranquila','minimalista'] },
      { id:12, nombre:'Difusor de Aromas',            precio:22.99, categoria:'hogar',      etiquetas:['romantica','tranquila','sentimiento'] },
      { id:13, nombre:'Manta Suave XL',               precio:19.99, categoria:'hogar',      etiquetas:['tranquila','introvertida','sentimiento'] },
      { id:14, nombre:'Set de Velas Aromáticas',      precio:24.99, categoria:'hogar',      etiquetas:['romantica','creativa','sentimiento'] },
      { id:15, nombre:'Cafetera Italiana',            precio:29.99, categoria:'hogar',      etiquetas:['tranquila','introvertida','util'] },
      { id:16, nombre:'Mochila de Viaje 40L',         precio:49.99, categoria:'viajes',     etiquetas:['aventurera','extrovertida','util'] },
      { id:17, nombre:'Neceser Premium',              precio:19.99, categoria:'viajes',     etiquetas:['elegante','util'] },
      { id:18, nombre:'Guía de Viaje Europa',         precio:15.99, categoria:'viajes',     etiquetas:['aventurera','creativa','lectura'] },
      { id:19, nombre:'Adaptador Universal',          precio:12.99, categoria:'viajes',     etiquetas:['tecnologica','util'] },
      { id:20, nombre:'Botella Térmica Stanley',      precio:34.99, categoria:'viajes',     etiquetas:['deportista','aventurera','util'] },
      { id:21, nombre:'Esterilla de Yoga',            precio:24.99, categoria:'deporte',    etiquetas:['deportista','tranquila','util'] },
      { id:22, nombre:'Guantes de Boxeo',             precio:34.99, categoria:'deporte',    etiquetas:['deportista','aventurera','accion'] },
      { id:23, nombre:'Pelota de Baloncesto',         precio:29.99, categoria:'deporte',    etiquetas:['deportista','extrovertida','util'] },
      { id:24, nombre:'Mancuernas Ajustables',        precio:59.99, categoria:'deporte',    etiquetas:['deportista','util','innovacion'] },
      { id:25, nombre:'Kit de Pintura Acrílica',      precio:34.99, categoria:'cultura',    etiquetas:['creativa','artistica','sentimiento'] },
      { id:26, nombre:'Libro Sapiens',                precio:18.99, categoria:'cultura',    etiquetas:['tranquila','introvertida','lectura'] },
      { id:27, nombre:'Puzzle 1000 piezas',           precio:19.99, categoria:'cultura',    etiquetas:['tranquila','introvertida','util'] },
      { id:28, nombre:'Cuaderno de Bocetos A4',       precio:14.99, categoria:'cultura',    etiquetas:['creativa','artistica','minimalista'] },
      { id:29, nombre:'Juego de Mesa Catan',          precio:39.99, categoria:'cultura',    etiquetas:['extrovertida','aventurera','colorido'] },
    ];
  }

  if (!db.usuarios.find(u => u.username === 'admin')) {
    db.usuarios.push({
      id: nextId(db.usuarios),
      nombre: 'Admin',
      apellido: 'Principal',
      username: 'admin',
      password: bcrypt.hashSync('admin123', 10),
      rol: 'admin',
      created_at: new Date().toISOString()
    });
    console.log('✅ Admin creado: admin / admin123');
  }

  saveDB(db);
}

seedDB();

// ─── Auth Middleware ──────────────────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No autenticado' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
}

function adminMiddleware(req, res, next) {
  if (req.user?.rol !== 'admin') return res.status(403).json({ error: 'Sin permisos' });
  next();
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════════════════════

app.post('/api/auth/registro', (req, res) => {
  const { nombre, apellido, username, password } = req.body;
  if (!nombre || !apellido || !username || !password)
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });

  const db = loadDB();
  if (db.usuarios.find(u => u.username === username))
    return res.status(409).json({ error: 'El usuario ya existe' });

  const nuevoUsuario = {
    id: nextId(db.usuarios),
    nombre, apellido, username,
    password: bcrypt.hashSync(password, 10),
    rol: 'user',
    created_at: new Date().toISOString()
  };
  db.usuarios.push(nuevoUsuario);
  saveDB(db);

  const token = jwt.sign(
    { id: nuevoUsuario.id, username, nombre: `${nombre} ${apellido}`, rol: 'user' },
    JWT_SECRET, { expiresIn: '7d' }
  );
  res.json({ token, nombre: `${nombre} ${apellido}`, rol: 'user' });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });

  const db = loadDB();
  const user = db.usuarios.find(u => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: 'Credenciales incorrectas' });

  const token = jwt.sign(
    { id: user.id, username: user.username, nombre: `${user.nombre} ${user.apellido}`, rol: user.rol },
    JWT_SECRET, { expiresIn: '7d' }
  );
  res.json({ token, nombre: `${user.nombre} ${user.apellido}`, rol: user.rol });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCTOS
// ═══════════════════════════════════════════════════════════════════════════════

app.get('/api/productos', (req, res) => {
  const { categoria, precio_min, precio_max } = req.query;
  let productos = loadDB().productos;
  if (categoria)  productos = productos.filter(p => p.categoria === categoria);
  if (precio_min) productos = productos.filter(p => p.precio >= Number(precio_min));
  if (precio_max) productos = productos.filter(p => p.precio <= Number(precio_max));
  res.json(productos);
});

app.get('/api/categorias', (req, res) => {
  const productos = loadDB().productos;
  const cats = [...new Set(productos.map(p => p.categoria))];
  res.json(cats);
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST + RECOMENDACIONES
// ═══════════════════════════════════════════════════════════════════════════════

app.post('/api/test/recomendar', (req, res) => {
  const { respuestas } = req.body;
  if (!respuestas || !Array.isArray(respuestas))
    return res.status(400).json({ error: 'Se requieren las respuestas' });

  const mapaEtiquetas = {
    'Creativa':'creativa','Deportista':'deportista','Tecnológica':'tecnologica','Romántica':'romantica',
    'Arte y manualidades':'artistica','Deportes al aire libre':'aventurera','Videojuegos':'tecnologica','Lectura':'lectura',
    'Visitar museos':'artistica','Aventuras extremas':'aventurera','Quedarse en casa':'introvertida','Viajes románticos':'romantica',
    'Elegante':'elegante','Casual':'casual','Minimalista':'minimalista','Colorido':'colorido',
    'Artísticas':'artistica','Acción':'accion','Comedia':'extrovertida','Terror':'aventurera',
    'Extrovertida':'extrovertida','Introvertida':'introvertida','Aventurera':'aventurera','Tranquila':'tranquila',
    'Pintando o dibujando':'creativa','Haciendo ejercicio':'deportista','Con tecnología':'tecnologica','Con amigos/pareja':'extrovertida',
    'Originalidad':'creativa','Utilidad práctica':'util','Innovación':'innovacion','Sentimiento':'sentimiento',
  };

  const etiquetasUsuario = respuestas.map(r => mapaEtiquetas[r]).filter(Boolean);
  const db = loadDB();

  const recomendados = db.productos
    .map(p => ({ ...p, score: etiquetasUsuario.filter(e => p.etiquetas.includes(e)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  // Guardar en historial si hay token
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      const user = jwt.verify(token, JWT_SECRET);
      for (const p of recomendados) {
        db.historial.push({
          id: nextId(db.historial),
          usuario_id: user.id,
          producto_id: p.id,
          nombre: p.nombre,
          precio: p.precio,
          categoria: p.categoria,
          fecha: new Date().toISOString()
        });
      }
      saveDB(db);
    } catch { /* token inválido, ignorar */ }
  }

  res.json(recomendados);
});

// ═══════════════════════════════════════════════════════════════════════════════
// HISTORIAL
// ═══════════════════════════════════════════════════════════════════════════════

app.get('/api/historial', authMiddleware, (req, res) => {
  const db = loadDB();
  const historial = db.historial
    .filter(h => h.usuario_id === req.user.id)
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 20);
  res.json(historial);
});

// ═══════════════════════════════════════════════════════════════════════════════
// PERFIL
// ═══════════════════════════════════════════════════════════════════════════════

app.get('/api/perfil', authMiddleware, (req, res) => {
  const db = loadDB();
  const user = db.usuarios.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  const { password, ...datos } = user;
  res.json(datos);
});

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN
// ═══════════════════════════════════════════════════════════════════════════════

app.get('/api/admin/usuarios', authMiddleware, adminMiddleware, (req, res) => {
  const db = loadDB();
  const usuarios = db.usuarios.map(({ password, ...u }) => u);
  res.json(usuarios);
});

app.delete('/api/admin/usuarios/:id', authMiddleware, adminMiddleware, (req, res) => {
  const id = Number(req.params.id);
  if (id === req.user.id)
    return res.status(400).json({ error: 'No puedes eliminar tu propio usuario' });
  const db = loadDB();
  db.usuarios = db.usuarios.filter(u => u.id !== id);
  saveDB(db);
  res.json({ ok: true });
});

app.post('/api/admin/registro', authMiddleware, adminMiddleware, (req, res) => {
  const { nombre, apellido, username, password } = req.body;
  if (!nombre || !apellido || !username || !password)
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });

  const db = loadDB();
  if (db.usuarios.find(u => u.username === username))
    return res.status(409).json({ error: 'El usuario ya existe' });

  db.usuarios.push({
    id: nextId(db.usuarios),
    nombre, apellido, username,
    password: bcrypt.hashSync(password, 10),
    rol: 'admin',
    created_at: new Date().toISOString()
  });
  saveDB(db);
  res.json({ ok: true });
});

app.get('/api/admin/stats', authMiddleware, adminMiddleware, (req, res) => {
  const db = loadDB();
  res.json({
    totalUsuarios: db.usuarios.filter(u => u.rol === 'user').length,
    totalProductos: db.productos.length,
    totalRecomendaciones: db.historial.length,
  });
});

// ─── Arrancar ─────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n🎁 Present&Go backend corriendo en http://localhost:' + PORT);
  console.log('   Admin por defecto -> usuario: admin | contraseña: admin123\n');
});
