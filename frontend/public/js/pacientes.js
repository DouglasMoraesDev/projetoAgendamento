if (!localStorage.getItem('token')) window.location = 'login.html';

const ul = document.getElementById('pacientesList');
const btnNovo = document.getElementById('novoPacienteBtn');

btnNovo.addEventListener('click', () => {
  window.location = 'paciente-form.html';
});

async function loadPacientes() {
  const pacientes = await request('/pacientes');
  ul.innerHTML = '';
  pacientes.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${p.nome}</strong> (${new Date(p.dataNasc).toLocaleDateString()})
      <button data-id="${p.id}" class="view">Ver</button>
      <button data-id="${p.id}" class="edit">Editar</button>
      <button data-id="${p.id}" class="delete">Excluir</button>
    `;
    ul.appendChild(li);
  });
  document.querySelectorAll('.delete').forEach(btn =>
    btn.addEventListener('click', async e => {
      await request(`/pacientes/${e.target.dataset.id}`, 'DELETE', null);
      loadPacientes();
    })
  );
}

loadPacientes();
