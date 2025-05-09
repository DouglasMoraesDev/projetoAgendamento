// frontend/public/js/settings.js

if (!localStorage.getItem('token')) location = 'login.html';
document.getElementById('logoutBtn').onclick = () => {
  localStorage.clear();
  location = 'login.html';
};

const form = document.getElementById('pwdForm');

form.onsubmit = async e => {
  e.preventDefault();
  const data = {
    senhaAtual: form.senhaAtual.value,
    novaSenha: form.novaSenha.value
  };
  try {
    await request('/profile/password', 'PUT', data);
    alert('Senha alterada com sucesso!');
    form.reset();
  } catch (err) {
    alert('Erro ao alterar senha: ' + err.message);
  }
};
