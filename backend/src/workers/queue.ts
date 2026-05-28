import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

export const generationQueue = new Queue('paper-generation', {
  connection: redisConnection as any,
});

export const addGenerationJob = async (assignmentId: string) => {
  await generationQueue.add('generate-paper', { assignmentId });
};
