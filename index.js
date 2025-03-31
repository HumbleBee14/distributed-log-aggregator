const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('redis');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const config = {
    port: process.env.PORT || 3000,
    redis: {
      username: process.env.REDIS_USERNAME || 'default',
      password: process.env.REDIS_PASSWORD || 'UjR0RC6lhSBFq7WFVyEQEpQlonT0rg1P',
      host: process.env.REDIS_HOST || 'redis-18680.c10.us-east-1-2.ec2.redns.redis-cloud.com',
      port: parseInt(process.env.REDIS_PORT || '18680'),
    },
    logExpirySeconds: parseInt(process.env.LOG_EXPIRY_SECONDS || '3600') // 1 hr
};

const app = express();
app.use(bodyParser.json());


const redis = createClient({
    username: config.redis.username,
    password: config.redis.password,
    socket: {
      host: config.redis.host,
      port: config.redis.port
    }
});

redis.on('error', err => console.log('Redis Client Error', err));



async function connectToRedis() {
    try {
      await redis.connect();
      console.log(`Connected to Redis at ${config.redis.host}:${config.redis.port}`);
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      process.exit(1);
    }
}



app.get('/health', (req, res) => {
    res.json({ status: 'UP', timestamp: new Date().toISOString() });
});

async function startApp() {
    await connectToRedis();
    
    app.listen(config.port, () => {
      console.log(`Log aggregation service listening on port ${config.port}`);
    });
}

startApp().catch(error => {
    console.error('Failed to start application:', error);
    process.exit(1);
});