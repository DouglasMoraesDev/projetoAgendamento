// frontend/public/js/paciente-form.js

// Verifica autenticação
if (!localStorage.getItem('token')) {
    alert('Faça login primeiro.');
    window.location = 'login.html';
  }
  
  // Logout
  document.getElementById('logoutBtn').onclick = () => {
    localStorage.clear();
    window.location = 'login.html';
  };
  
  const form = document.getElementById('pacienteForm');
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  
  // Se for edição, carrega dados existentes
  if (id) {
    document.getElementById('formTitle').textContent = 'Editar Paciente';
    (async () => {
      try {
        const p = await request(`/pacientes/${id}`);
        form.nome.value       = p.nome;
        form.email.value      = p.email;
        if (p.dataNasc) {
          // dataNasc vem como ISO string
          form.data_nasc.value = p.dataNasc.substring(0, 10);
        }
        form.historico.value  = p.historico || '';
        form.alergias.value   = p.alergias || '';
        form.objetivos.value  = p.objetivos || '';
      } catch (err) {
        alert('Erro ao carregar paciente: ' + err.message);
      }
    })();
  }
  
  // Submissão do formulário
  form.onsubmit = async e => {
    e.preventDefault();
  
    // Monta payload usando snake_case para data_nasc
    const payload = {
      nome: form.nome.value.trim(),
      email: form.email.value.trim(),
      data_nasc: form.data_nasc.value || null,
      historico: form.historico.value.trim(),
      alergias: form.alergias.value.trim(),
      objetivos: form.objetivos.value.trim()
    };
  
    try {
      if (id) {
        // Atualização
        await request(`/pacientes/${id}`, 'PUT', payload);
        alert('Paciente atualizado com sucesso!');
      } else {
        // Criação
        const res = await request('/pacientes', 'POST', payload);
        alert(`Paciente criado com ID ${res.id}`);
      }
      window.location = 'pacientes.html';
    } catch (err) {
      alert('Erro ao salvar paciente: ' + err.message);
    }
  };
  