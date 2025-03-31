import 'dotenv/config';
import app from './src/app.js';
import config from './src/config/index.js';
import redisClient from './src/services/redis.js';


process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
console.error('Unhandled rejection at:', promise, 'reason:', reason);
});

async function gracefulShutdown() {
    console.log('Shutting down gracefully...');
    await redisClient.quit();
    process.exit(0);
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);


async function startApp() {
    try {
      // Connect to Redis
      await redisClient.connect();
      console.log(`Connected to Redis at ${config.redis.host}:${config.redis.port}`);
      
      // Start the server
      app.listen(config.port, () => {
        console.log(`Log aggregation service listening on port ${config.port}`);
      });
    } catch (error) {
      console.error('Failed to start application:', error);
      process.exit(1);
    }
}

startApp();
