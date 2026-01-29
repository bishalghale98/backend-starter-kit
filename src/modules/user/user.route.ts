import { Router } from 'express';
import { register, login, getProfile, logout } from './user.controller';
import { validateSchema } from '../../middlewares/validateSchema';
import { authenticate } from '../../middlewares/auth.middleware';
import { authLimiter } from '../../middlewares/rateLimit.middleware';
import { registerSchema, loginSchema } from './user.schema';

const userRouter = Router();

/**
 * Public routes
 */
// POST /api/v1/users/register - Register new user
userRouter.post('/register', authLimiter, validateSchema(registerSchema), register);

// POST /api/v1/users/login - Login user
userRouter.post('/login', authLimiter, validateSchema(loginSchema), login);

/**
 * Protected routes (require authentication)
 */
// GET /api/v1/users/profile - Get authenticated user profile
userRouter.get('/profile', authenticate, getProfile);

// POST /api/v1/users/logout - Logout user
userRouter.post('/logout', authenticate, logout);

export default userRouter;

