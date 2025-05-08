// backend/src/routes/pacienteRoutes.js

const router = require('express').Router();
const ctl    = require('../controllers/pacienteController');
const auth   = require('../middlewares/authMiddleware');

// Protege todas as rotas abaixo
router.use(auth);

router.post('/',    ctl.create);
router.get('/',     ctl.list);
router.get('/:id',  ctl.getOne);
router.put('/:id',  ctl.update);
router.delete('/:id', ctl.remove);

module.exports = router;
