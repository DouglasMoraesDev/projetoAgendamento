import { get, post } from './api.js';
import { getToken } from './auth.js';

const form = document.getElementById('appointmentForm');
const select = form.clientId;

async function loadClients() {
  const clients = await get('/api/clients', getToken());
  select.innerHTML = clients.map(c => `<option value="${c.id}">${c.nome}</option>`).join('');
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const body = Object.fromEntries(new FormData(form));
  await post('/api/appointments', body, getToken());
  alert('Consulta agendada!');
});

loadClients();
