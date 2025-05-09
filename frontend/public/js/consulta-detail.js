// frontend/public/js/consulta-detail.js

if (!localStorage.getItem('token')) {
  window.location = 'login.html';
}
document.getElementById('logoutBtn').onclick = () => {
  localStorage.clear();
  window.location = 'login.html';
};

// Pega o ID salvo no dashboard
const id = localStorage.getItem('selectedConsultaId');
if (!id) {
  alert('Consulta não especificada.');
  window.location = 'dashboard.html';
}

// Agora segue normalmente
const infoEl = document.getElementById('infoConsulta');
const docsUl = document.getElementById('docsList');
const form   = document.getElementById('uploadForm');

(async () => {
  try {
    const consultas = await request('/consultas');
    const cons = consultas.find(c => String(c.id) === id);
    if (!cons) throw new Error();
    infoEl.innerHTML = `
      <p><strong>Paciente:</strong> ${cons.paciente_nome}</p>
      <p><strong>Data:</strong> ${new Date(cons.dataHora).toLocaleString()}</p>
      <p><strong>Tipo:</strong> ${cons.tipo}</p>
      <p><strong>Status:</strong> ${cons.status}</p>
    `;
    await loadDocs();
  } catch {
    alert('Erro ao carregar detalhes da consulta.');
    window.location = 'dashboard.html';
  }
})();

async function loadDocs() {
  try {
    const docs = await request(`/consultas/${id}/documentos`);
    docsUl.innerHTML = '';
    docs.forEach(d => {
      const nome = d.urlArquivo.split('/').pop();
      const li = document.createElement('li');
      li.innerHTML = `<a href="${d.urlArquivo}" target="_blank">${nome}</a>`;
      docsUl.append(li);
    });
  } catch {
    docsUl.innerHTML = '<li>Erro ao carregar documentos.</li>';
  }
}

form.onsubmit = async e => {
  e.preventDefault();
  const data = new FormData(form);
  try {
    const res = await fetch(`${API_URL}/consultas/${id}/documentos`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: data
    });
    if (!res.ok) throw new Error();
    alert('Documento enviado!');
    form.reset();
    await loadDocs();
  } catch {
    alert('Falha no upload de documento.');
  }
};
