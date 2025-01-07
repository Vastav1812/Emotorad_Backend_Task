// src/types/index.ts
export interface ContactInput {
    email?: string;
    phoneNumber?: string;
  }
  
  export interface ConsolidatedResponse {
    primaryContactId: number;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: number[];
  }
  
  export interface PaginationOptions {
    page?: number;
    pageSize?: number;
  }
  
  export interface ApiResponse<T> {
    status: string;
    message?: string;
    data?: T;
  }
  