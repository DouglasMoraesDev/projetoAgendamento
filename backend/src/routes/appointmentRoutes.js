// src/routes/appointmentRoutes.js
const router = require('express').Router();
const auth   = require('../middlewares/authMiddleware');
const ctl    = require('../controllers/appointmentController');

// todas as rotas exigem token válido
router.use(auth);

router.post('/',             ctl.create);
router.get('/',              ctl.list);
router.patch('/:id/status',  ctl.updateStatus);
router.patch('/:id/reschedule', ctl.reschedule);

module.exports = router;
