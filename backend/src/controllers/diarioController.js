// backend/src/controllers/diarioController.js

const prisma = require('../config/prisma');

/**
 * POST /diario
 * Cria uma entrada no diário alimentar.
 */
exports.create = async (req, res) => {
  const { pacienteId, data, refeicao, porcao, calorias, nota } = req.body;
  try {
    const entry = await prisma.diario.create({
      data: {
        pacienteId,
        data: new Date(data),
        refeicao,
        porcao,
        calorias,
        nota
      }
    });
    res.status(201).json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao salvar diário' });
  }
};

/**
 * GET /diario/:pacienteId
 * Lista entradas do diário de um paciente.
 */
exports.listByPaciente = async (req, res) => {
  const pacienteId = parseInt(req.params.pacienteId);
  try {
    const entries = await prisma.diario.findMany({
      where: { pacienteId },
      orderBy: { data: 'desc' }
    });
    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar diário' });
  }
};
