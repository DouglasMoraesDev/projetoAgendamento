// backend/src/controllers/appointmentController.js

const prisma = require('../config/prisma');

/**
 * POST /api/appointments
 */
exports.create = async (req, res) => {
  const professionalId = req.user.id;
  const { clientId, dataHora, tipo } = req.body;
  const appt = await prisma.appointment.create({
    data: {
      clientId,
      professionalId,
      dataHora: new Date(dataHora),
      tipo,
      status: 'agendada'
    }
  });
  res.status(201).json({ id: appt.id });
};

/**
 * GET /api/appointments
 */
exports.list = async (req, res) => {
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
};

/**
 * PATCH /api/appointments/:id/status
 */
exports.updateStatus = async (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  await prisma.appointment.update({
    where: { id },
    data: { status }
  });
  res.json({ message: 'Status atualizado' });
};

/**
 * PATCH /api/appointments/:id/reschedule
 */
exports.reschedule = async (req, res) => {
  const id = parseInt(req.params.id);
  const { dataHora } = req.body;
  await prisma.appointment.update({
    where: { id },
    data: { dataHora: new Date(dataHora) }
  });
  res.json({ message: 'Consulta reagendada' });
};
