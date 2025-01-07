"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const client_1 = require("@prisma/client");
class ContactService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async processIdentity(input) {
        const { email, phoneNumber } = input;
        const existingContacts = await this.prisma.contact.findMany({
            where: {
                OR: [
                    ...(email ? [{ email }] : []),
                    ...(phoneNumber ? [{ phoneNumber }] : []),
                ],
                deletedAt: null,
            },
        });
        if (existingContacts.length === 0) {
            const newContact = await this.prisma.contact.create({
                data: {
                    email,
                    phoneNumber,
                    linkPrecedence: client_1.LinkPrecedence.primary,
                },
            });
            return {
                primaryContactId: newContact.id,
                emails: [email].filter(Boolean),
                phoneNumbers: [phoneNumber].filter(Boolean),
                secondaryContactIds: [],
            };
        }
        return await this.prisma.$transaction(async (tx) => {
            const primaryContacts = existingContacts.filter((c) => c.linkPrecedence === client_1.LinkPrecedence.primary);
            const oldestPrimary = primaryContacts.reduce((oldest, current) => oldest.createdAt < current.createdAt ? oldest : current);
            const allEmails = new Set();
            const allPhones = new Set();
            const secondaryIds = new Set();
            if (email)
                allEmails.add(email);
            if (phoneNumber)
                allPhones.add(phoneNumber);
            for (const contact of existingContacts) {
                if (contact.email)
                    allEmails.add(contact.email);
                if (contact.phoneNumber)
                    allPhones.add(contact.phoneNumber);
                if (contact.id !== oldestPrimary.id) {
                    secondaryIds.add(contact.id);
                    if (contact.linkPrecedence === client_1.LinkPrecedence.primary) {
                        await tx.contact.update({
                            where: { id: contact.id },
                            data: {
                                linkPrecedence: client_1.LinkPrecedence.secondary,
                                linkedId: oldestPrimary.id,
                            },
                        });
                    }
                }
            }
            if ((email && !existingContacts.some((c) => c.email === email)) ||
                (phoneNumber &&
                    !existingContacts.some((c) => c.phoneNumber === phoneNumber))) {
                const newSecondary = await tx.contact.create({
                    data: {
                        email,
                        phoneNumber,
                        linkPrecedence: client_1.LinkPrecedence.secondary,
                        linkedId: oldestPrimary.id,
                    },
                });
                secondaryIds.add(newSecondary.id);
            }
            return {
                primaryContactId: oldestPrimary.id,
                emails: Array.from(allEmails),
                phoneNumbers: Array.from(allPhones),
                secondaryContactIds: Array.from(secondaryIds),
            };
        });
    }
}
exports.ContactService = ContactService;
//# sourceMappingURL=contact-service.js.map