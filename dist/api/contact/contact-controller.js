"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const apiError_1 = require("../../utils/apiError");
const logger_1 = require("../../utils/logger");
class ContactController {
    constructor(contactService) {
        this.contactService = contactService;
        this.identify = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { email, phoneNumber } = req.body;
            if (!email && !phoneNumber) {
                logger_1.logger.warn("Missing required fields", { body: req.body });
                throw new apiError_1.ApiError(400, "Either email or phoneNumber must be provided");
            }
            logger_1.logger.info("Processing identify request", { email, phoneNumber });
            const result = await this.contactService.processIdentity({
                email: email === null || email === void 0 ? void 0 : email.toLowerCase().trim(),
                phoneNumber: phoneNumber === null || phoneNumber === void 0 ? void 0 : phoneNumber.trim(),
            });
            logger_1.logger.info("Identity processed successfully", {
                primaryId: result.primaryContactId,
                secondaryCount: result.secondaryContactIds.length,
            });
            res.status(200).json({
                contact: result,
            });
        });
    }
}
exports.ContactController = ContactController;
//# sourceMappingURL=contact-controller.js.map