// backend/src/routes/documentRoutes.js

const router = require('express').Router({ mergeParams: true });
const auth   = require('../middlewares/authMiddleware');
const ctrl   = require('../controllers/documentController');
const multer = require('multer');
const path   = require('path');

// Configura Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', '..', 'uploads')),
  filename:    (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random()*1E9);
    const ext    = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  }
});
const upload = multer({ storage });

router.use(auth);

// Upload de documento (campo 'file')
router.post('/', upload.single('file'), ctrl.upload);

// Listar documentos
router.get('/', ctrl.list);

module.exports = router;
