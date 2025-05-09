// backend/src/controllers/diarioController.js

/**
 * Controlador de Diário Alimentar
 * Cria e lista entradas de diário para um client
 */

const prisma = require('../config/prisma');

/**
 * POST /api/diary
 * Cria uma entrada no diário alimentar.
 * Body: { clientId, data, refeicao, porcao, calorias, macros?, nota }
 */
exports.create = async (req, res) => {
  const { clientId, data, refeicao, porcao, calorias, macros, nota } = req.body;

  // Validação mínima
  if (!clientId || !data) {
    return res.status(400).json({ message: 'clientId e data são obrigatórios' });
  }

  try {
    const entry = await prisma.diario.create({
      data: {
        clientId,               // associação ao modelo Client
        data: new Date(data),   // converte string para Date
        refeicao,
        porcao,
        calorias: calorias ? parseInt(calorias) : undefined,
        macros: macros ? JSON.parse(macros) : undefined,
        nota
      }
    });
    res.status(201).json(entry);
  } catch (err) {
    console.error('Erro ao salvar diário:', err);
    res.status(500).json({ message: 'Erro ao salvar diário' });
  }
};

/**
 * GET /api/diary/:clientId
 * Lista entradas do diário de um client.
 */
exports.listByClient = async (req, res) => {
  const clientId = parseInt(req.params.clientId);
  if (isNaN(clientId)) {
    return res.status(400).json({ message: 'clientId inválido' });
  }

  try {
    const entries = await prisma.diario.findMany({
      where: { clientId },
      orderBy: { data: 'desc' }
    });
    res.json(entries);
  } catch (err) {
    console.error('Erro ao listar diário:', err);
    res.status(500).json({ message: 'Erro ao listar diário' });
  }
};
