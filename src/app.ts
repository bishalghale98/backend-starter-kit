import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { env } from './config/env';
import { logger } from './config/logger';
import { apiLimiter } from './middlewares/rateLimit.middleware';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import mainRouter from './routes';

// Create Express application
const app: Application = express();

// Security Middlewares
app.use(helmet()); // Set security HTTP headers
app.use(
    cors({
        origin: env.CORS_ORIGIN,
        credentials: true, // Allow cookies to be sent
    })
);

// Body Parsing Middlewares
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies

// Rate Limiting
app.use(apiLimiter); // Apply rate limiting to all routes

// Request Logging Middleware
app.use((req: Request, _res: Response, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
});

// Health check route
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: env.NODE_ENV,
    });
});

// API routes - Base path: /api/v1
app.use('/api/v1', mainRouter);

// 404 handler - Must be after all routes
app.use(notFoundHandler);

// Error handler - Must be last
app.use(errorHandler);

// Export app (do not call listen here)
export default app;

