# Stage 1: Build the app
FROM node:18 AS build

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript application
RUN npm run build

# Stage 2: Production image
FROM node:18

# Set working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

# Install only production dependencies
RUN npm install --production

# Copy the .env file into the container
COPY .env .env

# Expose the port the app runs on
EXPOSE 3000

# Set the default command to start the app
CMD ["node", "dist/index.js"]
