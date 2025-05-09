// public/js/paciente-form.js

if (!localStorage.getItem('token')) {
  window.location = 'login.html';
}
document.getElementById('logoutBtn').onclick = () => {
  localStorage.clear();
  window.location = 'login.html';
};

const form = document.getElementById('pacienteForm');
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

if (id) {
  document.getElementById('formTitle').textContent = 'Editar Paciente';
  (async () => {
    const p = await request(`/pacientes/${id}`);
    // Preenche todos os campos
    form.nome.value       = p.nome;
    form.email.value      = p.email;
    form.cpf.value        = p.cpf;
    form.rg.value         = p.rg || '';
    form.telefone.value   = p.telefone;
    form.endereco.value   = p.endereco || '';
    form.numero.value     = p.numero || '';
    form.complemento.value= p.complemento || '';
    form.bairro.value     = p.bairro || '';
    form.cidade.value     = p.cidade || '';
    form.estado.value     = p.estado || '';
    form.cep.value        = p.cep || '';
    if (p.dataNasc) form.data_nasc.value = p.dataNasc.substring(0,10);
    form.historico.value  = p.historico || '';
    form.alergias.value   = p.alergias || '';
    form.objetivos.value  = p.objetivos || '';
    form.profissao.value  = p.profissao || '';
    form.convenio.value   = p.convenio || '';
    form.numeroCarteirinha.value = p.numeroCarteirinha || '';
    form.valorSessao.value = p.valorSessao || '';
    form.statusCadastro.value = p.statusCadastro;
    form.consentimentoLGPD.checked = p.consentimentoLGPD;
    form.preferenciasNotificacao.value = JSON.stringify(p.preferenciasNotificacao || {});
  })();
}

form.onsubmit = async e => {
  e.preventDefault();

  // Monta o payload
  const payload = {
    nome: form.nome.value.trim(),
    email: form.email.value.trim(),
    cpf: form.cpf.value.trim(),
    rg: form.rg.value.trim(),
    telefone: form.telefone.value.trim(),
    endereco: form.endereco.value.trim(),
    numero: form.numero.value.trim(),
    complemento: form.complemento.value.trim(),
    bairro: form.bairro.value.trim(),
    cidade: form.cidade.value.trim(),
    estado: form.estado.value.trim(),
    cep: form.cep.value.trim(),
    data_nasc: form.data_nasc.value || null,
    historico: form.historico.value.trim(),
    alergias: form.alergias.value.trim(),
    objetivos: form.objetivos.value.trim(),
    profissao: form.profissao.value.trim(),
    convenio: form.convenio.value.trim(),
    numeroCarteirinha: form.numeroCarteirinha.value.trim(),
    valorSessao: form.valorSessao.value ? parseFloat(form.valorSessao.value) : null,
    statusCadastro: form.statusCadastro.value,
    consentimentoLGPD: form.consentimentoLGPD.checked,
    preferenciasNotificacao: form.preferenciasNotificacao.value
  };

  try {
    if (id) {
      await request(`/pacientes/${id}`, 'PUT', payload);
      alert('Paciente atualizado com sucesso');
    } else {
      const res = await request('/pacientes', 'POST', payload);
      alert('Paciente criado com ID ' + res.id);
    }
    window.location = 'pacientes.html';
  } catch (err) {
    alert('Erro ao salvar paciente: ' + err.message);
  }
};
