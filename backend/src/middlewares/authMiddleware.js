const { verify } = require('../utils/jwt');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Token não fornecido' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verify(token);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido' });
  }
};
