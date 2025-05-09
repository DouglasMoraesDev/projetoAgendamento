// public/js/profile.js
import { get, put } from './api.js';

if (!localStorage.getItem('token')) {
  window.location = 'login.html';
}

const form = document.getElementById('profileForm');

// Carrega perfil
async function loadProfile() {
  try {
    const user = await get('/profile');
    form.nome.value         = user.nome;
    form.email.value        = user.email;
    form.fotoUrl.value      = user.fotoUrl || '';
    form.tipo.value         = user.tipo;
    form.timezone.value     = user.timezone;
    form.notificacoes.value = user.notificacoes ? 'true' : 'false';
  } catch (err) {
    alert('Erro ao carregar perfil: ' + err.message);
  }
}

// Atualiza perfil
form.addEventListener('submit', async e => {
  e.preventDefault();
  const body = {
    nome: form.nome.value,
    email: form.email.value,
    fotoUrl: form.fotoUrl.value,
    tipo: form.tipo.value,
    timezone: form.timezone.value,
    notificacoes: form.notificacoes.value
  };
  try {
    await put('/profile', body);
    alert('Perfil atualizado!');
  } catch (err) {
    alert('Erro ao atualizar perfil: ' + err.message);
  }
});

loadProfile();
