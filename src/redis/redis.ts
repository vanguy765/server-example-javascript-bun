// redis.ts
import { createClient } from 'redis';

export const redis = createClient({
  url: 'redis://localhost:6379'
});

redis.on('error', (err: Error) => console.error('Redis Client Error', err));
async function connectRedis() {
  await redis.connect();
}

connectRedis().catch(console.error);