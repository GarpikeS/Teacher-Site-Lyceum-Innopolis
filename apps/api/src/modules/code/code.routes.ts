import { Router, Request, Response } from 'express';
import { authenticate } from '../auth/auth.middleware';
import { codeExecutionLimiter } from '../../middleware/rate-limiter.middleware';
import { config } from '../../config/environment';
import { logger } from '../../utils/logger';

const router = Router();

/**
 * POST /code/execute
 * Proxy to code executor service - simple code run
 */
router.post('/execute', authenticate, codeExecutionLimiter, async (req: Request, res: Response) => {
  try {
    const response = await fetch(`${config.executorUrl}/api/v1/code/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error: any) {
    logger.error('Code execution proxy error:', error.message);
    res.status(503).json({
      success: false,
      error: { code: 'EXECUTOR_UNAVAILABLE', message: 'Code execution service is unavailable' },
    });
  }
});

/**
 * POST /code/validate
 * Proxy to code executor service - validate code security
 */
router.post('/validate', authenticate, async (req: Request, res: Response) => {
  try {
    const response = await fetch(`${config.executorUrl}/api/v1/code/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error: any) {
    logger.error('Code validation proxy error:', error.message);
    res.status(503).json({
      success: false,
      error: { code: 'EXECUTOR_UNAVAILABLE', message: 'Code validation service is unavailable' },
    });
  }
});

export default router;
