// src/controllers/documentController.js
const prisma = require('../config/prisma');

/**
 * POST /api/appointments/:appointmentId/documents
 */
exports.upload = async (req, res, next) => {
  try {
    const appointmentId = parseInt(req.params.appointmentId);
    if (isNaN(appointmentId)) {
      return res.status(400).json({ message: 'appointmentId inválido' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Arquivo não enviado' });
    }

    const urlArquivo = `/uploads/${req.file.filename}`;

    const doc = await prisma.documento.create({
      data: {
        appointmentId,
        tipo: req.file.mimetype,
        urlArquivo
      }
    });

    res.status(201).json({ id: doc.id, urlArquivo });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/appointments/:appointmentId/documents
 */
exports.list = async (req, res, next) => {
  try {
    const appointmentId = parseInt(req.params.appointmentId);
    if (isNaN(appointmentId)) {
      return res.status(400).json({ message: 'appointmentId inválido' });
    }
    const docs = await prisma.documento.findMany({
      where: { appointmentId },
      orderBy: { criadoEm: 'desc' }
    });
    res.json(docs);
  } catch (err) {
    next(err);
  }
};
