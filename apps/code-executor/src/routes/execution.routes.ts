import { Router, Request, Response } from 'express';
import Joi from 'joi';
import { executeCode, executeWithTests } from '../services/execution.service';
import { addJob, getJobResult } from '../services/queue.service';
import { validateCode } from '../utils/security';
import { logger } from '../utils/logger';

const router = Router();

// Validation schemas
const executeSchema = Joi.object({
  code: Joi.string().required().max(50000),
  language: Joi.string().valid('python', 'cpp').required(),
  input: Joi.string().allow('').optional().max(10000),
});

const executeWithTestsSchema = Joi.object({
  code: Joi.string().required().max(50000),
  language: Joi.string().valid('python', 'cpp').required(),
  testCases: Joi.array().items(
    Joi.object({
      id: Joi.number().required(),
      input: Joi.string().allow('').required(),
      expectedOutput: Joi.string().required(),
    })
  ).required().min(1).max(20),
});

const validateSchema = Joi.object({
  code: Joi.string().required().max(50000),
  language: Joi.string().valid('python', 'cpp').required(),
});

/**
 * POST /execute
 * Execute code synchronously (simple run)
 */
router.post('/execute', async (req: Request, res: Response) => {
  try {
    const { error, value } = executeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: error.details[0].message },
      });
    }

    const result = await executeCode(value);

    return res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    logger.error('Execution error:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'EXECUTION_ERROR', message: 'Code execution failed' },
    });
  }
});

/**
 * POST /execute/tests
 * Execute code against test cases synchronously
 */
router.post('/execute/tests', async (req: Request, res: Response) => {
  try {
    const { error, value } = executeWithTestsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: error.details[0].message },
      });
    }

    const result = await executeWithTests(value);

    return res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    logger.error('Test execution error:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'EXECUTION_ERROR', message: 'Test execution failed' },
    });
  }
});

/**
 * POST /execute/async
 * Submit code for async execution via queue
 */
router.post('/execute/async', async (req: Request, res: Response) => {
  try {
    const hasTestCases = !!req.body.testCases;
    const schema = hasTestCases ? executeWithTestsSchema : executeSchema;
    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: error.details[0].message },
      });
    }

    const jobId = `exec-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    await addJob({
      ...value,
      jobId,
      hasTestCases,
    });

    return res.status(202).json({
      success: true,
      data: { jobId, status: 'queued' },
    });
  } catch (err: any) {
    logger.error('Queue submission error:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'QUEUE_ERROR', message: 'Failed to queue execution' },
    });
  }
});

/**
 * GET /execute/status/:jobId
 * Check async execution status
 */
router.get('/execute/status/:jobId', async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const result = getJobResult(jobId);

    if (!result) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Job not found' },
      });
    }

    return res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    logger.error('Status check error:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to check job status' },
    });
  }
});

/**
 * POST /validate
 * Validate code for security issues without executing
 */
router.post('/validate', async (req: Request, res: Response) => {
  try {
    const { error, value } = validateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: error.details[0].message },
      });
    }

    const result = validateCode(value.code, value.language);

    return res.json({
      success: true,
      data: {
        valid: result.safe,
        violations: result.violations,
      },
    });
  } catch (err: any) {
    logger.error('Validation error:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Validation failed' },
    });
  }
});

export default router;
