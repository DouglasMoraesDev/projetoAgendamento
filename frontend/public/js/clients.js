// public/js/clients.js
import { get, del } from './api.js';

// Garante autenticação
if (!localStorage.getItem('token')) {
  window.location = 'login.html';
}

// Elementos
const listEl = document.getElementById('clientsList');
document.getElementById('novoClienteBtn').onclick = () => {
  window.location = 'clients-form.html';
};

// Carrega e renderiza clientes
async function loadClients() {
  try {
    const clients = await get('/clients');
    listEl.innerHTML = clients.map(c => `
      <li>
        ${c.nome} — ${c.email}
        <button onclick="editClient(${c.id})">✏️</button>
        <button onclick="removeClient(${c.id})">🗑️</button>
      </li>
    `).join('');
  } catch (err) {
    alert('Erro ao carregar clientes: ' + err.message);
  }
}

window.editClient = id => {
  window.location = `clients-form.html?id=${id}`;
};

window.removeClient = async id => {
  if (!confirm('Remover cliente?')) return;
  try {
    await del(`/clients/${id}`);
    loadClients();
  } catch (err) {
    alert('Erro ao remover: ' + err.message);
  }
};

loadClients();
