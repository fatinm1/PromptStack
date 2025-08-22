# Use Node.js 18 with Debian slim base
FROM node:18-slim AS base

# Install system dependencies
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

# Create a non-root user
RUN groupadd -r nextjs && useradd -r -g nextjs nextjs

# Copy the standalone output
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nextjs /app/public ./public

# Copy Prisma files
COPY --from=builder --chown=nextjs:nextjs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nextjs /app/node_modules/.prisma ./node_modules/.prisma

# Copy start script
COPY start.sh ./
RUN chmod +x start.sh

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 8080

# Set environment variables
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["./start.sh"]
