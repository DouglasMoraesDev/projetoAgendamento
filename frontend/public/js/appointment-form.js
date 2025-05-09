// public/js/appointment-form.js
import { get, post, put } from './api.js';

if (!localStorage.getItem('token')) {
  window.location = 'login.html';
}
document.getElementById('logoutBtn').onclick = () => {
  localStorage.clear();
  window.location = 'login.html';
};

const form      = document.getElementById('appointmentForm');
const selectCli = form.clientId;
const params    = new URLSearchParams(location.search);
const id        = params.get('id');

// Carrega clientes para o select
async function loadClients() {
  const clients = await get('/clients');
  selectCli.innerHTML = clients
    .map(c => `<option value="${c.id}">${c.nome}</option>`)
    .join('');
}

// Se estiver editando, busca dados da consulta
async function loadAppointment() {
  if (!id) return;
  document.getElementById('formTitle').textContent = 'Editar Consulta';
  document.getElementById('pageTitle').textContent = 'Editar Consulta';

  const c = await get(`/appointments/${id}`);
  form.clientId.value = c.clientId;
  const dt = new Date(c.dataHora);
  form.dataHora.value = dt.toISOString().substring(0,16);
  form.tipo.value   = c.tipo;
  form.status.value = c.status;
}

// Submissão: cria ou atualiza
form.addEventListener('submit', async e => {
  e.preventDefault();
  const body = Object.fromEntries(new FormData(form));
  try {
    if (id) {
      await put(`/appointments/${id}`, body);
      alert('Consulta atualizada!');
    } else {
      await post('/appointments', body);
      alert('Consulta criada!');
    }
    window.location = 'consultas.html';
  } catch (err) {
    alert('Erro ao salvar: ' + err.message);
  }
});

(async () => {
  await loadClients();
  await loadAppointment();
})();
