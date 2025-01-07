import { Router } from 'express';
import { ContactController } from './contact-controller';
import { ContactService } from './contact-service';
import { validateRequest } from '../../shared/middleware';
import { contactSchema } from './contact-schema';

// First, create our router instance
const router = Router();

// Initialize our service and controller
const contactService = new ContactService();
const contactController = new ContactController(contactService);

// Set up our route with middleware
router.post(
  '/identify',
  // Validate request body against our schema
  validateRequest(contactSchema),
  // Pass the controller method directly (not as a Promise)
  contactController.identify
);

export default router;
