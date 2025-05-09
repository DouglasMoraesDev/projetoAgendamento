// public/js/settings.js
import { put } from './api.js';

if (!localStorage.getItem('token')) {
  window.location = 'login.html';
}

const form = document.getElementById('pwdForm');
form.addEventListener('submit', async e => {
  e.preventDefault();
  const body = {
    senhaAtual: form.senhaAtual.value,
    novaSenha: form.novaSenha.value
  };
  try {
    await put('/profile/password', body);
    alert('Senha alterada com sucesso!');
    form.reset();
  } catch (err) {
    alert('Erro ao alterar senha: ' + err.message);
  }
});
