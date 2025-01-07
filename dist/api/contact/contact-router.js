"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_controller_1 = require("./contact-controller");
const contact_service_1 = require("./contact-service");
const middleware_1 = require("../../shared/middleware");
const contact_schema_1 = require("./contact-schema");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// First, create our router instance
const router = (0, express_1.Router)();
// Initialize our service and controller
const contactService = new contact_service_1.ContactService();
const contactController = new contact_controller_1.ContactController(contactService);
// Configure rate limiter with proper settings for Express
const identifyLimiter = (0, express_rate_limit_1.default)({
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
router.post('/identify', 
// Apply rate limiter
identifyLimiter, 
// Validate request body against our schema
(0, middleware_1.validateRequest)(contact_schema_1.contactSchema), 
// Pass the controller method directly (not as a Promise)
contactController.identify);
exports.default = router;
//# sourceMappingURL=contact-router.js.map