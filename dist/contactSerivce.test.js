"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../src/index"); // Assuming your server is in `src/index.ts`
describe('Contact Service Tests', () => {
    it('should create a new primary contact', async () => {
        const response = await (0, supertest_1.default)(index_1.app)
            .post('/api/contacts/identify')
            .send({ email: 'newuser@example.com', phoneNumber: '1234567890' });
        expect(response.status).toBe(200);
        expect(response.body.contact).toEqual({
            primaryContactId: expect.any(Number),
            emails: ['newuser@example.com'],
            phoneNumbers: ['1234567890'],
            secondaryContactIds: []
        });
    });
    it('should add a new secondary contact to the same primary', async () => {
        const response = await (0, supertest_1.default)(index_1.app)
            .post('/api/contacts/identify')
            .send({ email: 'newuser@example.com', phoneNumber: '9876543210' });
        expect(response.status).toBe(200);
        expect(response.body.contact.emails).toContain('newuser@example.com');
        expect(response.body.contact.phoneNumbers).toContain('9876543210');
        expect(response.body.contact.secondaryContactIds).toEqual(expect.arrayContaining([expect.any(Number)]));
    });
    it('should consolidate overlapping primary contacts', async () => {
        const response = await (0, supertest_1.default)(index_1.app)
            .post('/api/contacts/identify')
            .send({ email: 'anotheruser@example.com', phoneNumber: '1234567890' });
        expect(response.status).toBe(200);
        expect(response.body.contact.primaryContactId).toEqual(1);
        expect(response.body.contact.emails).toEqual(expect.arrayContaining(['newuser@example.com', 'anotheruser@example.com']));
        expect(response.body.contact.secondaryContactIds.length).toBeGreaterThan(0);
    });
    it('should handle edge cases with missing email or phone', async () => {
        const response = await (0, supertest_1.default)(index_1.app)
            .post('/api/contacts/identify')
            .send({ phoneNumber: '1111111111' });
        expect(response.status).toBe(200);
        expect(response.body.contact).toEqual({
            primaryContactId: expect.any(Number),
            emails: [],
            phoneNumbers: ['1111111111'],
            secondaryContactIds: []
        });
    });
    it('should return error for invalid input', async () => {
        const response = await (0, supertest_1.default)(index_1.app)
            .post('/api/contacts/identify')
            .send({ email: 12345, phoneNumber: false });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: 'fail',
            message: 'Expected string, received number'
        });
    });
    it('should return existing primary contact without duplicates', async () => {
        const response = await (0, supertest_1.default)(index_1.app)
            .post('/api/contacts/identify')
            .send({ email: 'newuser@example.com', phoneNumber: '1234567890' });
        expect(response.status).toBe(200);
        expect(response.body.contact.primaryContactId).toEqual(1);
        expect(response.body.contact.secondaryContactIds.length).toBeGreaterThan(0);
    });
    it('should create a standalone primary contact', async () => {
        const response = await (0, supertest_1.default)(index_1.app)
            .post('/api/contacts/identify')
            .send({ email: 'newstandalone@example.com', phoneNumber: '2222222222' });
        expect(response.status).toBe(200);
        expect(response.body.contact).toEqual({
            primaryContactId: expect.any(Number),
            emails: ['newstandalone@example.com'],
            phoneNumbers: ['2222222222'],
            secondaryContactIds: []
        });
    });
});
//# sourceMappingURL=contactSerivce.test.js.map