import { get, post, put } from './api.js';
import { getToken } from './auth.js';

const form = document.getElementById('clientForm');
const params = new URLSearchParams(location.search);
const id = params.get('id');

async function loadClient() {
  if (!id) return;
  const c = await get(`/api/clients/${id}`, getToken());
  form.nome.value = c.nome;
  form.email.value = c.email;
  form.cpf.value = c.cpf;
  // preencha demais campos...
  document.getElementById('formTitle').textContent = 'Editar Cliente';
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const body = Object.fromEntries(new FormData(form));
  if (id) {
    await put(`/api/clients/${id}`, body, getToken());
  } else {
    await post('/api/clients', body, getToken());
  }
  location.href = 'clients.html';
});

loadClient();
