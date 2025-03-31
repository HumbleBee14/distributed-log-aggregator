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
  
  // storing log entry as a hash
  await redisClient.hSet(logKey, logEntry);
  
  // expiry for log entry
  await redisClient.expire(logKey, config.logExpirySeconds);
  
  // Adding the log ID to a sorted set for this service, using timestamp as score for ordering
  const timestampScore = new Date(timestamp).getTime();
  await redisClient.zAdd(serviceKey, { score: timestampScore, value: logId });
  
  // seeting expiry for service set
  await redisClient.expire(serviceKey, config.logExpirySeconds);
  
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
  
  const logs = [];
  for (const logId of logIds) {
    const log = await redisClient.hGetAll(getLogKey(logId));
    if (log && Object.keys(log).length > 0) {
      logs.push(log);
    }
  }
  
  logs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  return logs.map(log => ({
    timestamp: log.timestamp,
    message: log.message
  }));
}

export {
  storeLog,
  queryLogs
};