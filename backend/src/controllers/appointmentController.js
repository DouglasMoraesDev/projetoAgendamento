// src/controllers/appointmentController.js
const prisma = require('../config/prisma');

/**
 * Agendar nova consulta
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
 * Listar consultas do professional
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
 * Atualiza status da consulta
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
 * Reagendar consulta
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
