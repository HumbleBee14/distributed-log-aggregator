import express from 'express';
import bodyParser from 'body-parser';
import logRoutes from './routes/logRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(bodyParser.json());

app.use('/', logRoutes);

app.use(errorHandler);

export default app;