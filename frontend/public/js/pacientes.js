// Listagem, editar e excluir pacientes
if (!localStorage.getItem('token')) location = 'login.html';
document.getElementById('logoutBtn').onclick = () => { localStorage.clear(); location = 'login.html' };

const ul = document.getElementById('pacientesList');
document.getElementById('novoPacienteBtn').onclick = () => location = 'paciente-form.html';

async function loadPacientes() {
  const list = await request('/pacientes');
  ul.innerHTML = '';
  list.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${p.nome}</strong> (${p.email})
      <button onclick="location='paciente-form.html?id=${p.id}'">Editar</button>
      <button onclick="excluir(${p.id})">Excluir</button>
    `;
    ul.append(li);
  });
}

async function excluir(id) {
  if (confirm('Confirma exclusão?')) {
    await request(`/pacientes/${id}`, 'DELETE');
    loadPacientes();
  }
}

loadPacientes();
