const router = require('express').Router();
const ctrl   = require('../controllers/pacienteController');
const authMw = require('../middlewares/authMiddleware');

router.use(authMw);
router.post('/',    ctrl.create);
router.get('/',     ctrl.list);
router.get('/:id',  ctrl.getOne);
router.put('/:id',  ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
