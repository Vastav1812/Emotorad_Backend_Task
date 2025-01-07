
# Emotorad Backend Task: Identity Reconciliation

## Overview
This project implements a backend service for managing and reconciling customer identity across multiple purchases. It identifies and consolidates contact information (emails and phone numbers) into a single "primary" contact.

### **Features**
- Create new primary contacts when no matching contact exists.
- Consolidate contact details across purchases when overlapping information is provided.
- Handle scenarios where primary contacts are transformed into secondary contacts.
- Perform efficient database operations for identity reconciliation.
- Includes comprehensive testing for edge cases.

---

## **Tech Stack Used**

### **Backend Framework**
- **Node.js**: JavaScript runtime used for building the backend.
- **Express.js**: Web framework for building RESTful APIs.

### **Database**
- **PostgreSQL**: Relational database management system for storing contact information.

### **ORM**
- **Prisma**: Type-safe ORM (Object-Relational Mapping) tool to interact with the PostgreSQL database.

### **Programming Language**
- **TypeScript**: Superset of JavaScript with type safety for better maintainability and error checking.

### **Testing**
- **Jest**: Testing framework used for writing and running test cases.
- **Supertest**: Library for testing HTTP endpoints.

### **Middleware**
- **Helmet**: Secures Express apps by setting various HTTP headers.
- **Compression**: Middleware for gzip compression of HTTP responses.
- **CORS**: Middleware for handling Cross-Origin Resource Sharing.
- **Express Rate Limit**: Middleware for rate limiting API requests.

### **Environment Management**
- **dotenv**: Used for loading environment variables from a `.env` file.

### **Logging**
- **Winston**: Logging library for structured and configurable logging.

### **Validation**
- **Zod**: Schema-based validation for request payloads.

### **Containerization**
- **Docker**: Used to containerize the application and database for deployment.

### **Task Scheduling and Seeding**
- **Prisma Seeder**: For populating the database with initial seed data.

### **Code Quality Tools**
- **ESLint**: For linting and enforcing code style guidelines.
- **Prettier**: Code formatter for maintaining consistent formatting.

### **Build Tools**
- **ts-node**: Used to run TypeScript files directly during development.
- **ts-node-dev**: Development tool for live-reloading TypeScript files.

---

## **Setup Instructions**

### **1. Prerequisites**
- Node.js (v18+)
- PostgreSQL (configured via `.env`)
- Docker (optional, for containerized setup)

### **2. Clone the Repository**
```bash
git clone https://github.com/Vastav1812/Emotorad_Backend_Task.git
cd Emotorad_Backend_Task
