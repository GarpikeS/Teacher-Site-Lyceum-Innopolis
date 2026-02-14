import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.EXECUTOR_PORT || '3002', 10),

  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',

  // Docker images for sandboxes
  docker: {
    pythonImage: process.env.PYTHON_SANDBOX_IMAGE || 'python-sandbox:latest',
    cppImage: process.env.CPP_SANDBOX_IMAGE || 'cpp-sandbox:latest',
    networkDisabled: true,
  },

  // Sandbox limits
  sandbox: {
    python: {
      timeoutMs: parseInt(process.env.PYTHON_TIMEOUT_MS || '5000', 10),
      memoryMb: parseInt(process.env.PYTHON_MEMORY_MB || '128', 10),
    },
    cpp: {
      compileTimeoutMs: parseInt(process.env.CPP_COMPILE_TIMEOUT_MS || '10000', 10),
      executeTimeoutMs: parseInt(process.env.CPP_EXECUTE_TIMEOUT_MS || '5000', 10),
      memoryMb: parseInt(process.env.CPP_MEMORY_MB || '256', 10),
    },
    cpuPercent: parseInt(process.env.SANDBOX_CPU_PERCENT || '50', 10),
  },

  // Queue
  queue: {
    concurrency: parseInt(process.env.QUEUE_CONCURRENCY || '3', 10),
  },
};

export const isDevelopment = config.nodeEnv === 'development';
export const isProduction = config.nodeEnv === 'production';
