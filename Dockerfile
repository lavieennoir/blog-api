# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript code
RUN npm run build

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./

# Install production dependencies only
ENV HUSKY=0
ENV CI=true
RUN npm ci --only=production --ignore-scripts

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env ./
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Create logs directory
RUN mkdir -p logs

# Set environment variables
ENV NODE_ENV=production

# Create startup script
RUN printf '#!/bin/sh\nnpx prisma migrate deploy\nnode dist/app.js\n' > /app/start.sh && \
    chmod +x /app/start.sh

# Expose port
EXPOSE 3000

# Start the application
CMD ["/app/start.sh"] 