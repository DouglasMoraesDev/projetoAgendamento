// backend/src/routes/authRoutes.js

/**
 * Rotas de autenticação (registro e login)
 * Prefixo no index.js: app.use('/api/auth', require('./routes/authRoutes'));
 */

const router = require('express').Router();
const ctl    = require('../controllers/authController');

// POST /api/auth/register — registra um novo professional
router.post('/register', ctl.register);

// POST /api/auth/login — autentica um professional existente
router.post('/login',    ctl.login);

module.exports = router;
