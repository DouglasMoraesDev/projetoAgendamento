const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.sign = payload =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

exports.verify = token =>
  jwt.verify(token, process.env.JWT_SECRET);
