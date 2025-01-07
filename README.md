
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
```

### **3. Install Dependencies**
```bash

npm install
```
### **4. Configure Environment Variables**
Create a .env file in the root directory:
```makefile

DATABASE_URL="postgresql://<username>:<password>@localhost:5432/identity_db"
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100
Replace <username> and <password> with your PostgreSQL credentials.
```
### **5. Run Migrations and Seed Database**
```bash

npx prisma migrate dev
npx prisma db seed
```
### **6. Start the Application**
```bash

npm run dev
```

### **1. New Data with No Matches**
Send a request where neither the email nor the phoneNumber matches any existing record.
cURL Command:
```bash

curl -X POST http://localhost:3000/api/contacts/identify \
-H "Content-Type: application/json" \
-d '{"email": "newuser@example.com"
,
"phoneNumber": "1234567890"}'
```
Expected Response:
```json

{
"primaryContactId": 1,
"emails": ["newuser@example.com"],
"phoneNumbers": ["1234567890"],
"secondaryContactIds": []
}
```

### **2. Matching email but New phoneNumber**

Send a request where the email matches an existing contact, but the phoneNumber is new.

cURL Command:
```bash

curl -X POST http://localhost:3000/api/contacts/identify \
-H "Content-Type: application/json" \
-d '{"email": "newuser@example.com"
,
"phoneNumber": "9876543210"}'
```
Expected Response:
```json

{
"primaryContactId": 1,
"emails": ["newuser@example.com"],
"phoneNumbers": ["1234567890","9876543210"],
,
"secondaryContactIds": [2]
"9876543210"],
}
```

### **3. Matching phoneNumber but New email**

Send a request where the phoneNumber matches an existing contact, but the email is new.

cURL Command:
```bash

curl -X POST http://localhost:3000/api/contacts/identify \
-H "Content-Type: application/json" \
-d '{"email": "anotheruser@example.com"
,
"phoneNumber": "1234567890"}'
```
Expected Response:
```json

{
"primaryContactId": 1,
"emails": ["newuser@example.com","anotheruser@example.com"],
"phoneNumbers": ["1234567890"
,"9876543210"],
"secondaryContactIds": [2, 3]
}
```

### **4. Overlapping Data**

Send a request where the email matches one primary contact and the phoneNumber matches
another.

cURL Command:
```bash

curl -X POST http://localhost:3000/api/contacts/identify \
-H "Content-Type: application/json" \
-d '{"email": "newuser@example.com"
,
"phoneNumber": "1111111111"}'
```
Expected Response:
```json

{
"primaryContactId": 1,
"emails": ["newuser@example.com",
"anotheruser@example.com"],
"phoneNumbers": ["1234567890"
,"9876543210","1111111111"],
"secondaryContactIds": [2, 3, 4]
}
```

### **5. Duplicate Request**

Send a duplicate request with the same email and phoneNumber.

cURL Command:
```bash

curl -X POST http://localhost:3000/api/contacts/identify \
-H "Content-Type: application/json" \
-d '{"email": "newuser@example.com"
,
"phoneNumber": "1234567890"}'
```
Expected Response:
```json

{
"primaryContactId": 1,
"emails": ["newuser@example.com"
"phoneNumbers": ["1234567890"
,
"secondaryContactIds": [2, 3, 4]
,
"anotheruser@example.com"],
"9876543210"
,
"1111111111"],
}
```

### **6. New Completely Unrelated Data**
Send a request where both the email and phoneNumber do not match any existing record.
cURL Command:
```bash

curl -X POST http://localhost:3000/api/contacts/identify \
-H "Content-Type: application/json" \
-d '{"email": "newcontact@example.com"
,
"phoneNumber": "2222222222"}'
```
Expected Response:
```json

{
"primaryContactId": 5,
"emails": ["newcontact@example.com"],
"phoneNumbers": ["2222222222"],
"secondaryContactIds": []
}
```

### **7. Empty Payload**
Send a request with an empty payload to ensure proper validation.
cURL Command:
```bash

curl -X POST http://localhost:3000/api/contacts/identify \
-H "Content-Type: application/json" \
-d '{}'
```
Expected Response:
```json

{
"status": "fail"
,
"message": "Either email or phoneNumber must be provided"
}
```

### **8. Invalid Payload**
Send a request with invalid data types for email and phoneNumber.
cURL Command:
```bash

curl -X POST http://localhost:3000/api/contacts/identify \
-H "Content-Type: application/json" \
-d '{"email": 12345,
"phoneNumber": false}'
```
Expected Response:
```json

{
"status": "fail"
,
"message": "Expected string, received number"
}
```

### **9. Partially Empty Data**
Send a request with only email or phoneNumber to verify it handles partial data.

Email Only:

```bash

curl -X POST http://localhost:3000/api/contacts/identify \
-H "Content-Type: application/json" \
-d '{"email": "partialuser@example.com"}'
```
Expected Response:

```json

{
"primaryContactId": 6,
"emails": ["partialuser@example.com"],
"phoneNumbers": [],
"secondaryContactIds": []
}
```
Phone Only:
```bash

curl -X POST http://localhost:3000/api/contacts/identify \
-H "Content-Type: application/json" \
-d '{"phoneNumber": "3333333333"}'
```
Expected Response:

```json

{
"primaryContactId": 7,
"emails": [],
"phoneNumbers": ["3333333333"],
"secondaryContactIds": []
}
```
