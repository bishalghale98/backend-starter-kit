import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);


let prisma: PrismaClient;

// Check if running in serverless (Vercel)
if (process.env.NODE_ENV === 'production') {
    // Production / serverless: new instance per request
    prisma = new PrismaClient({
        adapter,
        log: ['query', 'error', 'warn'],
    });
} else {
    // Development: reuse client to avoid hot reload issues
    const globalWithPrisma = global as unknown as { prisma: PrismaClient };
    if (!globalWithPrisma.prisma) {
        globalWithPrisma.prisma = new PrismaClient({
            adapter,

            log: ['query', 'error', 'warn'],
        });
    }
    prisma = globalWithPrisma.prisma;
}

export { prisma };

// Optional connect helper (Vercel serverless can skip $connect)
export const connectDB = async () => {
    try {
        await prisma.$connect();
        logger.success("✅ Database connected");
    } catch (error) {
        logger.error('❌ Database connection failed', error);
        process.exit(1);
    }
};

// Graceful shutdown (mostly for dev/local)
if (process.env.NODE_ENV === 'production') {
    process.on('beforeExit', async () => await prisma.$disconnect());
    process.on('SIGINT', async () => { await prisma.$disconnect(); process.exit(0); });
    process.on('SIGTERM', async () => { await prisma.$disconnect(); process.exit(0); });
}
