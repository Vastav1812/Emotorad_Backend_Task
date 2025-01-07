import { Request, Response, NextFunction } from 'express';
import { constants } from '../loaders/constants';

export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    constants.SECURITY_HEADERS.CONTENT_SECURITY_POLICY
  );

  // Prevent clickjacking
  res.setHeader('X-Frame-Options', constants.SECURITY_HEADERS.FRAME_ANCESTORS);

  // Referrer Policy
  res.setHeader('Referrer-Policy', constants.SECURITY_HEADERS.REFERRER_POLICY);

  // XSS Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // HSTS (uncomment in production with valid HTTPS)
  // res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  next();
};