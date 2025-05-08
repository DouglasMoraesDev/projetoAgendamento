// backend/src/middlewares/authMiddleware.js

const { verify } = require('../utils/jwt');

/**
 * Middleware que exige header Authorization: Bearer <token>.
 * Decodifica o token e adiciona `req.user = { id, email }`.
 */
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer '))
    return res.status(401).json({ message: 'Token não fornecido' });

  const token = authHeader.split(' ')[1];
  try {
    req.user = verify(token);
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido' });
  }
};
