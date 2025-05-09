// public/js/consulta-detail.js

document.addEventListener('DOMContentLoaded', () => {
  // 1) Recupere o ID da consulta atual.
  //    Pode vir de um atributo data no HTML ou da URL.
  const appointmentId = Number(
    document
      .querySelector('body')
      .getAttribute('data-appointment-id')
  );
  
  // Elementos do DOM
  const listaEl   = document.getElementById('lista-anotacoes');
  const textarea  = document.getElementById('nota-texto');
  const btnSalvar = document.getElementById('btn-salvar-nota');

  // Função: busca anotações e renderiza na lista
  async function carregarAnotacoes() {
    try {
      const res = await fetch(
        `/api/anotacoes?appointmentId=${appointmentId}`
      );
      if (!res.ok) throw new Error('Erro ao buscar notas');

      const anotacoes = await res.json();
      listaEl.innerHTML = ''; // limpa lista

      anotacoes.forEach((nota) => {
        const li = document.createElement('li');
        const data = new Date(nota.criadoEm).toLocaleString('pt-BR');
        li.textContent = `[${data}] ${nota.texto}`;
        listaEl.appendChild(li);
      });
    } catch (err) {
      console.error(err);
      alert('Não foi possível carregar as anotações.');
    }
  }

  // Função: envia nova anotação para o backend
  async function salvarAnotacao() {
    const texto = textarea.value.trim();
    if (!texto) {
      return alert('Por favor, digite uma anotação antes de salvar.');
    }

    try {
      const res = await fetch('/api/anotacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId, texto }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao salvar anotação');
      }

      textarea.value = '';     // limpa campo
      carregarAnotacoes();     // recarrega lista
    } catch (err) {
      console.error(err);
      alert(`Erro: ${err.message}`);
    }
  }

  // Evento de clique no botão Salvar
  btnSalvar.addEventListener('click', salvarAnotacao);

  // Carrega as anotações ao abrir a página
  carregarAnotacoes();
});
