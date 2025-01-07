"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const api_1 = __importDefault(require("../api"));
const middleware_1 = require("../shared/middleware");
const securityHeaders_1 = require("../shared/securityHeaders");
exports.default = async ({ app }) => {
    // Pre-route middleware
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cors_1.default)());
    app.use((0, helmet_1.default)());
    app.use((0, compression_1.default)());
    app.use(securityHeaders_1.securityHeaders);
    // Routes
    app.use('/api', api_1.default);
    // Post-route middleware
    app.use(middleware_1.errorHandler);
    return app;
};
//# sourceMappingURL=express.js.map