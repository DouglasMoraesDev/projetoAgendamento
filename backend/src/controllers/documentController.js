// backend/src/controllers/documentController.js

/**
 * Controlador de upload e listagem de documentos de uma Appointment
 */

const prisma = require('../config/prisma');
const path   = require('path');

/**
 * POST /api/appointments/:appointmentId/documents
 * Recebe campo 'file' via multipart/form-data.
 * Requer middleware multer configurado em routes.
 */
exports.upload = async (req, res) => {
  const appointmentId = parseInt(req.params.appointmentId);
  if (isNaN(appointmentId)) {
    return res.status(400).json({ message: 'appointmentId inválido' });
  }
  if (!req.file) {
    return res.status(400).json({ message: 'Arquivo não enviado' });
  }

  // Monta a URL para servir o arquivo
  const urlArquivo = `/uploads/${req.file.filename}`;

  // Persiste o registro de Documento
  const doc = await prisma.documento.create({
    data: {
      appointmentId,           // associação ao modelo Appointment
      tipo: req.file.mimetype, // tipo MIME do arquivo
      urlArquivo
    }
  });

  res.status(201).json({ id: doc.id, urlArquivo });
};

/**
 * GET /api/appointments/:appointmentId/documents
 * Lista documentos de uma appointment.
 */
exports.list = async (req, res) => {
  const appointmentId = parseInt(req.params.appointmentId);
  if (isNaN(appointmentId)) {
    return res.status(400).json({ message: 'appointmentId inválido' });
  }

  try {
    const docs = await prisma.documento.findMany({
      where: { appointmentId },
      orderBy: { criadoEm: 'desc' }
    });
    res.json(docs);
  } catch (err) {
    console.error('Erro ao listar documentos:', err);
    res.status(500).json({ message: 'Erro ao listar documentos' });
  }
};
