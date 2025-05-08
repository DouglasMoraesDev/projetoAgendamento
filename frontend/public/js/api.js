// Base URL da API
const API_URL = 'http://localhost:3000';

/**
 * Faz uma requisição à API.
 */
async function request(path, method='GET', body=null, auth=true) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  
  const res = await fetch(API_URL + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  let data;
  try { data = await res.json() } catch {}
  if (!res.ok) throw new Error(data?.message || `Erro ${res.status}`);
  return data;
}
