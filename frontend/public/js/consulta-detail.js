// public/js/consulta-detail.js
import { get, BACKEND_URL } from './api.js';

if (!localStorage.getItem('token')) {
  window.location = 'login.html';
}

document.getElementById('logoutBtn').onclick = () => {
  localStorage.clear();
  window.location = 'login.html';
};

const infoEl = document.getElementById('infoConsulta');
const docsUl = document.getElementById('docsList');
const uploadForm = document.getElementById('uploadForm');
const appointmentId = localStorage.getItem('selectedConsultaId');

async function loadConsulta() {
  try {
    const list = await get('/appointments');
    const c = list.find(x => String(x.id) === appointmentId);
    if (!c) throw new Error('Consulta não encontrada');
    infoEl.innerHTML = `
      <p><strong>Cliente:</strong> ${c.clientNome}</p>
      <p><strong>Data:</strong> ${new Date(c.dataHora).toLocaleString()}</p>
      <p><strong>Tipo:</strong> ${c.tipo}</p>
      <p><strong>Status:</strong> ${c.status}</p>
    `;
    await loadDocs();
  } catch (err) {
    alert(err.message);
    window.location = 'consultas.html';
  }
}

async function loadDocs() {
  try {
    const docs = await get(`/appointments/${appointmentId}/documents`);
    docsUl.innerHTML = docs
    .map(d => {
        // nome do arquivo só para exibir
        const name = d.urlArquivo.split('/').pop();
        // URL completa: backend + caminho /uploads/filename
          const url  = `${BACKEND_URL}${d.urlArquivo}`;
        return `<li><a href="${url}" target="_blank">${name}</a></li>`;
         })
      .join('');
  } catch {
    docsUl.innerHTML = '<li>Erro ao carregar documentos.</li>';
  }
}

// Upload de documento
uploadForm.addEventListener('submit', async e => {
  e.preventDefault();
  const data = new FormData(uploadForm);
  try {
    const res = await fetch(
      `http://localhost:3000/api/appointments/${appointmentId}/documents`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: data
      }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    alert('Documento enviado!');
    uploadForm.reset();
    loadDocs();
  } catch (err) {
    alert('Falha no upload: ' + err.message);
  }
});

loadConsulta();
