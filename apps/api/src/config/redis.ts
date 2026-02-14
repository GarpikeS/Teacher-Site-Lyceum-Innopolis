import { createClient, RedisClientType } from 'redis';
import { config } from './environment';
import { logger } from '../utils/logger';

class RedisClient {
  private client: RedisClientType;
  private isConnected = false;

  constructor() {
    this.client = createClient({
      url: config.redisUrl,
    });

    this.client.on('connect', () => {
      logger.info('Redis connection established');
      this.isConnected = true;
    });

    this.client.on('error', (err) => {
      logger.error('Redis error', err);
      this.isConnected = false;
    });

    this.client.on('disconnect', () => {
      logger.warn('Redis disconnected');
      this.isConnected = false;
    });
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.client.connect();
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.disconnect();
      this.isConnected = false;
      logger.info('Redis connection closed');
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async set(key: string, value: string, expiresIn?: number): Promise<void> {
    if (expiresIn) {
      await this.client.setEx(key, expiresIn, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.client.ping();
      return true;
    } catch (error) {
      logger.error('Redis health check failed', error);
      return false;
    }
  }

  getClient(): RedisClientType {
    return this.client;
  }
}

export const redis = new RedisClient();
