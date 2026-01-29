import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { logger } from './logger';
import dns from 'dns';
import { promisify } from 'util';

// Promisify DNS lookup
const lookup = promisify(dns.lookup);

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

// Resolve hostname to IPv4 address
const resolveToIPv4 = async (hostname: string): Promise<string> => {
    try {
        // Force IPv4 resolution by specifying family: 4
        const result = await lookup(hostname, { family: 4 });
        logger.info(`Resolved ${hostname} to IPv4: ${result.address}`);
        return result.address;
    } catch (error) {
        logger.warn(`Failed to resolve ${hostname} to IPv4, using hostname directly`, error);
        return hostname;
    }
};

// Create PostgreSQL connection pool with IPv4 enforcement
let pool: Pool;

const initializePool = async () => {
    const dbConfig = process.env.DATABASE_URL ? parseDatabaseUrl(process.env.DATABASE_URL) : null;

    if (!dbConfig) {
        throw new Error('DATABASE_URL is not defined');
    }

    // Resolve hostname to IPv4 address
    const ipv4Address = await resolveToIPv4(dbConfig.host);

    pool = new Pool({
        user: dbConfig.user,
        password: dbConfig.password,
        host: ipv4Address, // Use resolved IPv4 address instead of hostname
        port: dbConfig.port,
        database: dbConfig.database,
        ssl: process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : undefined,
        connectionTimeoutMillis: 10000, // 10 seconds
        idleTimeoutMillis: 30000, // 30 seconds
        max: 10, // Maximum pool size
        min: 2, // Minimum pool size
    });

    return pool;
};

// Initialize pool immediately
const poolPromise = initializePool();

// Create Prisma adapter (will use pool once initialized)
let adapter: PrismaPg;
let prismaInstance: PrismaClient;

// Initialize adapter and Prisma after pool is ready
poolPromise.then((readyPool) => {
    adapter = new PrismaPg(readyPool);

    prismaInstance = new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
});

// Singleton pattern for Prisma Client
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = new Proxy({} as PrismaClient, {
    get: (_target, prop) => {
        if (!prismaInstance) {
            throw new Error('Prisma client not initialized yet. Wait for database connection.');
        }
        return (prismaInstance as any)[prop];
    }
});

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

// Database connection function
export const connectDB = async (): Promise<void> => {
    try {
        // Wait for pool to be initialized
        await poolPromise;

        // Wait for Prisma to be ready
        await new Promise(resolve => setTimeout(resolve, 100));

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
