// src/routes/documentRoutes.js
const router = require('express').Router({ mergeParams: true });
const auth   = require('../middlewares/authMiddleware');
const ctrl   = require('../controllers/documentController');
const multer = require('multer');
const path   = require('path');

// configura storage Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, '..', '..', 'uploads')),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext    = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  }
});
const upload = multer({ storage });

router.use(auth);

router.post('/', upload.single('file'), ctrl.upload);
router.get('/', ctrl.list);

module.exports = router;
