const express = require('express');
const router = express.Router();
const anotacaoController = require('../controllers/anotacaoController');

// Criar uma anotação
router.post('/', anotacaoController.create);

// Listar todas as anotações de uma consulta
// /api/anotacoes?appointmentId=123
router.get('/', anotacaoController.listByAppointment);

module.exports = router;
