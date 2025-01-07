export class Helper {
	static async sleep(ms: number): Promise<void> {
	  return new Promise(resolve => setTimeout(resolve, ms));
	}
  
	static isValidEmail(email: string): boolean {
	  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	  return emailRegex.test(email);
	}
  
	static sanitizePhoneNumber(phone: string): string {
	  return phone.replace(/[^\d+]/g, '');
	}
  
	static generateRandomString(length: number): string {
	  return Math.random().toString(36).substring(2, length + 2);
	}
  
	static chunk<T>(array: T[], size: number): T[][] {
	  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
		array.slice(i * size, i * size + size)
	  );
	}
  }