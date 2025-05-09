// backend/src/index.js

const express = require('express');
const cors    = require('cors');
const path    = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Serve arquivos estáticos de upload (e.g. documentos)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Rotas da API
app.use('/auth',      require('./routes/authRoutes'));
app.use('/pacientes', require('./routes/pacienteRoutes'));
app.use('/consultas', require('./routes/consultaRoutes'));  // já inclui documentos em subrota
app.use('/diario',    require('./routes/diarioRoutes'));
app.use('/profile',   require('./routes/profileRoutes'));

// Rota de sanity check
app.get('/', (req, res) => res.send('API Nutri Manager OK'));

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
