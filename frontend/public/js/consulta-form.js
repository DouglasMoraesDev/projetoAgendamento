document.addEventListener('DOMContentLoaded', () => {
  // Recupera appointmentId de ?id=123
  const params = new URLSearchParams(window.location.search);
  const appointmentId = parseInt(params.get('id'), 10);

  // --- Função para popular os datalists ---
  const clientesMap       = {};
  const profissionaisMap  = {};

  async function carregarListas() {
    // Carrega Clientes
    const resC = await fetch('/api/clients');
    const clients = await resC.json();
    const dlC = document.getElementById('clientes-datalist');
    clients.forEach(c => {
      const val = `${c.nome} | ${c.id}`;
      const opt = document.createElement('option');
      opt.value = val;
      dlC.appendChild(opt);
      clientesMap[val] = c.id;
    });

    // Carrega Profissionais
    const resP = await fetch('/api/profile'); // ou /api/professionals conforme sua rota
    const pros = await resP.json();
    const dlP = document.getElementById('profissionais-datalist');
    pros.forEach(p => {
      const val = `${p.nome} | ${p.id}`;
      const opt = document.createElement('option');
      opt.value = val;
      dlP.appendChild(opt);
      profissionaisMap[val] = p.id;
    });
  }

  // Chama antes de tudo
  carregarListas();

  // --- Configuração das Abas ---
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab, .tab-content')
        .forEach(el => el.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.target).classList.add('active');
    });
  });

  // --- 1) DADOS da Consulta ---
  const formConsulta = document.getElementById('form-consulta');
  if (appointmentId) {
    // Preenche para edição
    fetch(`/api/appointments/${appointmentId}`)
      .then(r => r.json())
      .then(a => {
        document.getElementById('data-hora').value = a.dataHora.slice(0,16);
        document.getElementById('tipo').value      = a.tipo;
        // converte ID em string do datalist
        // procura chave cujo value === a.clientId
        const clienteEntry = Object.entries(clientesMap)
          .find(([key, id]) => id === a.clientId);
        if (clienteEntry) {
          document.getElementById('cliente').value = clienteEntry[0];
        }
        const profEntry = Object.entries(profissionaisMap)
          .find(([key, id]) => id === a.professionalId);
        if (profEntry) {
          document.getElementById('profissional').value = profEntry[0];
        }
      });
  }

  formConsulta.addEventListener('submit', e => {
    e.preventDefault();

    // Converte texto selecionado em ID
    const textoC = document.getElementById('cliente').value;
    const textoP = document.getElementById('profissional').value;
    const clientId       = clientesMap[textoC];
    const professionalId = profissionaisMap[textoP];
    if (!clientId || !professionalId) {
      return alert('Selecione cliente e profissional válidos na lista.');
    }

    const body = {
      dataHora:       document.getElementById('data-hora').value,
      tipo:           document.getElementById('tipo').value,
      clientId,
      professionalId
    };
    const method = appointmentId ? 'PATCH' : 'POST';
    const url    = appointmentId
      ? `/api/appointments/${appointmentId}`
      : '/api/appointments';

    fetch(url, {
      method,
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(body)
    })
    .then(r => {
      if (!r.ok) throw new Error('Falha ao salvar');
      return r.json();
    })
    .then(() => alert('Consulta salva com sucesso.'))
    .catch(err => {
      console.error(err);
      alert('Erro ao salvar consulta.');
    });
  });

  // === 2) DOCUMENTOS ===
  const formDoc     = document.getElementById('form-documento');
  const listaDocsEl = document.getElementById('lista-documentos');
  function carregarDocumentos() {
    fetch(`/api/appointments/${appointmentId}/documents`)
      .then(r => r.json())
      .then(docs => {
        listaDocsEl.innerHTML = '';
        docs.forEach(doc => {
          const li = document.createElement('li');
          li.innerHTML = `
            <a href="${doc.urlArquivo}" target="_blank">${doc.tipo || 'Arquivo'}</a>
            <button data-id="${doc.id}" class="btn-del-doc">Excluir</button>
          `;
          listaDocsEl.appendChild(li);
        });
        document.querySelectorAll('.btn-del-doc')
          .forEach(b => b.addEventListener('click', e => {
            const id = e.target.dataset.id;
            fetch(`/api/appointments/${appointmentId}/documents/${id}`, { method: 'DELETE' })
              .then(() => carregarDocumentos());
          }));
      });
  }
  formDoc.addEventListener('submit', e => {
    e.preventDefault();
    const fileInput = document.getElementById('doc-file');
    const fd = new FormData();
    fd.append('file', fileInput.files[0]);
    fetch(`/api/appointments/${appointmentId}/documents`, {
      method: 'POST',
      body: fd
    }).then(() => {
      fileInput.value = '';
      carregarDocumentos();
    });
  });

  // === 3) ANOTAÇÕES ===
  const listaAnotEl = document.getElementById('lista-anotacoes');
  const txtNota     = document.getElementById('nota-texto');
  document.getElementById('btn-salvar-nota')
    .addEventListener('click', () => {
      const texto = txtNota.value.trim();
      if (!texto) return alert('Escreva algo.');
      fetch('/api/anotacoes', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ appointmentId, texto })
      })
      .then(() => {
        txtNota.value = '';
        carregarAnotacoes();
      });
    });
  function carregarAnotacoes() {
    fetch(`/api/anotacoes?appointmentId=${appointmentId}`)
      .then(r => r.json())
      .then(anots => {
        listaAnotEl.innerHTML = '';
        anots.forEach(n => {
          const li = document.createElement('li');
          li.textContent = `[${new Date(n.criadoEm).toLocaleString()}] ${n.texto}`;
          listaAnotEl.appendChild(li);
        });
      });
  }

  // === 4) PAGAMENTOS ===
  const listaPagEl  = document.getElementById('lista-pagamentos');
  document.getElementById('btn-cobrar')
    .addEventListener('click', () => {
      const valor  = parseFloat(document.getElementById('pag-valor').value);
      const metodo = document.getElementById('pag-metodo').value;
      if (!valor) return alert('Valor inválido.');
      fetch('/api/payments', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ appointmentId, valor, metodo })
      })
      .then(() => carregarPagamentos());
    });
  function carregarPagamentos() {
    fetch(`/api/payments?appointmentId=${appointmentId}`)
      .then(r => r.json())
      .then(pags => {
        listaPagEl.innerHTML = '';
        pags.forEach(p => {
          const li = document.createElement('li');
          li.innerHTML = `
            [${new Date(p.criadoEm).toLocaleString()}] R$ ${p.valor.toFixed(2)} — ${p.metodo}
            <strong>${p.status}</strong>
            ${p.status==='pendente'
              ? `<button data-id="${p.id}" class="btn-mark-paid">Marcar Pago</button>`
              : ''}
          `;
          listaPagEl.appendChild(li);
        });
        document.querySelectorAll('.btn-mark-paid')
          .forEach(b => b.addEventListener('click', e => {
            const id = e.target.dataset.id;
            fetch(`/api/payments/${id}/status`, {
              method: 'PATCH',
              headers:{'Content-Type':'application/json'},
              body: JSON.stringify({ status:'pago' })
            }).then(() => carregarPagamentos());
          }));
      });
  }

  // === Inicializa tudo, se editando ===
  if (appointmentId) {
    carregarDocumentos();
    carregarAnotacoes();
    carregarPagamentos();
  }
});
