// backend/src/routes/diarioRoutes.js

/**
 * Rotas do diário alimentar
 * Prefixo no index.js: app.use('/api/diary', require('./routes/diarioRoutes'));
 */

const router = require('express').Router();
const auth   = require('../middlewares/authMiddleware');
const ctl    = require('../controllers/diarioController');

// Aplica autenticação a todas as rotas abaixo
router.use(auth);

/**
 * POST /api/diary
 * Cria uma nova entrada de diário.
 * Body: { clientId, data, refeicao, porcao, calorias, macros, nota }
 */
router.post('/', ctl.create);

/**
 * GET /api/diary/:clientId
 * Lista todas as entradas do diário de um client.
 */
router.get('/:clientId', ctl.listByClient);

module.exports = router;
