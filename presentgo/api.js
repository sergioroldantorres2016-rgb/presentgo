// ─── api.js ── helper compartido para todas las páginas ───────────────────────
const API = 'http://localhost:3000/api';

function getToken() {
  return localStorage.getItem('token');
}

function getHeaders(withAuth = true) {
  const h = { 'Content-Type': 'application/json' };
  if (withAuth) {
    const token = getToken();
    if (token) h['Authorization'] = `Bearer ${token}`;
  }
  return h;
}

async function apiFetch(endpoint, options = {}) {
  const res = await fetch(API + endpoint, {
    headers: getHeaders(options.auth !== false),
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error en la petición');
  return data;
}

function requireAuth() {
  if (!getToken()) {
    window.location.href = '../login/login.html';
    return false;
  }
  return true;
}
