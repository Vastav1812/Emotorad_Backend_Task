import { Request, Response } from 'express';
import { ContactService } from './contact-service';
import { catchAsync } from '../../utils/catchAsync';
import { ApiError } from '../../utils/apiError';
import { logger } from '../../utils/logger';

export class ContactController {
  constructor(private contactService: ContactService) {}

  identify = catchAsync(async (req: Request, res: Response) => {
    const { email, phoneNumber } = req.body;
    
    // Double validation in case middleware fails
    if (!email && !phoneNumber) {
      logger.warn('Missing required fields', { body: req.body });
      throw new ApiError(400, 'Either email or phoneNumber must be provided');
    }

    logger.info('Processing identify request', { email, phoneNumber });
    
    const result = await this.contactService.processIdentity({ 
      email: email?.toLowerCase().trim(),  // Normalize email
      phoneNumber: phoneNumber?.trim()     // Normalize phone
    });
    
    logger.info('Identity processed successfully', { 
      primaryId: result.primaryContactId,
      secondaryCount: result.secondaryContactIds.length 
    });

    res.status(200).json({
      contact: result
    });
  });
}