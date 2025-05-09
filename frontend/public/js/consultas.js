// frontend/public/js/consulta-detail.js

// Verifica autenticação
if (!localStorage.getItem('token')) location = 'login.html';
document.getElementById('logoutBtn').onclick = () => {
  localStorage.clear();
  location = 'login.html';
};

const params = new URLSearchParams(location.search);
const id     = params.get('id');
const infoEl = document.getElementById('infoConsulta');
const docsUl = document.getElementById('docsList');
const form   = document.getElementById('uploadForm');

// Se id não existir ou não for numérico, volta ao dashboard
if (!id || isNaN(id)) {
  alert('Consulta não especificada ou inválida.');
  window.location = 'dashboard.html';
}

// Carrega detalhes da consulta
(async () => {
  try {
    const consultas = await request('/consultas');
    const cons = consultas.find(c => c.id.toString() === id);
    if (!cons) {
      alert('Consulta não encontrada.');
      return window.location = 'dashboard.html';
    }

    infoEl.innerHTML = `
      <p><strong>Paciente:</strong> ${cons.paciente_nome}</p>
      <p><strong>Data:</strong> ${new Date(cons.dataHora).toLocaleString()}</p>
      <p><strong>Tipo:</strong> ${cons.tipo}</p>
      <p><strong>Status:</strong> ${cons.status}</p>
    `;

    loadDocs();
  } catch (err) {
    alert('Erro ao carregar consulta.');
    window.location = 'dashboard.html';
  }
})();

// Lista documentos
async function loadDocs() {
  try {
    const docs = await request(`/consultas/${id}/documentos`);
    docsUl.innerHTML = '';
    docs.forEach(d => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${d.urlArquivo}" target="_blank">${d.urlArquivo.split('/').pop()}</a>`;
      docsUl.append(li);
    });
  } catch (err) {
    docsUl.innerHTML = '<li>Erro ao carregar documentos</li>';
  }
}

// Upload de documento
form.onsubmit = async e => {
  e.preventDefault();
  const data = new FormData(form);
  try {
    const res = await fetch(`http://localhost:3000/consultas/${id}/documentos`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: data
    });
    if (!res.ok) throw new Error('Erro no upload');
    alert('Documento enviado!');
    form.reset();
    loadDocs();
  } catch (err) {
    alert(err.message);
  }
};
