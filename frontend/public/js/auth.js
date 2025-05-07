// Login
document.getElementById('loginForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const email = e.target.email.value;
  const senha = e.target.senha.value;
  const res = await request('/auth/login', 'POST', { email, senha }, false);
  if (res.token) {
    localStorage.setItem('token', res.token);
    window.location = 'dashboard.html';
  } else {
    alert(res.message || 'Erro no login');
  }
});

// Registro
document.getElementById('registerForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const nome = e.target.nome.value;
  const email = e.target.email.value;
  const senha = e.target.senha.value;
  const res = await request('/auth/register', 'POST', { nome, email, senha }, false);
  if (res.id) {
    alert('Cadastro realizado!');
    window.location = 'login.html';
  } else {
    alert(res.message || 'Erro no cadastro');
  }
});
