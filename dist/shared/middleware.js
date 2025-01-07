"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.validateRequest = void 0;
const zod_1 = require("zod");
const apiError_1 = require("../utils/apiError");
const logger_1 = require("../utils/logger");
const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                next(new apiError_1.ApiError(400, error.errors[0].message));
            }
            next(error);
        }
    };
};
exports.validateRequest = validateRequest;
const errorHandler = (err, req, res, next) => {
    if (err instanceof apiError_1.ApiError) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
    logger_1.logger.error('Unhandled error:', err);
    return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=middleware.js.map