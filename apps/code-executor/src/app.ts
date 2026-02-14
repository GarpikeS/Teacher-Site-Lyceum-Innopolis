import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './config/environment';
import { logger } from './utils/logger';
import { checkDockerHealth } from './services/docker-sandbox';
import executionRoutes from './routes/execution.routes';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [
    config.nodeEnv === 'development' ? 'http://localhost:3000' : '',
    config.nodeEnv === 'development' ? 'http://localhost:3001' : '',
  ].filter(Boolean),
  methods: ['GET', 'POST'],
}));

// Body parser
app.use(express.json({ limit: '1mb' }));

// Health check
app.get('/health', async (_req, res) => {
  const dockerHealth = await checkDockerHealth();

  const status = dockerHealth.available ? 'healthy' : 'degraded';

  res.json({
    status,
    service: 'code-executor',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    docker: {
      available: dockerHealth.available,
      sandboxImages: dockerHealth.images,
    },
  });
});

// Routes
app.use('/api/v1/code', executionRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Route not found' },
  });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: config.nodeEnv === 'development' ? err.message : 'Internal server error',
    },
  });
});

export default app;
