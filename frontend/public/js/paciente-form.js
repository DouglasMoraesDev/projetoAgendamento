if (!localStorage.getItem('token')) location = 'login.html';
document.getElementById('logoutBtn').onclick = () => { localStorage.clear(); location = 'login.html' };

const form = document.getElementById('pacienteForm');
const params = new URLSearchParams(location.search);
const id = params.get('id');

if (id) {
  document.getElementById('formTitle').textContent = 'Editar Paciente';
  loadPaciente(id);
}

async function loadPaciente(id) {
  const p = await request(`/pacientes/${id}`);
  form.nome.value = p.nome;
  form.email.value = p.email;
  if (p.dataNasc) form.data_nasc.value = p.dataNasc.substring(0,10);
  form.historico.value = p.historico || '';
  form.alergias.value = p.alergias || '';
  form.objetivos.value = p.objetivos || '';
}

form.onsubmit = async e => {
  e.preventDefault();
  const data = {
    nome: form.nome.value,
    email: form.email.value,
    data_nasc: form.data_nasc.value,
    historico: form.historico.value,
    alergias: form.alergias.value,
    objetivos: form.objetivos.value
  };
  if (id) {
    await request(`/pacientes/${id}`, 'PUT', data);
  } else {
    await request('/pacientes', 'POST', data);
  }
  location = 'pacientes.html';
};
