'use strict';
import dotenv from 'dotenv';
dotenv.config();
import express, { Express } from 'express';
import cors from 'cors';
import pino from 'pino-http';
import router from './routers';
import logger from './config/logger';

const app: Express = express();

app.use(pino({ ...logger, enabled: process.env.NODE_ENV !== 'test' }));
app.use(
  express.json({
    verify: (req, _, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(cors());

app.use('/api/', router);

export default app;
