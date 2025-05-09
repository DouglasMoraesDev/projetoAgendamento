// public/js/consulta-detail.js

document.addEventListener('DOMContentLoaded', () => {
  // === 1) Recupera o ID da consulta ===
  let appointmentId = parseInt(document.body.dataset.appointmentId, 10);

  // Se não estiver no data-attribute, tenta extrair da URL (/consulta/123)
  if (isNaN(appointmentId) || appointmentId <= 0) {
    const match = window.location.pathname.match(/\/consulta\/(\d+)/);
    if (match) {
      appointmentId = parseInt(match[1], 10);
    }
  }

  if (isNaN(appointmentId) || appointmentId <= 0) {
    alert('ID da consulta não encontrado. Verifique a marcação HTML ou a URL.');
    return;
  }

  // === 2) Seleciona elementos do DOM ===
  // Anotações
  const listaAnotacoesEl = document.getElementById('lista-anotacoes');
  const textareaNota     = document.getElementById('nota-texto');
  const btnSalvarNota    = document.getElementById('btn-salvar-nota');
  // Pagamentos
  const listaPagamentosEl = document.getElementById('lista-pagamentos');
  const inpValor          = document.getElementById('pag-valor');
  const selMetodo         = document.getElementById('pag-metodo');
  const btnCobrar         = document.getElementById('btn-cobrar');

  // === 3) Funções do Módulo 2: Anotações ===
  async function carregarAnotacoes() {
    try {
      const res = await fetch(`/api/anotacoes?appointmentId=${appointmentId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const anotacoes = await res.json();
      listaAnotacoesEl.innerHTML = '';
      anotacoes.forEach(nota => {
        const li = document.createElement('li');
        const data = new Date(nota.criadoEm).toLocaleString('pt-BR');
        li.textContent = `[${data}] ${nota.texto}`;
        listaAnotacoesEl.appendChild(li);
      });
    } catch (err) {
      console.error('Erro ao carregar anotações:', err);
      alert('Não foi possível carregar as anotações.');
    }
  }

  async function salvarAnotacao() {
    const texto = textareaNota.value.trim();
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
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      textareaNota.value = '';
      carregarAnotacoes();
    } catch (err) {
      console.error('Erro ao salvar anotação:', err);
      alert(`Erro ao salvar anotação: ${err.message}`);
    }
  }

  btnSalvarNota.addEventListener('click', salvarAnotacao);

  // === 4) Funções do Módulo 3: Financeiro ===
  async function carregarPagamentos() {
    try {
      const res = await fetch(`/api/payments?appointmentId=${appointmentId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const pagamentos = await res.json();
      listaPagamentosEl.innerHTML = '';
      pagamentos.forEach(p => {
        const li = document.createElement('li');
        const data = new Date(p.criadoEm).toLocaleString('pt-BR');
        li.innerHTML = `
          [${data}] R$ ${p.valor.toFixed(2)} — ${p.metodo}
          <strong>Status:</strong> ${p.status}
          ${p.status === 'pendente'
            ? `<button data-id="${p.id}" class="btn-atualizar-status">Marcar como pago</button>`
            : ''}
        `;
        listaPagamentosEl.appendChild(li);
      });
      // adiciona listeners aos botões internos
      document.querySelectorAll('.btn-atualizar-status')
        .forEach(btn => btn.addEventListener('click', atualizarStatus));
    } catch (err) {
      console.error('Erro ao carregar pagamentos:', err);
      alert('Erro ao carregar pagamentos.');
    }
  }

  async function criarPagamento() {
    const valor = parseFloat(inpValor.value);
    const metodo = selMetodo.value;
    if (isNaN(valor) || valor <= 0) {
      return alert('Digite um valor válido.');
    }
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId, valor, metodo }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      inpValor.value = '';
      carregarPagamentos();
    } catch (err) {
      console.error('Erro ao criar pagamento:', err);
      alert(`Erro ao cobrar: ${err.message}`);
    }
  }

  async function atualizarStatus(e) {
    const id = e.target.dataset.id;
    try {
      const res = await fetch(`/api/payments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'pago' }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      carregarPagamentos();
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      alert('Erro ao atualizar status.');
    }
  }

  btnCobrar.addEventListener('click', criarPagamento);

  // === 5) Inicialização dos módulos ===
  carregarAnotacoes();
  carregarPagamentos();
});
