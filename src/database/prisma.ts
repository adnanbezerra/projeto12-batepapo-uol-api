import pkg from '@prisma/client'; // precisamos instalar esse pacote!

const { PrismaClient } = pkg;

export const client = new PrismaClient();
