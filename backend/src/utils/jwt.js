// backend/src/utils/jwt.js

const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Gera um token JWT com payload e expiração de 8h.
 */
exports.sign = (payload) => 
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

/**
 * Verifica e decodifica um token JWT.
 */
exports.verify = (token) =>
  jwt.verify(token, process.env.JWT_SECRET);
