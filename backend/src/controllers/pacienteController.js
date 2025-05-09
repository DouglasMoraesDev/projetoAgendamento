// backend/src/controllers/pacienteController.js

const prisma = require('../config/prisma');

/**
 * POST /pacientes
 * Cria um paciente associado ao nutricionista logado.
 */
exports.create = async (req, res) => {
  const nutriId = req.user.id;
  // Extrai data_nasc do body e converte para dataNasc (camelCase)
  const { data_nasc, ...rest } = req.body;
  const data = {
    nutricionistaId: nutriId,
    ...rest,
    dataNasc: data_nasc ? new Date(data_nasc) : null
  };

  const p = await prisma.paciente.create({ data });
  res.status(201).json({ id: p.id });
};

/**
 * GET /pacientes
 * Lista todos os pacientes do nutricionista.
 */
exports.list = async (req, res) => {
  const nutriId = req.user.id;
  const list = await prisma.paciente.findMany({
    where: { nutricionistaId: nutriId },
    orderBy: { nome: 'asc' }
  });
  res.json(list);
};

/**
 * GET /pacientes/:id
 * Detalha um paciente.
 */
exports.getOne = async (req, res) => {
  const id = parseInt(req.params.id);
  const p = await prisma.paciente.findUnique({ where: { id } });
  if (!p) return res.status(404).json({ message: 'Não encontrado' });
  res.json(p);
};

/**
 * PUT /pacientes/:id
 * Atualiza dados do paciente.
 */
exports.update = async (req, res) => {
  const id = parseInt(req.params.id);
  // Mesma conversão de data_nasc → dataNasc
  const { data_nasc, ...rest } = req.body;
  const data = {
    ...rest,
    dataNasc: data_nasc ? new Date(data_nasc) : null
  };

  await prisma.paciente.update({
    where: { id },
    data
  });
  res.json({ message: 'Atualizado com sucesso' });
};

/**
 * DELETE /pacientes/:id
 * Remove um paciente.
 */
exports.remove = async (req, res) => {
  const id = parseInt(req.params.id);
  await prisma.paciente.delete({ where: { id } });
  res.json({ message: 'Removido com sucesso' });
};
