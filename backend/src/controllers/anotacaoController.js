const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Cria nova anotação vinculada a uma consulta
exports.create = async (req, res) => {
  try {
    const { appointmentId, texto } = req.body;

    if (!appointmentId || !texto) {
      return res.status(400).json({ error: 'appointmentId e texto são obrigatórios.' });
    }

    const anotacao = await prisma.anotacao.create({
      data: {
        appointment: { connect: { id: appointmentId } },
        texto,
      },
    });

    res.status(201).json(anotacao);
  } catch (error) {
    console.error('Erro ao criar anotação:', error);
    res.status(500).json({ error: 'Erro interno ao criar anotação.' });
  }
};

// Lista anotações de uma consulta específica
exports.listByAppointment = async (req, res) => {
  try {
    const appointmentId = parseInt(req.query.appointmentId, 10);
    if (isNaN(appointmentId)) {
      return res.status(400).json({ error: 'appointmentId inválido.' });
    }

    const anotacoes = await prisma.anotacao.findMany({
      where: { appointmentId },
      orderBy: { criadoEm: 'desc' },
    });

    res.json(anotacoes);
  } catch (error) {
    console.error('Erro ao listar anotações:', error);
    res.status(500).json({ error: 'Erro interno ao listar anotações.' });
  }
};
