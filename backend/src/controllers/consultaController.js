const prisma = require('../config/prisma');

exports.create = async (req, res) => {
  const nutriId = req.user.id;
  const { pacienteId, dataHora, tipo } = req.body;
  const consulta = await prisma.consulta.create({
    data: {
      pacienteId,
      nutricionistaId: nutriId,
      dataHora: new Date(dataHora),
      tipo,             // 'presencial' ou 'online'
      status: 'agendada'
    }
  });
  res.status(201).json({ id: consulta.id });
};

exports.list = async (req, res) => {
  const nutriId = req.user.id;
  const list = await prisma.consulta.findMany({
    where: { nutricionistaId: nutriId },
    include: { paciente: { select: { nome: true } } },
    orderBy: { dataHora: 'desc' }
  });
  // map para manter consistência de frontend
  const formatted = list.map(c => ({
    id: c.id,
    dataHora: c.dataHora,
    tipo: c.tipo,
    status: c.status,
    paciente_nome: c.paciente.nome
  }));
  res.json(formatted);
};

exports.updateStatus = async (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  await prisma.consulta.update({
    where: { id },
    data: { status }
  });
  res.json({ message: 'Status atualizado' });
};
