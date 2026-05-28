import Redis from 'ioredis';

// Expect Upstash or cloud redis URL
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redisConfig = {
  maxRetriesPerRequest: null,
};

export const redisConnection = new Redis(redisUrl, redisConfig);

redisConnection.on('connect', () => {
    console.log('Redis connected successfully');
});

redisConnection.on('error', (err) => {
    console.error('Redis connection error:', err);
});
