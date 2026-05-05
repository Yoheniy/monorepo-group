// prisma-client.js
const { PrismaClient } = require('@prisma/client');

// Create a single instance of PrismaClient
const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
    errorFormat: 'minimal',
  });

// Prevent multiple instances in development (hot reload / nodemon)
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = { prisma };
