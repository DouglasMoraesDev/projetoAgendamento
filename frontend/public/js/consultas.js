// Agendar consulta
if (!localStorage.getItem('token')) location = 'login.html';
document.getElementById('logoutBtn').onclick = () => { localStorage.clear(); location = 'login.html' };

const formC = document.getElementById('consultaForm');
const sel = formC.pacienteId;
(async()=>{
  const pacientes = await request('/pacientes');
  pacientes.forEach(p => {
    const o = document.createElement('option');
    o.value = p.id; o.textContent = p.nome;
    sel.append(o);
  });
})();

formC.onsubmit = async e => {
  e.preventDefault();
  await request('/consultas', 'POST', {
    pacienteId: parseInt(sel.value),
    dataHora: formC.dataHora.value,
    tipo: formC.tipo.value
  });
  location = 'dashboard.html';
};
