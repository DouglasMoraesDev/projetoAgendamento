// frontend/public/js/consultas.js

import { request } from './api.js';

// Redireciona sem token
if (!localStorage.getItem('token')) {
  alert('Faça login primeiro.');
  window.location = 'login.html';
}

// Logout
document.getElementById('logoutBtn').onclick = () => {
  localStorage.clear();
  window.location = 'login.html';
};

const form = document.getElementById('consultaForm');
const selectPac = form.pacienteId;

// Carrega clientes no <select>
;(async () => {
  try {
    // Chamada agora para /api/clients
    const clientes = await request('/api/clients');
    clientes.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.nome;
      selectPac.append(opt);
    });
  } catch (err) {
    alert('Erro ao carregar clientes: ' + err.message);
    console.error(err);
  }
})();

form.addEventListener('submit', async e => {
  e.preventDefault();

  const payload = {
    clientId:   parseInt(selectPac.value),  // campo renomeado
    dataHora:   form.dataHora.value,
    tipo:       form.tipo.value
  };

  try {
    // POST para /api/appointments
    const res = await request('/api/appointments', 'POST', payload);
    if (res.id) {
      alert('Consulta agendada: ID ' + res.id);
      window.location = 'dashboard.html';
    } else {
      throw new Error('Resposta inesperada: ' + JSON.stringify(res));
    }
  } catch (err) {
    alert('Erro ao agendar: ' + err.message);
    console.error('Erro agendar consulta:', err);
  }
});
