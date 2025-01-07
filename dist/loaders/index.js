"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("./express"));
const logger_1 = require("../utils/logger");
const prismaClient_1 = require("../prismaClient");
exports.default = async ({ expressApp }) => {
    try {
        // Initialize database connection
        await prismaClient_1.prismaClient.$connect();
        logger_1.logger.info('✅ Database connection established');
        // Initialize express app
        await (0, express_1.default)({ app: expressApp });
        logger_1.logger.info('✅ Express initialized');
        // Additional loaders can be added here (e.g., cache, message queue)
    }
    catch (error) {
        logger_1.logger.error('❌ Error during application initialization:', error);
        throw error;
    }
};
//# sourceMappingURL=index.js.map