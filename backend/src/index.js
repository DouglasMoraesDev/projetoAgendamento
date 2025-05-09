// src/index.js
const express = require('express');
const cors    = require('cors');
const path    = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares globais
app.use(cors());
app.use(express.json()); // garante que req.body seja populado

// Serve uploads de documentos/imagens
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Montagem das rotas
app.use('/api/auth',         require('./routes/authRoutes'));
app.use('/api/clients',      require('./routes/clientRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
// rotas de documentos ficam aninhadas em appointments
app.use(
  '/api/appointments/:appointmentId/documents',
   require('./routes/documentRoutes')
);
app.use('/api/diary',        require('./routes/diarioRoutes'));
app.use('/api/profile',      require('./routes/professionalRoutes'));

// Health check
app.get('/', (req, res) => res.send('API Health Scheduler OK'));

// Erro 404 para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint não encontrado' });
});

// Error handler centralizado
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Erro interno no servidor' });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
