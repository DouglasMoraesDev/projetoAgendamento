// backend/src/controllers/authController.js

const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');
const { sign } = require('../utils/jwt');

/**
 * POST /auth/register
 * Corpo: { nome, email, senha }
 */
exports.register = async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha)
    return res.status(400).json({ message: 'Dados faltando' });

  // Verifica se já existe
  const exists = await prisma.nutricionista.findUnique({ where: { email } });
  if (exists)
    return res.status(400).json({ message: 'Email já cadastrado' });

  // Cria hash da senha
  const senhaHash = await bcrypt.hash(senha, 10);
  // Persiste no banco
  const user = await prisma.nutricionista.create({
    data: { nome, email, senhaHash }
  });

  res.status(201).json({ id: user.id, nome: user.nome, email: user.email });
};

/**
 * POST /auth/login
 * Corpo: { email, senha }
 */
exports.login = async (req, res) => {
  const { email, senha } = req.body;
  const user = await prisma.nutricionista.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ message: 'Usuário não encontrado' });

  // Valida senha
  const valid = await bcrypt.compare(senha, user.senhaHash);
  if (!valid) return res.status(400).json({ message: 'Senha inválida' });

  // Gera token
  const token = sign({ id: user.id, email: user.email });
  res.json({ token });
};
