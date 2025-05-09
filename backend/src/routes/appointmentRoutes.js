// src/routes/appointmentRoutes.js
const router = require('express').Router();
const auth   = require('../middlewares/authMiddleware');
const ctl    = require('../controllers/appointmentController');

router.use(auth);

// Cria nova consulta
router.post('/',             ctl.create);
// Lista todas as consultas do profissional
router.get('/',              ctl.list);
// Detalha uma consulta específica
router.get('/:id',           ctl.getOne);
// Atualiza parcialmente (status ou reagendamento)
router.patch('/:id/status',  ctl.updateStatus);
router.patch('/:id/reschedule', ctl.reschedule);
// Atualiza todos os campos da consulta
router.put('/:id',           ctl.update);
// Remove consulta
router.delete('/:id',        ctl.remove);

module.exports = router;
