"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helper = void 0;
class Helper {
    static async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    static sanitizePhoneNumber(phone) {
        return phone.replace(/[^\d+]/g, '');
    }
    static generateRandomString(length) {
        return Math.random().toString(36).substring(2, length + 2);
    }
    static chunk(array, size) {
        return Array.from({ length: Math.ceil(array.length / size) }, (_, i) => array.slice(i * size, i * size + size));
    }
}
exports.Helper = Helper;
//# sourceMappingURL=helper.js.map