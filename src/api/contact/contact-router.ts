import { Router } from 'express';
import { ContactController } from './contact-controller';
import { ContactService } from './contact-service';
import { validateRequest } from '../../shared/middleware';
import { contactSchema } from './contact-schema';
import rateLimit from 'express-rate-limit';

// First, create our router instance
const router = Router();

// Initialize our service and controller
const contactService = new ContactService();
const contactController = new ContactController(contactService);

// Configure rate limiter with proper settings for Express
const identifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute window
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again later',
  // Add proper IP resolution configuration
  keyGenerator: (req) => {
    // Get IP from the standard Express request
    return req.ip || 
           req.connection.remoteAddress || 
           'unknown';
  }
});

// Set up our route with middleware
router.post(
  '/identify',
  // Apply rate limiter
  identifyLimiter,
  // Validate request body against our schema
  validateRequest(contactSchema),
  // Pass the controller method directly (not as a Promise)
  contactController.identify
);

export default router;