import { z } from "zod";

// Phone number regex (simple version - enhance based on your needs)
const PHONE_REGEX = /^\+?[\d\s-]{10,}$/;

export const contactSchema = z.object({
  body: z
    .object({
      email: z.string().email().trim().optional(),
      phoneNumber: z
        .string()
        .regex(PHONE_REGEX, "Invalid phone number format")
        .trim()
        .optional(),
    })
    .refine((data) => data.email || data.phoneNumber, {
      message: "Either email or phoneNumber must be provided",
    }),
});
