// backend/src/controllers/pacienteController.js

const prisma = require('../config/prisma');

exports.create = async (req, res) => {
  const nutriId = req.user.id;
  // Extrai todos os campos do body
  const {
    nome, email, cpf, rg, telefone,
    endereco, numero, complemento, bairro, cidade, estado, cep,
    data_nasc, historico, alergias, objetivos,
    profissao, convenio, numeroCarteirinha, valorSessao,
    statusCadastro, consentimentoLGPD, preferenciasNotificacao
  } = req.body;

  // Monta o objeto data para o Prisma
  const data = {
    nutricionistaId: nutriId,
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
    consentimentoLGPD: consentimentoLGPD === 'true' || consentimentoLGPD === true,
    preferenciasNotificacao: preferenciasNotificacao ? JSON.parse(preferenciasNotificacao) : undefined
  };

  const p = await prisma.paciente.create({ data });
  res.status(201).json({ id: p.id });
};

exports.list = async (req, res) => {
  const nutriId = req.user.id;
  const list = await prisma.paciente.findMany({
    where: { nutricionistaId: nutriId },
    orderBy: { nome: 'asc' }
  });
  res.json(list);
};

exports.getOne = async (req, res) => {
  const id = parseInt(req.params.id);
  const p = await prisma.paciente.findUnique({ where: { id } });
  if (!p) return res.status(404).json({ message: 'Não encontrado' });
  res.json(p);
};

exports.update = async (req, res) => {
  const id = parseInt(req.params.id);
  // Reaproveitamos a extração de campos como no create
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
    consentimentoLGPD: consentimentoLGPD === 'true' || consentimentoLGPD === true,
    preferenciasNotificacao: preferenciasNotificacao ? JSON.parse(preferenciasNotificacao) : undefined
  };

  await prisma.paciente.update({ where: { id }, data });
  res.json({ message: 'Atualizado com sucesso' });
};

exports.remove = async (req, res) => {
  const id = parseInt(req.params.id);
  await prisma.paciente.delete({ where: { id } });
  res.json({ message: 'Removido com sucesso' });
};
