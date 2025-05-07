if (!localStorage.getItem('token')) {
  window.location = 'login.html';
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location = 'login.html';
});

async function loadPacientes() {
  const list = await request('/pacientes');
  const ul = document.getElementById('pacientesList');
  ul.innerHTML = '';
  list.forEach(p => {
    const li = document.createElement('li');
    li.textContent = `${p.nome} (${p.email})`;
    ul.appendChild(li);
  });
}

async function loadConsultas() {
  const list = await request('/consultas');
  const ul = document.getElementById('consultasList');
  ul.innerHTML = '';
  list.forEach(c => {
    const li = document.createElement('li');
    li.textContent = `${new Date(c.data_hora).toLocaleString()} – ${c.paciente_nome} [${c.status}]`;
    ul.appendChild(li);
  });
}

loadPacientes();
loadConsultas();
