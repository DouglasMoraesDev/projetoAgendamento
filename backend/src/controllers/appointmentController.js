// src/controllers/appointmentController.js
const prisma = require('../config/prisma');

/**
 * POST /api/appointments
 */
exports.create = async (req, res, next) => {
  try {
    const professionalId = req.user.id;
    const { clientId, dataHora, tipo } = req.body;
    if (!clientId || !dataHora) {
      return res.status(400).json({ message: 'clientId e dataHora são obrigatórios' });
    }
    const appt = await prisma.appointment.create({
      data: {
        clientId:      parseInt(clientId),
        professionalId,
        dataHora:      new Date(dataHora),
        tipo,
        status: 'agendada'
      }
    });
    res.status(201).json({ id: appt.id });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/appointments
 */
exports.list = async (req, res, next) => {
  try {
    const professionalId = req.user.id;
    const list = await prisma.appointment.findMany({
      where: { professionalId },
      include: { client: { select: { nome: true } } },
      orderBy: { dataHora: 'desc' }
    });
    const formatted = list.map(c => ({
      id: c.id,
      dataHora: c.dataHora,
      tipo: c.tipo,
      status: c.status,
      clientNome: c.client.nome
    }));
    res.json(formatted);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/appointments/:id
 */
exports.getOne = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const appt = await prisma.appointment.findUnique({
      where: { id },
      include: { client: { select: { id: true, nome: true } } }
    });
    if (!appt) return res.status(404).json({ message: 'Consulta não encontrada' });
    // Garante que o profissional dono veja apenas suas consultas
    if (appt.professionalId !== req.user.id) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    res.json({
      id: appt.id,
      clientId: appt.clientId,
      dataHora: appt.dataHora,
      tipo: appt.tipo,
      status: appt.status
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/appointments/:id
 * Atualiza todos campos de uma consulta
 */
exports.update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { clientId, dataHora, tipo, status } = req.body;

    // Validações mínimas
    if (!clientId || !dataHora || !tipo || !status) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    // Verifica existência e propriedade
    const existing = await prisma.appointment.findUnique({ where: { id } });
    if (!existing || existing.professionalId !== req.user.id) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    await prisma.appointment.update({
      where: { id },
      data: {
        clientId: parseInt(clientId),
        dataHora: new Date(dataHora),
        tipo,
        status
      }
    });
    res.json({ message: 'Consulta atualizada com sucesso' });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/appointments/:id/status
 */
exports.updateStatus = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    await prisma.appointment.update({
      where: { id },
      data: { status }
    });
    res.json({ message: 'Status atualizado' });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/appointments/:id/reschedule
 */
exports.reschedule = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { dataHora } = req.body;
    await prisma.appointment.update({
      where: { id },
      data: { dataHora: new Date(dataHora) }
    });
    res.json({ message: 'Consulta reagendada' });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/appointments/:id
 */
exports.remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.appointment.findUnique({ where: { id } });
    if (!existing || existing.professionalId !== req.user.id) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    await prisma.appointment.delete({ where: { id } });
    res.json({ message: 'Consulta removida com sucesso' });
  } catch (err) {
    next(err);
  }
};
