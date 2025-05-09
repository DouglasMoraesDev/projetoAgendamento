// src/index.js
const express = require('express');
const cors    = require('cors');
const path    = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares globais
app.use(cors());
app.use(express.json()); // Parseia JSON no body das requisições

// Serve uploads de documentos/imagens
app.use(
  '/uploads',
  express.static(path.join(__dirname, '..', 'uploads'))
);

// Montagem das rotas

// Autenticação (login, registro, etc.)
app.use('/api/auth', require('./routes/authRoutes'));

// Clientes (CRUD de pacientes)
app.use('/api/clients', require('./routes/clientRoutes'));

// Profissionais (perfil, atualização de dados)
app.use('/api/profile', require('./routes/professionalRoutes'));

// Diário alimentar
app.use('/api/diary', require('./routes/diarioRoutes'));

// Consultas (agendar, listar, atualizar status)
app.use('/api/appointments', require('./routes/appointmentRoutes'));

// Documentos vinculados a uma consulta
app.use(
  '/api/appointments/:appointmentId/documents',
  require('./routes/documentRoutes')
);

// Anotações Clínicas (novo módulo)
// Criar e listar anotações atreladas a uma consulta
app.use('/api/anotacoes', require('./routes/anotacaoRoutes'));

// Health check
app.get('/', (req, res) => res.send('API Health Scheduler OK'));

// 404 para endpoints não encontrados
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
