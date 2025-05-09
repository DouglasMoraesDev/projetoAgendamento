// public/js/diario.js
import { get, post } from './api.js';

if (!localStorage.getItem('token')) {
  window.location = 'login.html';
}
document.getElementById('logoutBtn').onclick = () => {
  localStorage.clear();
  window.location = 'login.html';
};

const form = document.getElementById('diarioForm');
const select = form.clientId;

// Carrega clientes
(async () => {
  try {
    const clients = await get('/clients');
    select.innerHTML = clients
      .map(c => `<option value="${c.id}">${c.nome}</option>`)
      .join('');
  } catch (err) {
    alert('Erro ao carregar clientes: ' + err.message);
  }
})();

// Submete diário
form.addEventListener('submit', async e => {
  e.preventDefault();
  const body = {
    clientId: parseInt(form.clientId.value),
    data: form.data.value,
    refeicao: form.refeicao.value,
    porcao: form.porcao.value,
    calorias: form.calorias.value ? parseInt(form.calorias.value) : undefined,
    nota: form.nota.value
  };
  try {
    await post('/diary', body);
    alert('Diário salvo!');
    form.reset();
  } catch (err) {
    alert('Erro ao salvar diário: ' + err.message);
  }
});
