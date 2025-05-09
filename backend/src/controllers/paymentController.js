const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Cria um pagamento vinculado a uma consulta
exports.create = async (req, res) => {
  try {
    const { appointmentId, valor, metodo } = req.body;
    if (!appointmentId || valor == null) {
      return res.status(400).json({ error: 'appointmentId e valor são obrigatórios.' });
    }

    const pagamento = await prisma.pagamento.create({
      data: {
        appointment: { connect: { id: appointmentId } },
        valor,
        metodo,
      },
    });

    res.status(201).json(pagamento);
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    res.status(500).json({ error: 'Erro interno ao criar pagamento.' });
  }
};

// Lista pagamentos de uma consulta específica
exports.listByAppointment = async (req, res) => {
  try {
    const appointmentId = parseInt(req.query.appointmentId, 10);
    if (isNaN(appointmentId)) {
      return res.status(400).json({ error: 'appointmentId inválido.' });
    }

    const pagamentos = await prisma.pagamento.findMany({
      where: { appointmentId },
      orderBy: { criadoEm: 'desc' },
    });

    res.json(pagamentos);
  } catch (error) {
    console.error('Erro ao listar pagamentos:', error);
    res.status(500).json({ error: 'Erro interno ao listar pagamentos.' });
  }
};

// Atualiza apenas o status de um pagamento
exports.updateStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;
    if (isNaN(id) || !status) {
      return res.status(400).json({ error: 'ID ou status inválido.' });
    }

    const pagamento = await prisma.pagamento.update({
      where: { id },
      data: { status },
    });

    res.json(pagamento);
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ error: 'Erro interno ao atualizar status.' });
  }
};

