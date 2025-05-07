const API_URL = 'http://localhost:3000';

async function request(path, method = 'GET', body, auth = true) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(API_URL + path, {
    method, headers,
    body: body ? JSON.stringify(body) : undefined
  });
  return res.json();
}
