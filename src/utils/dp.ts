import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => new PrismaClient();

const globalForPrisma = global as unknown as { prismaGlobal?: PrismaClient };
const prisma = globalForPrisma.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prismaGlobal = prisma;
}

export default prisma;
