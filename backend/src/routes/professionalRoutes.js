// src/routes/professionalRoutes.js
const router = require('express').Router();
const auth   = require('../middlewares/authMiddleware');
const ctrl   = require('../controllers/professionalController');

router.use(auth);

router.get('/',         ctrl.getProfile);
router.put('/',         ctrl.updateProfile);
router.put('/password', ctrl.changePassword);

module.exports = router;
