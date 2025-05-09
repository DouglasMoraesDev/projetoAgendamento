// public/js/appointments.js
import { get, post } from './api.js';

// Autenticação
if (!localStorage.getItem('token')) {
  window.location = 'login.html';
}

const form = document.getElementById('appointmentForm');
const select = form.clientId;

// Carrega clientes para o <select>
async function loadClients() {
  try {
    const clients = await get('/clients');
    select.innerHTML = clients
      .map(c => `<option value="${c.id}">${c.nome}</option>`)
      .join('');
  } catch (err) {
    alert('Erro ao carregar clientes: ' + err.message);
  }
}

// Submete nova consulta
form.addEventListener('submit', async e => {
  e.preventDefault();
  const body = {
    clientId: parseInt(form.clientId.value),
    dataHora: form.dataHora.value,
    tipo: form.tipo.value
  };
  try {
    await post('/appointments', body);
    alert('Consulta agendada!');
    window.location = 'calendar.html';
  } catch (err) {
    alert('Erro ao agendar: ' + err.message);
  }
});

loadClients();
