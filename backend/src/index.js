const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/auth',      require('./routes/authRoutes'));
app.use('/pacientes', require('./routes/pacienteRoutes'));
app.use('/consultas', require('./routes/consultaRoutes'));

app.get('/', (req, res) => res.send('API Nutri Manager OK'));

app.listen(port, () =>
  console.log(`Servidor rodando em http://localhost:${port}`)
);
