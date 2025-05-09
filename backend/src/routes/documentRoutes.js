// backend/src/routes/documentRoutes.js

/**
 * Rotas de upload e listagem de documentos de uma appointment
 * Este router é montado em:
 *   app.use('/api/appointments/:appointmentId/documents', require('./routes/documentRoutes'));
 * mergeParams: true para capturar appointmentId da rota pai
 */

const router = require('express').Router({ mergeParams: true });
const auth   = require('../middlewares/authMiddleware');
const ctrl   = require('../controllers/documentController');
const multer = require('multer');
const path   = require('path');

// Configuração do storage do Multer
const storage = multer.diskStorage({
  // Pasta onde os arquivos serão salvos
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, '..', '..', 'uploads')),
  // Gera nome único para evitar colisão
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext    = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  }
});
const upload = multer({ storage });

// Aplica autenticação a todas as rotas
router.use(auth);

/**
 * POST /api/appointments/:appointmentId/documents
 * Recebe um único arquivo no campo 'file' via multipart/form-data
 */
router.post('/', upload.single('file'), ctrl.upload);

/**
 * GET /api/appointments/:appointmentId/documents
 * Lista todos os documentos já enviados de uma appointment
 */
router.get('/', ctrl.list);

module.exports = router;
