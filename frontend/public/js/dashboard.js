// frontend/public/js/dashboard.js

if (!localStorage.getItem('token')) {
  window.location = 'login.html';
}
document.getElementById('logoutBtn').onclick = () => {
  localStorage.clear();
  window.location = 'login.html';
};

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
      // Salva o ID para a página de detalhes
      localStorage.setItem('selectedConsultaId', c.id);
      // Navega sem parâmetro
      window.location = 'consulta-detail.html';
    });
    ul.append(li);
  });
}

loadConsultas();
