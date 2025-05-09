// public/js/auth.js
import { post } from './api.js';

// Formulário de Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const senha = e.target.senha.value;
    try {
      const { token } = await post('/auth/login', { email, senha });
      localStorage.setItem('token', token);
      window.location = 'dashboard.html';
    } catch (err) {
      alert(err.message);
    }
  });
}

// Formulário de Registro
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async e => {
    e.preventDefault();
    const nome  = e.target.nome.value.trim();
    const email = e.target.email.value.trim();
    const senha = e.target.senha.value;
    try {
      await post('/auth/register', { nome, email, senha });
      alert('Cadastro realizado!');
      window.location = 'login.html';
    } catch (err) {
      alert(err.message);
    }
  });
}
