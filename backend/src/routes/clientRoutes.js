// src/routes/clientRoutes.js
const router = require('express').Router();
const auth   = require('../middlewares/authMiddleware');
const ctrl   = require('../controllers/clientController');

// todas as rotas de client exigem autenticação
router.use(auth);

router.post('/',    ctrl.create);
router.get('/',     ctrl.list);
router.get('/:id',  ctrl.getOne);
router.put('/:id',  ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
