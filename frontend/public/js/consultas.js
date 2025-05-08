if (!localStorage.getItem('token')) location = 'login.html';
document.getElementById('logoutBtn').onclick = () => { localStorage.clear(); location = 'login.html' };

const form = document.getElementById('consultaForm');
const select = form.pacienteId;

async function loadPacientes() {
  const pacientes = await request('/pacientes');
  pacientes.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.nome;
    select.appendChild(opt);
  });
}

form.onsubmit = async e => {
  e.preventDefault();
  const data = {
    pacienteId: parseInt(form.pacienteId.value),
    dataHora: form.dataHora.value,
    tipo: form.tipo.value
  };
  await request('/consultas', 'POST', data);
  location = 'dashboard.html';
};

loadPacientes();
