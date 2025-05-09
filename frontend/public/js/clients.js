// public/js/clients.js

import { get, del } from './api.js'; // del é uma função auxiliar que você pode criar no api.js para DELETE

const listEl = document.getElementById('clientsList');
const btnNew = document.getElementById('novoClienteBtn');

// Botão para novo cliente
btnNew.onclick = () => location.href = 'clients-form.html';

// Função para carregar e renderizar a lista de clientes
async function loadClients() {
  try {
    const clients = await get('/api/clients');

    listEl.innerHTML = clients.map(c => `
      <li>
        ${c.nome} — ${c.email}
        <button onclick="edit(${c.id})">✏️</button>
        <button onclick="remove(${c.id})">🗑️</button>
      </li>
    `).join('');
  } catch (err) {
    console.error('Erro ao carregar clientes:', err);
    alert('Erro ao carregar clientes.');
  }
}

// Redireciona para o formulário de edição
window.edit = id => location.href = `clients-form.html?id=${id}`;

// Remove um cliente
window.remove = async id => {
  if (!confirm('Remover cliente?')) return;

  try {
    await del(`/api/clients/${id}`);
    loadClients();
  } catch (err) {
    console.error('Erro ao remover cliente:', err);
    alert('Erro ao remover cliente');
  }
};

loadClients();
