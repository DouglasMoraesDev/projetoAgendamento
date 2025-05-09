// public/js/consultas.js
import { get, del } from './api.js';

// Autenticação
if (!localStorage.getItem('token')) {
  window.location = 'login.html';
}
document.getElementById('logoutBtn').onclick = () => {
  localStorage.clear();
  window.location = 'login.html';
};

const ul = document.getElementById('consultasList');

// Carrega e renderiza consultas, com botões de editar e excluir
async function loadConsultas() {
  try {
    const cs = await get('/appointments');
    ul.innerHTML = cs.map(c => `
      <li>
        <strong>${new Date(c.dataHora).toLocaleString()}</strong> – 
        ${c.clientNome} [${c.status}]
        <button onclick="editAppointment(${c.id})">✏️</button>
        <button onclick="deleteAppointment(${c.id})">🗑️</button>
        <button onclick="viewDocs(${c.id})">📎 Docs</button>
      </li>
    `).join('');
  } catch (err) {
    alert('Erro ao carregar consultas: ' + err.message);
  }
}

window.editAppointment = id => {
  // Corrige para usar appointment-form.html
  window.location = `appointment-form.html?id=${id}`;
};

window.deleteAppointment = async id => {
  if (!confirm('Deseja realmente excluir esta consulta?')) return;
  try {
    await del(`/appointments/${id}`);
    loadConsultas();
  } catch (err) {
    alert('Erro ao excluir: ' + err.message);
  }
};

window.viewDocs = id => {
  localStorage.setItem('selectedConsultaId', id);
  window.location = 'consulta-detail.html';
};

loadConsultas();
