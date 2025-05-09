// public/js/dashboard.js
import { get } from './api.js';

if (!localStorage.getItem('token')) {
  window.location = 'login.html';
}
document.getElementById('logoutBtn').onclick = () => {
  localStorage.clear();
  window.location = 'login.html';
};

const clientsUl    = document.getElementById('clientsList');
const consultasUl  = document.getElementById('consultasList');

async function loadDashboard() {
  try {
    const [clients, consultas] = await Promise.all([
      get('/clients'),
      get('/appointments')
    ]);
    clientsUl.innerHTML = clients
      .map(c => `<li>${c.nome}</li>`).join('');
    consultasUl.innerHTML = consultas
      .map(c => `<li>${new Date(c.dataHora).toLocaleString()} – ${c.clientNome}</li>`)
      .join('');
  } catch (err) {
    alert('Erro no dashboard: ' + err.message);
  }
}

loadDashboard();
