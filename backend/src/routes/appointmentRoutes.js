// backend/src/routes/appointmentRoutes.js

const router = require('express').Router();
const auth   = require('../middlewares/authMiddleware');
// Atenção aqui: o nome deve bater com o arquivo em controllers/
const ctl    = require('../controllers/appointmentController');

router.use(auth);
router.post('/',             ctl.create);
router.get('/',              ctl.list);
router.patch('/:id/status',  ctl.updateStatus);
router.patch('/:id/reschedule', ctl.reschedule);

module.exports = router;
