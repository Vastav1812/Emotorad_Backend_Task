import fs from 'fs/promises';
import path from 'path';
import { logger } from '../utils/logger';

export class JsonConfig {
  private static cache: Map<string, any> = new Map();

  static async load(configPath: string): Promise<any> {
    try {
      if (this.cache.has(configPath)) {
        return this.cache.get(configPath);
      }

      const fullPath = path.resolve(process.cwd(), configPath);
      const data = await fs.readFile(fullPath, 'utf-8');
      const config = JSON.parse(data);
      
      this.cache.set(configPath, config);
      return config;
    } catch (error) {
      logger.error('Error loading JSON config:', error);
      throw error;
    }
  }

  static async save(configPath: string, data: any): Promise<void> {
    try {
      const fullPath = path.resolve(process.cwd(), configPath);
      await fs.writeFile(fullPath, JSON.stringify(data, null, 2));
      this.cache.set(configPath, data);
    } catch (error) {
      logger.error('Error saving JSON config:', error);
      throw error;
    }
  }
}