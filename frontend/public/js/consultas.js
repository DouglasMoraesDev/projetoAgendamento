// public/js/consultas.js
import { get } from './api.js';

// Autenticação
if (!localStorage.getItem('token')) {
  window.location = 'login.html';
}

document.getElementById('logoutBtn').onclick = () => {
  localStorage.clear();
  window.location = 'login.html';
};

const ul = document.getElementById('consultasList');

async function loadConsultas() {
  try {
    const cs = await get('/appointments');
    ul.innerHTML = cs.map(c => `
      <li>
        <strong>${new Date(c.dataHora).toLocaleString()}</strong> – 
        ${c.clientNome} [${c.status}]
        <button class="detalhes-btn" data-id="${c.id}">Ver Detalhes</button>
      </li>
    `).join('');

    // adiciona event listeners
    document.querySelectorAll('.detalhes-btn').forEach(btn => {
      btn.onclick = () => {
        localStorage.setItem('selectedConsultaId', btn.dataset.id);
        window.location = 'consulta-detail.html';
      };
    });
  } catch (err) {
    alert('Erro ao carregar consultas: ' + err.message);
  }
}

loadConsultas();
