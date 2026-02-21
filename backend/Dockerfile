# Base image
FROM node:18-alpine

# Working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
# Copy prisma directory for generation
COPY prisma ./prisma/

RUN npm install

# Copy source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build
RUN npm run build

# Expose port
EXPOSE 3000

# Start command (Migrate deploy then start)
# Note: In production, migration usually happens separately, but for simple NAS deploy, we can chain it.
CMD [ "sh", "-c", "npx prisma migrate deploy && node dist/main" ]
