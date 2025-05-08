// Diário alimentar
if (!localStorage.getItem('token')) location = 'login.html';
document.getElementById('logoutBtn').onclick = () => { localStorage.clear(); location = 'login.html' };

const formD = document.getElementById('diarioForm');
const selD = formD.pacienteId;
(async()=>{
  const pacientes = await request('/pacientes');
  pacientes.forEach(p => {
    const o = document.createElement('option');
    o.value = p.id; o.textContent = p.nome;
    selD.append(o);
  });
})();

formD.onsubmit = async e => {
  e.preventDefault();
  await request('/diario', 'POST', {
    pacienteId: parseInt(selD.value),
    data: formD.data.value,
    refeicao: formD.refeicao.value,
    porcao: formD.porcao.value,
    calorias: parseInt(formD.calorias.value),
    nota: formD.nota.value
  });
  alert('Diário salvo!');
  formD.reset();
};
