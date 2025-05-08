// backend/src/routes/diarioRoutes.js

const router = require('express').Router();
const auth   = require('../middlewares/authMiddleware');
const ctl    = require('../controllers/diarioController');

router.use(auth);

router.post('/',              ctl.create);
router.get('/:pacienteId',    ctl.listByPaciente);

module.exports = router;
