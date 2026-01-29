import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { logger } from './logger';

// Parse DATABASE_URL to extract connection details
const parseDatabaseUrl = (url: string) => {
    const urlObj = new URL(url);
    return {
        user: urlObj.username,
        password: urlObj.password,
        host: urlObj.hostname,
        port: parseInt(urlObj.port) || 5432,
        database: urlObj.pathname.slice(1), // Remove leading '/'
    };
};

// Create PostgreSQL connection pool with IPv4 enforcement
const dbConfig = process.env.DATABASE_URL ? parseDatabaseUrl(process.env.DATABASE_URL) : null;

const pool = new Pool({
    ...(dbConfig || {}),
    // Force IPv4 resolution to avoid IPv6 issues on Render
    host: dbConfig?.host,
    // @ts-ignore - family option exists but not in types
    family: 4, // Force IPv4
    ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : undefined,
    connectionTimeoutMillis: 10000, // 10 seconds
    idleTimeoutMillis: 30000, // 30 seconds
    max: 10, // Maximum pool size
    min: 2, // Minimum pool size
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Singleton pattern for Prisma Client
// Prevents multiple instances in development with hot reload
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

// Database connection function
export const connectDB = async (): Promise<void> => {
    try {
        await prisma.$connect();
        logger.success('Database connected successfully');
    } catch (error) {
        logger.error('Database connection failed', error);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});
