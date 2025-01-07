"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaClient = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("./utils/logger");
exports.prismaClient = new client_1.PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query',
        },
        {
            emit: 'event',
            level: 'error',
        },
        {
            emit: 'event',
            level: 'info',
        },
        {
            emit: 'event',
            level: 'warn',
        },
    ],
});
// Log database queries in development
if (process.env.NODE_ENV === 'development') {
    exports.prismaClient.$on('query', (e) => {
        logger_1.logger.debug('Query: ' + e.query);
        logger_1.logger.debug('Params: ' + e.params);
        logger_1.logger.debug('Duration: ' + e.duration + 'ms');
    });
}
exports.prismaClient.$on('error', (e) => {
    logger_1.logger.error('Database error:', e);
});
exports.default = exports.prismaClient;
//# sourceMappingURL=prismaClient.js.map