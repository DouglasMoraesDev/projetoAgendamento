// src/controllers/professionalController.js
const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');

/**
 * GET /api/profile
 */
exports.getProfile = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await prisma.professional.findUnique({
      where: { id },
      select: {
        nome: true, email: true, fotoUrl: true,
        tipo: true, timezone: true, notificacoes: true
      }
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/profile
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { id } = req.user;
    const data = {
      nome: req.body.nome,
      email: req.body.email,
      fotoUrl: req.body.fotoUrl,
      tipo: req.body.tipo,
      timezone: req.body.timezone,
      notificacoes: req.body.notificacoes === 'true'
    };
    const updated = await prisma.professional.update({
      where: { id },
      data
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/profile/password
 */
exports.changePassword = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { senhaAtual, novaSenha } = req.body;
    const user = await prisma.professional.findUnique({ where: { id } });
    const ok = await bcrypt.compare(senhaAtual, user.senhaHash);
    if (!ok) return res.status(400).json({ message: 'Senha atual incorreta' });

    const novaHash = await bcrypt.hash(novaSenha, 10);
    await prisma.professional.update({
      where: { id },
      data: { senhaHash: novaHash }
    });
    res.json({ message: 'Senha alterada com sucesso' });
  } catch (err) {
    next(err);
  }
};
