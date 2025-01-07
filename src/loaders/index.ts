import expressLoader from './express';
import { logger } from '../utils/logger';
import { prismaClient } from '../prismaClient';

export default async ({ expressApp }: { expressApp: any }) => {
  try {
    // Initialize database connection
    await prismaClient.$connect();
    logger.info('✅ Database connection established');

    // Initialize express app
    await expressLoader({ app: expressApp });
    logger.info('✅ Express initialized');

    // Additional loaders can be added here (e.g., cache, message queue)
  } catch (error) {
    logger.error('❌ Error during application initialization:', error);
    throw error;
  }
};