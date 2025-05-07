const prisma = require('../config/prisma');

exports.create = async (req, res) => {
  const nutriId = req.user.id;
  const data = { nutricionistaId: nutriId, ...req.body };
  const paciente = await prisma.paciente.create({ data });
  res.status(201).json({ id: paciente.id });
};

exports.list = async (req, res) => {
  const nutriId = req.user.id;
  const list = await prisma.paciente.findMany({
    where: { nutricionistaId: nutriId },
    orderBy: { nome: 'asc' }
  });
  res.json(list);
};

exports.getOne = async (req, res) => {
  const id = parseInt(req.params.id);
  const paciente = await prisma.paciente.findUnique({ where: { id } });
  if (!paciente) return res.status(404).json({ message: 'Não encontrado' });
  res.json(paciente);
};

exports.update = async (req, res) => {
  const id = parseInt(req.params.id);
  await prisma.paciente.update({
    where: { id },
    data: req.body
  });
  res.json({ message: 'Atualizado com sucesso' });
};

exports.remove = async (req, res) => {
  const id = parseInt(req.params.id);
  await prisma.paciente.delete({ where: { id } });
  res.json({ message: 'Removido com sucesso' });
};
