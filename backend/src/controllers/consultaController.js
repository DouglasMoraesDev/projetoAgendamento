// backend/src/controllers/consultaController.js

const prisma = require('../config/prisma');

/**
 * POST /consultas
 * Agendar nova consulta.
 */
exports.create = async (req, res) => {
  const nutriId = req.user.id;
  const { pacienteId, dataHora, tipo } = req.body;
  const c = await prisma.consulta.create({
    data: {
      pacienteId,
      nutricionistaId: nutriId,
      dataHora: new Date(dataHora),
      tipo,
      status: 'agendada'
    }
  });
  res.status(201).json({ id: c.id });
};

/**
 * GET /consultas
 * Listar consultas do nutricionista.
 */
exports.list = async (req, res) => {
  const nutriId = req.user.id;
  const list = await prisma.consulta.findMany({
    where: { nutricionistaId: nutriId },
    include: { paciente: { select: { nome: true } } },
    orderBy: { dataHora: 'desc' }
  });
  // Formata para o frontend
  const formatted = list.map(c => ({
    id: c.id,
    dataHora: c.dataHora,
    tipo: c.tipo,
    status: c.status,
    paciente_nome: c.paciente.nome
  }));
  res.json(formatted);
};

/**
 * PATCH /consultas/:id/status
 * Atualiza status da consulta.
 */
exports.updateStatus = async (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  await prisma.consulta.update({
    where: { id },
    data: { status }
  });
  res.json({ message: 'Status atualizado' });
};
