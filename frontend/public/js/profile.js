// frontend/public/js/profile.js

if (!localStorage.getItem('token')) location = 'login.html';
document.getElementById('logoutBtn').onclick = () => {
  localStorage.clear();
  location = 'login.html';
};

const form = document.getElementById('profileForm');

(async () => {
  try {
    const u = await request('/profile');
    form.nome.value         = u.nome;
    form.email.value        = u.email;
    form.fotoUrl.value      = u.fotoUrl || '';
    form.especialidade.value = u.especialidade || '';
    form.timezone.value     = u.timezone || '';
    form.notificacoes.value = u.notificacoes.toString();
  } catch (err) {
    alert('Erro ao carregar perfil: ' + err.message);
  }
})();

form.onsubmit = async e => {
  e.preventDefault();
  const data = {
    nome: form.nome.value.trim(),
    email: form.email.value.trim(),
    fotoUrl: form.fotoUrl.value.trim() || null,
    especialidade: form.especialidade.value.trim() || null,
    timezone: form.timezone.value.trim() || null,
    notificacoes: form.notificacoes.value === 'true'
  };
  try {
    await request('/profile', 'PUT', data);
    alert('Perfil atualizado!');
  } catch (err) {
    alert('Erro ao salvar perfil: ' + err.message);
  }
};
