// backend/src/routes/diarioRoutes.js
const router = require('express').Router();
const auth   = require('../middlewares/authMiddleware');
const ctrl   = require('../controllers/diarioController');

router.use(auth);
// POST /diario
router.post('/', ctrl.create);
// GET  /diario/:pacienteId
router.get('/:pacienteId', ctrl.listByPaciente);

module.exports = router;
