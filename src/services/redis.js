import { createClient } from 'redis';
import config from '../config/index.js';

const redisClient = createClient({
  username: config.redis.username,
  password: config.redis.password,
  socket: {
    host: config.redis.host,
    port: config.redis.port
  }
});

redisClient.on('error', err => {
  console.error('Redis Client Error', err);
});

export default redisClient;