// public/js/auth.js
import { request } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  // Login
  const lf = document.getElementById('loginForm');
  if (lf) lf.addEventListener('submit', async e => {
    e.preventDefault();
    try {
      const res = await request(
        '/api/auth/login',
        'POST',
        {
          email:  e.target.email.value.trim(),
          senha:  e.target.senha.value
        },
        false
      );
      localStorage.setItem('token', res.token);
      window.location = 'dashboard.html';
    } catch (err) {
      alert(err.message || 'Erro no login');
    }
  });

  // Registro
  const rf = document.getElementById('registerForm');
  if (rf) rf.addEventListener('submit', async e => {
    e.preventDefault();
    try {
      await request(
        '/api/auth/register',
        'POST',
        {
          nome:   e.target.nome.value.trim(),
          email:  e.target.email.value.trim(),
          senha:  e.target.senha.value
        },
        false
      );
      alert('Cadastro realizado!');
      window.location = 'login.html';
    } catch (err) {
      alert(err.message || 'Erro no cadastro');
    }
  });
});
