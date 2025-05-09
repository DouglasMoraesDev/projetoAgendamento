// public/js/api.js
export const API_BASE = 'http://localhost:3000/api';

export async function request(path, method = 'GET', body = null) {
  const url = `${API_BASE}${path}`;
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data;
  try { data = await res.json(); } catch {}

  if (!res.ok) {
    throw new Error(data?.message || `HTTP ${res.status}`);
  }
  return data;
}

export const get   = path             => request(path, 'GET');
export const post  = (path, body)     => request(path, 'POST', body);
export const put   = (path, body)     => request(path, 'PUT', body);
export const del   = path             => request(path, 'DELETE');
export const patch = (path, body)     => request(path, 'PATCH', body);
