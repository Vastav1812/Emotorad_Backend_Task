"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactSchema = void 0;
const zod_1 = require("zod");
// Phone number regex (simple version - enhance based on your needs)
const PHONE_REGEX = /^\+?[\d\s-]{10,}$/;
exports.contactSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        email: zod_1.z.string().email().trim().optional(),
        phoneNumber: zod_1.z
            .string()
            .regex(PHONE_REGEX, "Invalid phone number format")
            .trim()
            .optional(),
    })
        .refine((data) => data.email || data.phoneNumber, {
        message: "Either email or phoneNumber must be provided",
    }),
});
//# sourceMappingURL=contact-schema.js.map