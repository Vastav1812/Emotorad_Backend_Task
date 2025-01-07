import { PrismaClient, Contact } from '@prisma/client';
import { logger } from '../../utils/logger';
import { ApiError } from '../../utils/apiError';

interface ContactInput {
  email?: string;
  phoneNumber?: string;
}

interface ConsolidatedResponse {
  primaryContactId: number;
  emails: string[];
  phoneNumbers: string[];
  secondaryContactIds: number[];
}

export class ContactService {
  private prisma: PrismaClient;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // milliseconds

  constructor() {
    this.prisma = new PrismaClient();
  }

  async processIdentity(input: ContactInput): Promise<ConsolidatedResponse> {
    let retries = this.MAX_RETRIES;
    
    while (retries > 0) {
      try {
        return await this._processIdentity(input);
      } catch (error) {
        if (!this.isTransientError(error) || retries === 1) {
          logger.error('Fatal error in processIdentity', { error, input });
          throw new ApiError(500, 'Error processing identity');
        }
        retries--;
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
        logger.warn('Retrying processIdentity', { retriesLeft: retries, error });
      }
    }
    
    // TypeScript requires this but it should never be reached
    throw new ApiError(500, 'Error processing identity');
  }

  private async _processIdentity(input: ContactInput): Promise<ConsolidatedResponse> {
    const { email, phoneNumber } = input;

    // Find existing contacts
    const existingContacts = await this.prisma.contact.findMany({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(phoneNumber ? [{ phoneNumber }] : [])
        ],
        deletedAt: null
      }
    });

    logger.debug('Found existing contacts', { count: existingContacts.length });

    if (existingContacts.length === 0) {
      return await this.createNewPrimaryContact(input);
    }

    return await this.handleExistingContacts(input, existingContacts);
  }

  private async createNewPrimaryContact(input: ContactInput): Promise<ConsolidatedResponse> {
    logger.debug('Creating new primary contact', input);

    const newContact = await this.prisma.contact.create({
      data: {
        ...input,
        linkPrecedence: 'primary',
      }
    });

    return {
      primaryContactId: newContact.id,
      emails: [newContact.email].filter(Boolean) as string[],
      phoneNumbers: [newContact.phoneNumber].filter(Boolean) as string[],
      secondaryContactIds: []
    };
  }

  private async handleExistingContacts(input: ContactInput, existingContacts: Contact[]): Promise<ConsolidatedResponse> {
    return await this.prisma.$transaction(async (tx) => {
      const { email, phoneNumber } = input;
  
      logger.debug('Starting contact reconciliation', {
        inputEmail: email,
        inputPhone: phoneNumber,
        existingCount: existingContacts.length,
      });
  
      // Filter non-null email and phoneNumber values
      const emailList = existingContacts.map(c => c.email).filter((e): e is string => e !== null);
      const phoneNumberList = existingContacts.map(c => c.phoneNumber).filter((p): p is string => p !== null);
  
      // Find all related contacts
      const allRelatedContacts = await tx.contact.findMany({
        where: {
          OR: [
            ...(email ? [{ email }] : []),
            ...(phoneNumber ? [{ phoneNumber }] : []),
            {
              email: { in: emailList },
            },
            {
              phoneNumber: { in: phoneNumberList },
            },
          ],
          deletedAt: null,
        },
      });
  
      logger.debug('Related contacts found', {
        count: allRelatedContacts.length,
        relatedContacts: allRelatedContacts,
      });
  
      const primaryContacts = allRelatedContacts.filter(c => c.linkPrecedence === 'primary');
  
      let finalPrimary: Contact;
  
      // Handle case where no primary contacts exist
      if (primaryContacts.length === 0) {
        logger.warn('No primary contact found. Creating a new primary contact.', {
          inputEmail: email,
          inputPhone: phoneNumber,
        });
  
        finalPrimary = await tx.contact.create({
          data: {
            email: email || allRelatedContacts[0]?.email || null,
            phoneNumber: phoneNumber || allRelatedContacts[0]?.phoneNumber || null,
            linkPrecedence: 'primary',
          },
        });
  
        logger.debug('New primary contact created', { primaryContactId: finalPrimary.id });
      } else {
        // Select the oldest primary contact
        finalPrimary = primaryContacts.reduce((oldest, current) =>
          oldest.createdAt < current.createdAt ? oldest : current
        );
      }
  
      // Deduplicate emails, phone numbers, and secondary IDs
      const allEmails = new Set<string>();
      const allPhones = new Set<string>();
      const secondaryIds = new Set<number>();
  
      if (email) allEmails.add(email);
      if (phoneNumber) allPhones.add(phoneNumber);
  
      for (const contact of allRelatedContacts) {
        if (contact.email) allEmails.add(contact.email);
        if (contact.phoneNumber) allPhones.add(contact.phoneNumber);
  
        if (contact.id !== finalPrimary.id) {
          secondaryIds.add(contact.id);
  
          // Update the contact to point to the final primary
          await tx.contact.update({
            where: { id: contact.id },
            data: {
              linkPrecedence: 'secondary',
              linkedId: finalPrimary.id,
            },
          });
        }
      }
  
      // Create a new secondary contact if there is new information
      const hasNewEmail = email && !Array.from(allEmails).some(e => e === email);
      const hasNewPhone = phoneNumber && !Array.from(allPhones).some(p => p === phoneNumber);
  
      if (hasNewEmail || hasNewPhone) {
        const newSecondary = await tx.contact.create({
          data: {
            email,
            phoneNumber,
            linkPrecedence: 'secondary',
            linkedId: finalPrimary.id,
          },
        });
  
        secondaryIds.add(newSecondary.id);
      }
  
      logger.debug('Contact reconciliation complete', {
        primaryId: finalPrimary.id,
        emailCount: allEmails.size,
        phoneCount: allPhones.size,
        secondaryCount: secondaryIds.size,
      });
  
      // Consolidate the response
      return {
        primaryContactId: finalPrimary.id,
        emails: Array.from(allEmails),
        phoneNumbers: Array.from(allPhones),
        secondaryContactIds: Array.from(secondaryIds),
      };
    });
  }
  

  

  
  

  private isTransientError(error: any): boolean {
    // Add logic to identify transient database errors
    return error.code === 'P1000' || error.code === 'P1001' || error.code === 'P1002';
  }
}