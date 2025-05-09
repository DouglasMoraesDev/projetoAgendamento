// backend/src/controllers/authController.js

/**
 * Controlador de autenticação: registro e login de profissionais
 */

const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');
const { sign } = require('../utils/jwt');  // função para gerar JWT

/**
 * POST /api/auth/register
 * Registra um novo Professional.
 * Body: { nome, email, senha }
 */
exports.register = async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) {
    return res.status(400).json({ message: 'Dados faltando' });
  }

  // Verifica se já existe um profissional com esse email
  const exists = await prisma.professional.findUnique({ where: { email } });
  if (exists) {
    return res.status(400).json({ message: 'Email já cadastrado' });
  }

  // Gera hash da senha
  const senhaHash = await bcrypt.hash(senha, 10);

  // Cria o registro no banco
  const user = await prisma.professional.create({
    data: { nome, email, senhaHash, tipo: 'nutricionista' } // tipo padrão
  });

  // Gera e devolve o token JWT
  const token = sign({ id: user.id, email: user.email });
  res.status(201).json({ token });
};

/**
 * POST /api/auth/login
 * Autentica um Professional existente.
 * Body: { email, senha }
 */
exports.login = async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios' });
  }

  // Busca o profissional pelo email
  const user = await prisma.professional.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  // Compara a senha informada com o hash armazenado
  const valid = await bcrypt.compare(senha, user.senhaHash);
  if (!valid) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  // Gera e devolve o token JWT
  const token = sign({ id: user.id, email: user.email });
  res.json({ token });
};
