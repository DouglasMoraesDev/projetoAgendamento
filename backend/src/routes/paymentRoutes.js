const express = require('express');
const router  = express.Router();
const paymentController = require('../controllers/paymentController');

// Criar um novo pagamento para uma consulta
// POST /api/payments
router.post('/', paymentController.create);

// Listar pagamentos de uma consulta
// GET /api/payments?appointmentId=123
router.get('/', paymentController.listByAppointment);

// Atualizar status de um pagamento (ex.: marcar como pago)
// PATCH /api/payments/:id/status
router.patch('/:id/status', paymentController.updateStatus);

module.exports = router;
