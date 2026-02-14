import winston from 'winston';
import { config } from '../config/environment';

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

export const logger = winston.createLogger({
  level: config.nodeEnv === 'development' ? 'debug' : 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),
  ],
});

if (config.nodeEnv === 'production') {
  logger.add(
    new winston.transports.File({ filename: 'logs/executor-error.log', level: 'error' })
  );
  logger.add(
    new winston.transports.File({ filename: 'logs/executor-combined.log' })
  );
}
