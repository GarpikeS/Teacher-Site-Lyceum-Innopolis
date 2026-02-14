import { config } from './config/environment';
import { logger } from './utils/logger';
import app from './app';
import { getQueue, closeQueue } from './services/queue.service';
import { checkDockerHealth } from './services/docker-sandbox';

async function start(): Promise<void> {
  logger.info(`Starting Code Executor Service in ${config.nodeEnv} mode...`);

  // Check Docker availability
  const dockerHealth = await checkDockerHealth();
  if (dockerHealth.available) {
    logger.info('Docker is available');
    if (dockerHealth.images.length > 0) {
      logger.info(`Sandbox images found: ${dockerHealth.images.join(', ')}`);
    } else {
      logger.warn('No sandbox images found. Build them with: docker build -f infrastructure/docker/python-sandbox.Dockerfile -t python-sandbox:latest .');
    }
  } else {
    logger.warn('Docker is not available. Code execution will fail until Docker is running.');
  }

  // Initialize execution queue
  try {
    getQueue();
    logger.info('Execution queue initialized');
  } catch (error: any) {
    logger.warn(`Queue initialization failed (Redis may not be available): ${error.message}`);
  }

  // Start HTTP server
  const server = app.listen(config.port, () => {
    logger.info(`Code Executor Service running on port ${config.port}`);
    logger.info(`Health check: http://localhost:${config.port}/health`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`${signal} received. Starting graceful shutdown...`);

    server.close(async () => {
      logger.info('HTTP server closed');

      try {
        await closeQueue();
      } catch (error: any) {
        logger.error('Error closing queue:', error.message);
      }

      logger.info('Code Executor Service stopped');
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled rejection:', reason);
  });
}

start().catch((error) => {
  logger.error('Failed to start Code Executor Service:', error);
  process.exit(1);
});
