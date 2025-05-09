// backend/src/controllers/documentController.js

const prisma = require('../config/prisma');
const path   = require('path');

/**
 * POST /consultas/:consultaId/documentos
 * Recebe campo 'file' via multipart/form-data
 */
exports.upload = async (req, res) => {
  const consultaId = parseInt(req.params.consultaId);
  if (!req.file) return res.status(400).json({ message: 'Arquivo não enviado' });

  const urlArquivo = `/uploads/${req.file.filename}`;
  const doc = await prisma.documento.create({
    data: {
      consultaId,
      tipo: req.file.mimetype,
      urlArquivo
    }
  });
  res.status(201).json({ id: doc.id, urlArquivo });
};

/**
 * GET /consultas/:consultaId/documentos
 * Lista documentos de uma consulta
 */
exports.list = async (req, res) => {
  const consultaId = parseInt(req.params.consultaId);
  const docs = await prisma.documento.findMany({
    where: { consultaId },
    orderBy: { criadoEm: 'desc' }
  });
  res.json(docs);
};
