if (!localStorage.getItem('token')) location = 'login.html';
document.getElementById('logoutBtn').onclick = () => { localStorage.clear(); location = 'login.html' };

const form = document.getElementById('diarioForm');
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
    data: form.data.value,
    refeicao: form.refeicao.value,
    porcao: form.porcao.value,
    calorias: parseInt(form.calorias.value),
    nota: form.nota.value
  };
  // Você precisa criar uma rota no backend (ex: /diario) e adaptá-la para receber esse POST
  await request('/diario', 'POST', data);
  alert('Diário salvo!');
  form.reset();
};

loadPacientes();
