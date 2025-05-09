// src/controllers/clientController.js
const prisma = require('../config/prisma');

/**
 * Cria um novo Client associado ao professional (req.user.id)
 */
exports.create = async (req, res, next) => {
  try {
    const professionalId = req.user.id;
    // Desestrutura do body apenas campos existentes em schema.prisma
    const {
      nome, email, cpf, telefone,
      endereco, numero, complemento, bairro, cidade, estado, cep,
      dataNasc, historico, alergias, objetivos,
      profissao, convenio, numeroCarteirinha, valorSessao,
      statusCadastro
    } = req.body;

    // validações básicas
    if (!nome || !email || !cpf || !telefone) {
      return res.status(400).json({ message: 'Campos obrigatórios faltando' });
    }

    const data = {
      professionalId,
      nome,
      email,
      cpf,
      telefone,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      cep,
      dataNasc: dataNasc ? new Date(dataNasc) : undefined,
      historico,
      alergias,
      objetivos,
      profissao,
      convenio,
      numeroCarteirinha,
      valorSessao: valorSessao ? parseFloat(valorSessao) : undefined,
      statusCadastro
    };

    const client = await prisma.client.create({ data });
    res.status(201).json({ id: client.id });
  } catch (err) {
    // verificação de erro de unicidade de CPF
    if (err.code === 'P2002' && err.meta.target.includes('cpf')) {
      return res.status(400).json({ message: 'CPF já cadastrado' });
    }
    next(err);
  }
};

/**
 * Lista todos os clients do professional logado
 */
exports.list = async (req, res, next) => {
  try {
    const professionalId = req.user.id;
    const list = await prisma.client.findMany({
      where: { professionalId },
      orderBy: { nome: 'asc' }
    });
    res.json(list);
  } catch (err) {
    next(err);
  }
};

/**
 * Retorna um client pelo ID
 */
exports.getOne = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const client = await prisma.client.findUnique({ where: { id } });
    if (!client) return res.status(404).json({ message: 'Cliente não encontrado' });
    res.json(client);
  } catch (err) {
    next(err);
  }
};

/**
 * Atualiza um client
 */
exports.update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    // certifica-se que o client pertence ao professional
    const existing = await prisma.client.findUnique({ where: { id } });
    if (!existing || existing.professionalId !== req.user.id) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const {
      nome, email, cpf, telefone,
      endereco, numero, complemento, bairro, cidade, estado, cep,
      dataNasc, historico, alergias, objetivos,
      profissao, convenio, numeroCarteirinha, valorSessao,
      statusCadastro
    } = req.body;

    const data = {
      nome,
      email,
      cpf,
      telefone,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      cep,
      dataNasc: dataNasc ? new Date(dataNasc) : undefined,
      historico,
      alergias,
      objetivos,
      profissao,
      convenio,
      numeroCarteirinha,
      valorSessao: valorSessao ? parseFloat(valorSessao) : undefined,
      statusCadastro
    };

    await prisma.client.update({ where: { id }, data });
    res.json({ message: 'Atualizado com sucesso' });
  } catch (err) {
    if (err.code === 'P2002' && err.meta.target.includes('cpf')) {
      return res.status(400).json({ message: 'CPF já cadastrado' });
    }
    next(err);
  }
};

/**
 * Remove um client
 */
exports.remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    // garante owner
    const existing = await prisma.client.findUnique({ where: { id } });
    if (!existing || existing.professionalId !== req.user.id) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    await prisma.client.delete({ where: { id } });
    res.json({ message: 'Removido com sucesso' });
  } catch (err) {
    next(err);
  }
};
