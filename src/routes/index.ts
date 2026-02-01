import { Router } from 'express';
import userRouter from '../modules/user/user.route';
import userManagementRouter from '../modules/user-management/user.route';

// Create main router
const mainRouter = Router();

// Register module routes
mainRouter.use('/users', userRouter);
mainRouter.use('/admin/users', userManagementRouter);

// Add more module routes here as you build them
// Example:
// mainRouter.use('/products', productRouter);
// mainRouter.use('/categories', categoryRouter);
// mainRouter.use('/cart', cartRouter);

export default mainRouter;
