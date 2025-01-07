"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonConfig = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../utils/logger");
class JsonConfig {
    static async load(configPath) {
        try {
            if (this.cache.has(configPath)) {
                return this.cache.get(configPath);
            }
            const fullPath = path_1.default.resolve(process.cwd(), configPath);
            const data = await promises_1.default.readFile(fullPath, 'utf-8');
            const config = JSON.parse(data);
            this.cache.set(configPath, config);
            return config;
        }
        catch (error) {
            logger_1.logger.error('Error loading JSON config:', error);
            throw error;
        }
    }
    static async save(configPath, data) {
        try {
            const fullPath = path_1.default.resolve(process.cwd(), configPath);
            await promises_1.default.writeFile(fullPath, JSON.stringify(data, null, 2));
            this.cache.set(configPath, data);
        }
        catch (error) {
            logger_1.logger.error('Error saving JSON config:', error);
            throw error;
        }
    }
}
exports.JsonConfig = JsonConfig;
JsonConfig.cache = new Map();
//# sourceMappingURL=jsonConfig.js.map