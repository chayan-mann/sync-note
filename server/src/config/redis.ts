import { createClient } from 'redis';

export const redisClient = createClient({
    url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

export const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log('Redis Connected...');
    } catch (err: any) {
        console.error(err.message);
        process.exit(1);
    }
};