const config = {
  port: process.env.PORT || 3000,
  redis: {
    username: process.env.REDIS_USERNAME || 'default',
    password: process.env.REDIS_PASSWORD,
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
  logExpirySeconds: parseInt(process.env.LOG_EXPIRY_SECONDS || '3600') // 1 hr
};

export default config;