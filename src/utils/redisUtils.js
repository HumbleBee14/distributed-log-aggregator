import config from '../config/index.js';

// Key generation utilities
const getServiceKey = (serviceName) => `service:${serviceName}`;
const getLogKey = (logId) => `log:${logId}`;

export {
  getServiceKey,
  getLogKey,
  config
};