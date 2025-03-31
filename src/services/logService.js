import { v4 as uuidv4 } from 'uuid';
import redisClient from './redis.js';
import { getServiceKey, getLogKey, config } from '../utils/redisUtils.js';


async function storeLog(logData) {
  const { service_name, timestamp, message } = logData;
  
  // Unique ID for log entry
  const logId = uuidv4();
  const logKey = getLogKey(logId);
  const serviceKey = getServiceKey(service_name);
  
  const logEntry = {
    service_name,
    timestamp,
    message,
    created_at: Date.now().toString()
  };
  
  const pipeline = redisClient.multi();
  
  // storing log entry as a hash
  pipeline.hSet(logKey, logEntry);

  pipeline.expire(logKey, config.logExpirySeconds);

  const timestampScore = new Date(timestamp).getTime();
  pipeline.zAdd(serviceKey, { score: timestampScore, value: logId });

  pipeline.expire(serviceKey, config.logExpirySeconds);

  await pipeline.exec();
  
  return {
    id: logId,
    status: 'success'
  };
}


async function queryLogs(service, start, end) {
  const serviceKey = getServiceKey(service);
  
  // Converting timestamps to scores for Redis sorted set range query
  const startScore = start ? new Date(start).getTime() : 0;
  const endScore = end ? new Date(end).getTime() : Infinity;
  
  const logIds = await redisClient.zRangeByScore(serviceKey, startScore, endScore);
  
  if (!logIds.length) {
    return [];
  }
  
  const pipeline = redisClient.multi();
  
  logIds.forEach(logId => {
    pipeline.hGetAll(getLogKey(logId));
  });
  
  const results = await pipeline.exec();
  
  const logs = (results || [])
    .map(result => result)
    .filter(log => log !== null && Object.keys(log).length > 0)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  return logs.map(log => ({
    timestamp: log.timestamp,
    message: log.message
  }));
}

export {
  storeLog,
  queryLogs
};