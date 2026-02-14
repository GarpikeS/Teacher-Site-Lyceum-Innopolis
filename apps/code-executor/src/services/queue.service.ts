import Bull, { Job } from 'bull';
import { config } from '../config/environment';
import { executeCode, executeWithTests, ExecutionRequest, ExecutionResponse, TestExecutionResponse } from './execution.service';
import { logger } from '../utils/logger';

export type QueueJobData = ExecutionRequest & {
  jobId: string;
  hasTestCases: boolean;
};

export type QueueJobResult = ExecutionResponse | TestExecutionResponse;

let executionQueue: Bull.Queue<QueueJobData> | null = null;

// In-memory store for job results (in production, use Redis)
const jobResults = new Map<string, { status: string; result?: QueueJobResult; error?: string }>();

export function getQueue(): Bull.Queue<QueueJobData> {
  if (!executionQueue) {
    executionQueue = new Bull<QueueJobData>('code-execution', config.redisUrl, {
      defaultJobOptions: {
        attempts: 1, // No retries for code execution
        removeOnComplete: 100,
        removeOnFail: 100,
        timeout: 30000, // 30s max per job
      },
    });

    // Process jobs
    executionQueue.process(config.queue.concurrency, async (job: Job<QueueJobData>) => {
      const { jobId, hasTestCases, ...request } = job.data;
      logger.info(`Processing job ${jobId}: ${request.language} code execution`);

      jobResults.set(jobId, { status: 'running' });

      try {
        let result: QueueJobResult;

        if (hasTestCases) {
          result = await executeWithTests(request);
        } else {
          result = await executeCode(request);
        }

        jobResults.set(jobId, { status: 'completed', result });
        logger.info(`Job ${jobId} completed`);
        return result;
      } catch (error: any) {
        const errorMsg = error.message || 'Execution failed';
        jobResults.set(jobId, { status: 'failed', error: errorMsg });
        logger.error(`Job ${jobId} failed:`, errorMsg);
        throw error;
      }
    });

    executionQueue.on('failed', (job, err) => {
      logger.error(`Job ${job.id} failed: ${err.message}`);
    });

    executionQueue.on('error', (error) => {
      logger.error('Queue error:', error);
    });

    logger.info(`Execution queue initialized (concurrency: ${config.queue.concurrency})`);
  }

  return executionQueue;
}

export function getJobResult(jobId: string) {
  return jobResults.get(jobId) || null;
}

export async function addJob(data: QueueJobData): Promise<Job<QueueJobData>> {
  const queue = getQueue();
  return queue.add(data);
}

export async function closeQueue(): Promise<void> {
  if (executionQueue) {
    await executionQueue.close();
    executionQueue = null;
    logger.info('Execution queue closed');
  }
}
