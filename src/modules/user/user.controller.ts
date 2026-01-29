import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { createUser, findUserByEmail, findUserById } from './user.model';
import { generateToken } from '../../utils/token.util';
import { catchError } from '../../services/catchError';
import { sendWelcomeEmail } from '../../services/email.service';
import { logger } from '../../config/logger';

/**
 * Register a new user
 * POST /api/users/register
 */
export const register = catchError(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        res.status(409).json({
            success: false,
            message: 'User with this email already exists',
        });
        return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await createUser({
        name,
        email,
        password: hashedPassword,
    });

    // Send welcome email (async, don't block response)
    sendWelcomeEmail(user.email, user.name).catch((error) => {
        logger.error('Failed to send welcome email', error);
    });

    // Generate JWT token
    const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
    });

    // Set HTTP-only cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send response
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        },
    });
});

/**
 * Login user
 * POST /api/users/login
 */
export const login = catchError(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
        res.status(401).json({
            success: false,
            message: 'Invalid email or password',
        });
        return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        res.status(401).json({
            success: false,
            message: 'Invalid email or password',
        });
        return;
    }

    // Generate JWT token
    const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
    });

    // Set HTTP-only cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send response
    res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            token,
        },
    });
});

/**
 * Get authenticated user profile
 * GET /api/users/profile
 */
export const getProfile = catchError(async (req: Request, res: Response) => {
    // User info is attached by auth middleware
    const userId = req.user?.id;

    if (!userId) {
        res.status(401).json({
            success: false,
            message: 'Unauthorized',
        });
        return;
    }

    // Get user from database
    const user = await findUserById(userId);

    if (!user) {
        res.status(404).json({
            success: false,
            message: 'User not found',
        });
        return;
    }

    // Send response (exclude password)
    res.status(200).json({
        success: true,
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        },
    });
});

/**
 * Logout user
 * POST /api/users/logout
 */
export const logout = catchError(async (_req: Request, res: Response) => {
    // Clear cookie
    res.clearCookie('token');

    res.status(200).json({
        success: true,
        message: 'Logout successful',
    });
});
