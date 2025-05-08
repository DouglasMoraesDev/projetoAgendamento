// backend/src/index.js

const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/auth',      require('./routes/authRoutes'));
app.use('/pacientes', require('./routes/pacienteRoutes'));
app.use('/consultas', require('./routes/consultaRoutes'));
app.use('/diario',    require('./routes/diarioRoutes'));

// Rota de sanity check
app.get('/', (req, res) => res.send('API Nutri Manager OK'));

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
