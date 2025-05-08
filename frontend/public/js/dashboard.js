// Dashboard: mostra pacientes e consultas
if (!localStorage.getItem('token')) location = 'login.html';
document.getElementById('logoutBtn').onclick = () => {
  localStorage.clear();
  location = 'login.html';
};

async function loadPacientes() {
  const pts = await request('/pacientes');
  const ul = document.getElementById('pacientesList');
  ul.innerHTML = '';
  pts.forEach(p => {
    const li = document.createElement('li');
    li.textContent = `${p.nome} (${p.email})`;
    ul.append(li);
  });
}

async function loadConsultas() {
  const cs = await request('/consultas');
  const ul = document.getElementById('consultasList');
  ul.innerHTML = '';
  cs.forEach(c => {
    const li = document.createElement('li');
    li.textContent = `${new Date(c.dataHora).toLocaleString()} – ${c.paciente_nome} [${c.status}]`;
    ul.append(li);
  });
}

loadPacientes();
loadConsultas();
