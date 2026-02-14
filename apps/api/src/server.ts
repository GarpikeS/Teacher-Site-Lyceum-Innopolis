import { createApp } from './app';
import { config } from './config/environment';
import { db } from './config/database';
import { redis } from './config/redis';
import { logger } from './utils/logger';

async function startServer() {
  try {
    // Test database connection
    const dbHealthy = await db.healthCheck();
    if (!dbHealthy) {
      throw new Error('Database connection failed');
    }
    logger.info('Database connected successfully');

    // Connect to Redis
    await redis.connect();
    const redisHealthy = await redis.healthCheck();
    if (!redisHealthy) {
      throw new Error('Redis connection failed');
    }
    logger.info('Redis connected successfully');

    // Create Express app
    const app = createApp();

    // Start server
    const server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
      logger.info(`Health check: http://localhost:${config.port}/health`);
      logger.info(`API: http://localhost:${config.port}/api/v1`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received, starting graceful shutdown`);

      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          await db.close();
          logger.info('Database connection closed');

          await redis.disconnect();
          logger.info('Redis connection closed');

          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown', error);
          process.exit(1);
        }
      });

      // Force close after 10 seconds
      setTimeout(() => {
        logger.error('Forcefully shutting down after timeout');
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught exception', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled rejection', { reason, promise });
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

// Start the server
startServer();
