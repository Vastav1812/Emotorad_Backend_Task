"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const constants_1 = require("../loaders/constants");
exports.rateLimiter = (0, express_rate_limit_1.default)({
    windowMs: constants_1.constants.RATE_LIMIT_WINDOW,
    max: constants_1.constants.RATE_LIMIT_MAX_REQUESTS,
    message: {
        status: 'error',
        message: 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
//# sourceMappingURL=rateLimiter.js.map