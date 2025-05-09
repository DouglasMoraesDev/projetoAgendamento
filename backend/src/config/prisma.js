// src/config/prisma.js
const { PrismaClient } = require('@prisma/client');

// Exporta uma única instância para todo o app
const prisma = new PrismaClient();
module.exports = prisma;
