// src/config/index.ts
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL || 'postgresql://vastav:vastav@localhost:5432/identity_db',
  logLevel: process.env.LOG_LEVEL || 'info',
  rateLimiter: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10), // Default: 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),  // Default: 100 requests
  },
  security: {
    frameAncestors: process.env.FRAME_ANCESTORS || "'none'",
    contentSecurityPolicy: process.env.CONTENT_SECURITY_POLICY || "default-src 'self'",
    referrerPolicy: process.env.REFERRER_POLICY || 'no-referrer',
  },
};
