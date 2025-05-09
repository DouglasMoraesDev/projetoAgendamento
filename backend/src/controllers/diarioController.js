// src/controllers/diarioController.js
const prisma = require('../config/prisma');

/**
 * POST /api/diary
 */
exports.create = async (req, res, next) => {
  try {
    const {
      clientId, data, refeicao, porcao, calorias, macros, nota
    } = req.body;

    if (!clientId || !data) {
      return res.status(400).json({ message: 'clientId e data são obrigatórios' });
    }

    const entry = await prisma.diario.create({
      data: {
        clientId: parseInt(clientId),
        data: new Date(data),
        refeicao,
        porcao,
        calorias: calorias ? parseInt(calorias) : undefined,
        macros: macros ? JSON.parse(macros) : undefined,
        nota
      }
    });
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/diary/:clientId
 */
exports.listByClient = async (req, res, next) => {
  try {
    const clientId = parseInt(req.params.clientId);
    if (isNaN(clientId)) {
      return res.status(400).json({ message: 'clientId inválido' });
    }

    const entries = await prisma.diario.findMany({
      where: { clientId },
      orderBy: { data: 'desc' }
    });
    res.json(entries);
  } catch (err) {
    next(err);
  }
};
