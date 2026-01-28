import dotenv from 'dotenv';
import app from './src/app';
import { connectDB } from './src/config/dbConnect';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
    try {
        // Connect to database
        await connectDB();

        // Start Express server
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`📍 Health check: http://localhost:${PORT}/health`);
            console.log(`📍 API base URL: http://localhost:${PORT}/api`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
