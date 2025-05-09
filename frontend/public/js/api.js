// public/js/api.js

export const API_URL = 'http://localhost:3000';

export async function request(path, method = 'GET', body = null, auth = true) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  let data;
  try { data = await res.json(); } catch {}
  if (!res.ok) throw new Error(data?.message || `Erro ${res.status}`);
  return data;
}

// Exportações nomeadas para facilitar uso
export const get = (path, auth = true) => request(path, 'GET', null, auth);
export const post = (path, body, auth = true) => request(path, 'POST', body, auth);
export const put = (path, body, auth = true) => request(path, 'PUT', body, auth);
export const del = (path, auth = true) => request(path, 'DELETE', null, auth);
