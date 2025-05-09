const express = require('express');
const cors    = require('cors');
const path    = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Serve arquivos estáticos (ex: PDFs, imagens de uploads)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Rotas principais da API
app.use('/api/auth',        require('./routes/authRoutes'));
app.use('/api/clients',     require('./routes/clientRoutes'));
app.use('/api/appointments', require('./routes/documentRoutes'));  // <- corrigido
app.use('/api/diary',       require('./routes/diarioRoutes'));
app.use('/api/profile',     require('./routes/professionalRoutes'));

// Teste de saúde da API
app.get('/', (req, res) => res.send('API Health Scheduler OK'));

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
