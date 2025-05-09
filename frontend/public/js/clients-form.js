// public/js/clients-form.js
import { get, post, put } from './api.js';

// Só permitir se estiver logado
if (!localStorage.getItem('token')) {
  window.location = 'login.html';
}

const form = document.getElementById('clientForm');
const params = new URLSearchParams(location.search);
const clientId = params.get('id');

// Carrega dados se for edição
async function loadClient() {
  if (!clientId) return;
  try {
    const c = await get(`/clients/${clientId}`);
    // popula cada campo; repita para todos
    form.nome.value              = c.nome;
    form.email.value             = c.email;
    form.cpf.value               = c.cpf;
    form.telefone.value          = c.telefone;
    form.endereco.value          = c.endereco || '';
    form.numero.value            = c.numero || '';
    form.bairro.value            = c.bairro || '';
    form.cidade.value            = c.cidade || '';
    form.estado.value            = c.estado || '';
    form.cep.value               = c.cep || '';
    form.dataNasc.value          = c.dataNasc ? c.dataNasc.split('T')[0] : '';
    form.historico.value         = c.historico || '';
    form.alergias.value          = c.alergias || '';
    form.objetivos.value         = c.objetivos || '';
    form.profissao.value         = c.profissao || '';
    form.convenio.value          = c.convenio || '';
    form.numeroCarteirinha.value = c.numeroCarteirinha || '';
    form.valorSessao.value       = c.valorSessao || '';
    form.statusCadastro.value    = c.statusCadastro;
    
    document.getElementById('formTitle').textContent = 'Editar Cliente';
  } catch (err) {
    alert('Erro ao carregar cliente: ' + err.message);
  }
}

// Submissão (cria ou atualiza)
form.addEventListener('submit', async e => {
  e.preventDefault();
  const body = Object.fromEntries(new FormData(form));
  try {
    if (clientId) {
      await put(`/clients/${clientId}`, body);
    } else {
      await post('/clients', body);
    }
    window.location = 'clients.html';
  } catch (err) {
    alert('Erro ao salvar cliente: ' + err.message);
  }
});

loadClient();
