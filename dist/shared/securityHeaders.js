"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityHeaders = void 0;
const constants_1 = require("../loaders/constants");
const securityHeaders = (req, res, next) => {
    // Content Security Policy
    res.setHeader('Content-Security-Policy', constants_1.constants.SECURITY_HEADERS.CONTENT_SECURITY_POLICY);
    // Prevent clickjacking
    res.setHeader('X-Frame-Options', constants_1.constants.SECURITY_HEADERS.FRAME_ANCESTORS);
    // Referrer Policy
    res.setHeader('Referrer-Policy', constants_1.constants.SECURITY_HEADERS.REFERRER_POLICY);
    // XSS Protection
    res.setHeader('X-XSS-Protection', '1; mode=block');
    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // HSTS (uncomment in production with valid HTTPS)
    // res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
};
exports.securityHeaders = securityHeaders;
//# sourceMappingURL=securityHeaders.js.map