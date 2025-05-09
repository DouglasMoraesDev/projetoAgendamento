// backend/src/routes/consultaRoutes.js

const router = require('express').Router();
const ctl    = require('../controllers/consultaController');
const auth   = require('../middlewares/authMiddleware');

router.use(auth);

router.post('/',             ctl.create);
router.get('/',              ctl.list);
router.patch('/:id/status',  ctl.updateStatus);
router.patch('/:id/reschedule', ctl.reschedule);

// Documentos de cada consulta
router.use('/:consultaId/documentos', require('./documentRoutes'));

module.exports = router;
