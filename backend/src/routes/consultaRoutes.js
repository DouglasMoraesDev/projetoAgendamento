const router = require('express').Router();
const ctrl   = require('../controllers/consultaController');
const authMw = require('../middlewares/authMiddleware');

router.use(authMw);
router.post('/',             ctrl.create);
router.get('/',              ctrl.list);
router.patch('/:id/status',  ctrl.updateStatus);

module.exports = router;
