// backend/src/controllers/profileController.js

const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');

/**
 * GET  /profile
 */
exports.getProfile = async (req, res) => {
  const { id } = req.user;
  const user = await prisma.nutricionista.findUnique({
    where: { id },
    select: {
      nome: true,
      email: true,
      fotoUrl: true,
      especialidade: true,
      timezone: true,
      notificacoes: true
    }
  });
  res.json(user);
};

/**
 * PUT /profile
 * Body: { nome, email, fotoUrl, especialidade, timezone, notificacoes }
 */
exports.updateProfile = async (req, res) => {
  const { id } = req.user;
  const data = {
    nome: req.body.nome,
    email: req.body.email,
    fotoUrl: req.body.fotoUrl,
    especialidade: req.body.especialidade,
    timezone: req.body.timezone,
    notificacoes: req.body.notificacoes
  };
  const updated = await prisma.nutricionista.update({
    where: { id },
    data
  });
  res.json({
    nome: updated.nome,
    email: updated.email,
    fotoUrl: updated.fotoUrl,
    especialidade: updated.especialidade,
    timezone: updated.timezone,
    notificacoes: updated.notificacoes
  });
};

/**
 * PUT /profile/password
 * Body: { senhaAtual, novaSenha }
 */
exports.changePassword = async (req, res) => {
  const { id } = req.user;
  const { senhaAtual, novaSenha } = req.body;
  const user = await prisma.nutricionista.findUnique({ where: { id } });
  const ok = await bcrypt.compare(senhaAtual, user.senhaHash);
  if (!ok) return res.status(400).json({ message: 'Senha atual incorreta' });
  const novaHash = await bcrypt.hash(novaSenha, 10);
  await prisma.nutricionista.update({
    where: { id },
    data: { senhaHash: novaHash }
  });
  res.json({ message: 'Senha alterada com sucesso' });
};
