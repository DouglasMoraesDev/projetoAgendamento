const bcrypt = require('bcrypt');
const { sign } = require('../utils/jwt');
const prisma = require('../config/prisma');

exports.register = async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha)
    return res.status(400).json({ message: 'Dados faltando' });

  const exists = await prisma.nutricionista.findUnique({ where: { email } });
  if (exists) return res.status(400).json({ message: 'Email já cadastrado' });

  const senhaHash = await bcrypt.hash(senha, 10);
  const user = await prisma.nutricionista.create({
    data: { nome, email, senhaHash }
  });

  res.status(201).json({ id: user.id, nome: user.nome, email: user.email });
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;
  const user = await prisma.nutricionista.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ message: 'Usuário não encontrado' });

  const valid = await bcrypt.compare(senha, user.senhaHash);
  if (!valid) return res.status(400).json({ message: 'Senha inválida' });

  const token = sign({ id: user.id, email: user.email });
  res.json({ token });
};
