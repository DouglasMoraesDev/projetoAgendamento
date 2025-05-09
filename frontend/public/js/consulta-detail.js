// frontend/public/js/consulta-detail.js

import { request, API_URL } from './api.js';

// Garante que está logado
if (!localStorage.getItem('token')) {
  window.location = 'login.html';
}

// Logout
document.getElementById('logoutBtn').onclick = () => {
  localStorage.clear();
  window.location = 'login.html';
};

// Pega ID salvo no dashboard (ou altere para URLSearchParams se preferir)
const id = localStorage.getItem('selectedConsultaId');
if (!id) {
  alert('Consulta não especificada.');
  window.location = 'dashboard.html';
}

const infoEl   = document.getElementById('infoConsulta');
const docsUl   = document.getElementById('docsList');
const uploadForm = document.getElementById('uploadForm');

;(async () => {
  try {
    // GET lista completa e filtra localmente
    const consultas = await request('/api/appointments');
    const cons = consultas.find(c => String(c.id) === id);
    if (!cons) throw new Error('Não encontrada');
    infoEl.innerHTML = `
      <p><strong>Cliente:</strong> ${cons.clientNome}</p>
      <p><strong>Data:</strong> ${new Date(cons.dataHora).toLocaleString()}</p>
      <p><strong>Tipo:</strong> ${cons.tipo}</p>
      <p><strong>Status:</strong> ${cons.status}</p>
    `;
    await loadDocs();
  } catch (err) {
    alert('Erro ao carregar detalhes da consulta.');
    console.error(err);
    window.location = 'dashboard.html';
  }
})();

async function loadDocs() {
  try {
    const docs = await request(`/api/appointments/${id}/documentos`);
    docsUl.innerHTML = '';
    docs.forEach(d => {
      const nome = d.urlArquivo.split('/').pop();
      const li = document.createElement('li');
      li.innerHTML = `<a href="${d.urlArquivo}" target="_blank">${nome}</a>`;
      docsUl.append(li);
    });
  } catch (err) {
    console.error(err);
    docsUl.innerHTML = '<li>Erro ao carregar documentos.</li>';
  }
}

uploadForm.onsubmit = async e => {
  e.preventDefault();
  const data = new FormData(uploadForm);
  try {
    const res = await fetch(
      `${API_URL}/api/appointments/${id}/documentos`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: data
      }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    alert('Documento enviado!');
    uploadForm.reset();
    await loadDocs();
  } catch (err) {
    alert('Falha no upload de documento.');
    console.error(err);
  }
};
