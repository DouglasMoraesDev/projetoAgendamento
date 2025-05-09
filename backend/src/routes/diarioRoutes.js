// src/routes/diarioRoutes.js
const router = require('express').Router();
const auth   = require('../middlewares/authMiddleware');
const ctl    = require('../controllers/diarioController');

router.use(auth);

router.post('/', ctl.create);
router.get('/:clientId', ctl.listByClient);

module.exports = router;
