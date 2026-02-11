import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { logger } from './logger';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);


let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient({ adapter })
} else {
    const globalWithPrisma = global as unknown as { prisma: PrismaClient };
    globalWithPrisma.prisma = new PrismaClient({
        adapter,
        log: ['query', 'info', 'warn', 'error'],
    })
    prisma = globalWithPrisma.prisma
}

export { prisma }

// Connect helper
export const connectDB = async (): Promise<void> => {
    try {
        await prisma.$connect();
        logger.success('✅ Database connected successfully');
    } catch (error) {
        logger.error('❌ Database connection failed', error);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('beforeExit', async () => await prisma.$disconnect());
process.on('SIGINT', async () => { await prisma.$disconnect(); process.exit(0); });
process.on('SIGTERM', async () => { await prisma.$disconnect(); process.exit(0); });
