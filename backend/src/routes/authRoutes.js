// backend/src/routes/authRoutes.js

const router = require('express').Router();
const ctl    = require('../controllers/authController');

router.post('/register', ctl.register);
router.post('/login',    ctl.login);

module.exports = router;
