import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Environment
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.API_PORT || process.env.PORT || '5001', 10),

  // Database
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/code_platform',

  // Redis
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // Email (SMTP)
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    from: process.env.EMAIL_FROM || 'noreply@code-platform.com',
  },

  // Sentry
  sentry: {
    dsn: process.env.SENTRY_DSN || '',
    environment: process.env.SENTRY_ENVIRONMENT || 'development',
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  // Code Executor
  executorUrl: process.env.EXECUTOR_URL || 'http://localhost:5012',

  // Docker Sandbox Limits
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
  },
};

export const isDevelopment = config.nodeEnv === 'development';
export const isProduction = config.nodeEnv === 'production';
export const isTest = config.nodeEnv === 'test';

// Validate critical secrets in production
if (isProduction) {
  const missing: string[] = [];
  if (!process.env.JWT_SECRET) missing.push('JWT_SECRET');
  if (!process.env.JWT_REFRESH_SECRET) missing.push('JWT_REFRESH_SECRET');
  if (!process.env.DATABASE_URL) missing.push('DATABASE_URL');
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables for production: ${missing.join(', ')}`);
  }
}
