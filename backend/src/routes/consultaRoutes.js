// backend/src/routes/consultaRoutes.js

const router = require('express').Router();
const ctl    = require('../controllers/consultaController');
const auth   = require('../middlewares/authMiddleware');

router.use(auth);

router.post('/',             ctl.create);
router.get('/',              ctl.list);
router.patch('/:id/status',  ctl.updateStatus);

module.exports = router;
