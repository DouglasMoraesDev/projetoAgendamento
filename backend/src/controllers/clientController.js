const prisma = require('../config/prisma');

exports.create = async (req, res) => {
  const professionalId = req.user.id;
  const {
    nome, email, cpf, rg, telefone,
    endereco, numero, complemento, bairro, cidade, estado, cep,
    data_nasc, historico, alergias, objetivos,
    profissao, convenio, numeroCarteirinha, valorSessao,
    statusCadastro, consentimentoLGPD, preferenciasNotificacao
  } = req.body;

  const data = {
    professionalId,
    nome,
    email,
    cpf,
    rg,
    telefone,
    endereco,
    numero,
    complemento,
    bairro,
    cidade,
    estado,
    cep,
    dataNasc: data_nasc ? new Date(data_nasc) : undefined,
    historico,
    alergias,
    objetivos,
    profissao,
    convenio,
    numeroCarteirinha,
    valorSessao: valorSessao ? parseFloat(valorSessao) : undefined,
    statusCadastro,
    consentimentoLGPD: consentimentoLGPD === 'true',
    preferenciasNotificacao: preferenciasNotificacao ? JSON.parse(preferenciasNotificacao) : undefined
  };

  const client = await prisma.client.create({ data });
  res.status(201).json({ id: client.id });
};

exports.list = async (req, res) => {
  const professionalId = req.user.id;
  const list = await prisma.client.findMany({
    where: { professionalId },
    orderBy: { nome: 'asc' }
  });
  res.json(list);
};

exports.getOne = async (req, res) => {
  const id = parseInt(req.params.id);
  const c = await prisma.client.findUnique({ where: { id } });
  if (!c) return res.status(404).json({ message: 'Não encontrado' });
  res.json(c);
};

exports.update = async (req, res) => {
  const id = parseInt(req.params.id);
  const {
    nome, email, cpf, rg, telefone,
    endereco, numero, complemento, bairro, cidade, estado, cep,
    data_nasc, historico, alergias, objetivos,
    profissao, convenio, numeroCarteirinha, valorSessao,
    statusCadastro, consentimentoLGPD, preferenciasNotificacao
  } = req.body;

  const data = {
    nome,
    email,
    cpf,
    rg,
    telefone,
    endereco,
    numero,
    complemento,
    bairro,
    cidade,
    estado,
    cep,
    dataNasc: data_nasc ? new Date(data_nasc) : undefined,
    historico,
    alergias,
    objetivos,
    profissao,
    convenio,
    numeroCarteirinha,
    valorSessao: valorSessao ? parseFloat(valorSessao) : undefined,
    statusCadastro,
    consentimentoLGPD: consentimentoLGPD === 'true',
    preferenciasNotificacao: preferenciasNotificacao ? JSON.parse(preferenciasNotificacao) : undefined
  };

  await prisma.client.update({ where: { id }, data });
  res.json({ message: 'Atualizado com sucesso' });
};

exports.remove = async (req, res) => {
  const id = parseInt(req.params.id);
  await prisma.client.delete({ where: { id } });
  res.json({ message: 'Removido com sucesso' });
};
