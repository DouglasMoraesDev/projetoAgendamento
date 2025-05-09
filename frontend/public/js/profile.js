// public/js/profile.js
import { get, put } from './api.js';

const form = document.getElementById('profileForm');

// Carrega os dados do perfil do profissional logado
async function loadProfile() {
  try {
    const user = await get('/api/profile');
    form.nome.value = user.nome;
    form.email.value = user.email;
    form.fotoUrl.value = user.fotoUrl || '';
    form.tipo.value = user.tipo || '';
    form.timezone.value = user.timezone || '';
    form.notificacoes.value = user.notificacoes || '';
  } catch (err) {
    console.error('Erro ao carregar perfil:', err);
    alert('Erro ao carregar perfil');
  }
}

// Envia alterações no formulário para a API
form.addEventListener('submit', async e => {
  e.preventDefault();
  const payload = {
    nome: form.nome.value,
    email: form.email.value,
    fotoUrl: form.fotoUrl.value,
    tipo: form.tipo.value,
    timezone: form.timezone.value,
    notificacoes: form.notificacoes.value
  };

  try {
    await put('/api/profile', payload);
    alert('Perfil atualizado com sucesso!');
  } catch (err) {
    console.error('Erro ao atualizar perfil:', err);
    alert('Erro ao atualizar perfil');
  }
});

loadProfile();
