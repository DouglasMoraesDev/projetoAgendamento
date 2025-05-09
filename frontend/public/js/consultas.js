// frontend/public/js/consultas.js

// Redireciona sem token
if (!localStorage.getItem('token')) {
  alert('Faça login primeiro.');
  window.location = 'login.html';
}

// Logout
document.getElementById('logoutBtn').onclick = () => {
  localStorage.clear();
  window.location = 'login.html';
};

const form = document.getElementById('consultaForm');
const selectPac = form.pacienteId;

// Carrega pacientes no <select>
(async () => {
  try {
    const pacientes = await request('/pacientes');
    pacientes.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.nome;
      selectPac.append(opt);
    });
  } catch (err) {
    alert('Erro ao carregar pacientes: ' + err.message);
  }
})();

form.addEventListener('submit', async e => {
  e.preventDefault();

  const payload = {
    pacienteId: parseInt(selectPac.value),
    dataHora:   form.dataHora.value,
    tipo:       form.tipo.value
  };

  try {
    const res = await request('/consultas', 'POST', payload);
    // Se o backend retornar { id }, confirma
    if (res.id) {
      alert('Consulta agendada: ID ' + res.id);
      window.location = 'dashboard.html';
    } else {
      throw new Error('Resposta inesperada: ' + JSON.stringify(res));
    }
  } catch (err) {
    alert('Erro ao agendar: ' + err.message);
    console.error('Erro agendar consulta:', err);
  }
});
