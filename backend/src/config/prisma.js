// backend/src/config/prisma.js

// Inicializa o Prisma Client para toda a aplicação
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = prisma;
