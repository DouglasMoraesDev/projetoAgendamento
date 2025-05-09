// frontend/public/js/dashboard.js
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
    li.innerHTML = `
      <strong>${new Date(c.dataHora).toLocaleString()}</strong> – 
      ${c.paciente_nome} [${c.status}]
      <button class="detalhes-btn">Ver Detalhes</button>
    `;
    li.querySelector('.detalhes-btn').addEventListener('click', () => {
      window.location.href = `consulta-detail.html?id=${c.id}`;
    });
    ul.append(li);
  });
}

loadPacientes();
loadConsultas();
