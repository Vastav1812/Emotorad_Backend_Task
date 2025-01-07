import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import apiRoutes from '../api';
import { errorHandler } from '../shared/middleware';
import { securityHeaders } from '../shared/securityHeaders';
import { config } from '../config';

export default async ({ app }: { app: express.Application }) => {
  // Pre-route middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(helmet());
  app.use(compression());
  app.use(securityHeaders);

  // Routes
  app.use('/api', apiRoutes);

  // Post-route middleware
  app.use(errorHandler);

  return app;
};