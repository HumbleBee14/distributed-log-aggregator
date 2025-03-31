import express from 'express';
import { storeLog, queryLogs } from '../services/logService.js';

const router = express.Router();

// Log ingestion
router.post('/logs', async (req, res, next) => {
  try {
    const { service_name, timestamp, message } = req.body;
    
    if (!service_name || !timestamp || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const result = await storeLog(req.body);
    
    res.status(201).json({ 
      status: result.status, 
      message: 'Log entry created', 
      id: result.id 
    });
  } catch (error) {
    next(error);
  }
});

// Log query - GET /logs?service=<service_name>&start=<timestamp>&end=<timestamp>
router.get('/logs', async (req, res, next) => {
  try {
    const { service, start, end } = req.query;
    
    if (!service) {
      return res.status(400).json({ error: 'Service name is required' });
    }
    
    const logs = await queryLogs(service, start, end);
    res.json(logs);
  } catch (error) {
    next(error);
  }
});

router.get('/health', (req, res) => {
  res.json({ status: 'UP', timestamp: new Date().toISOString() });
});

export default router;