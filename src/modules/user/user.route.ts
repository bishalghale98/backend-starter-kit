import { Router } from 'express';
import { register, login, getProfile, logout } from './user.controller';
import { validateSchema } from '../../middlewares/validateSchema';
import { authenticate } from '../../middlewares/auth.middleware';
import { registerSchema, loginSchema } from './user.schema';

const userRouter = Router();

/**
 * Public routes
 */
// POST /api/users/register - Register new user
userRouter.post('/register', validateSchema(registerSchema), register);

// POST /api/users/login - Login user
userRouter.post('/login', validateSchema(loginSchema), login);

/**
 * Protected routes (require authentication)
 */
// GET /api/users/profile - Get authenticated user profile
userRouter.get('/profile', authenticate, getProfile);

// POST /api/users/logout - Logout user
userRouter.post('/logout', authenticate, logout);

export default userRouter;
