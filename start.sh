#!/bin/bash

echo "Starting PromptStack application..."

# Set proper permissions for npm cache
export npm_config_cache=/tmp/.npm

# Validate required environment variables
if [ -z "$DATABASE_URL" ]; then
    echo "ERROR: DATABASE_URL environment variable is not set"
    exit 1
fi

echo "Database URL: ${DATABASE_URL:0:50}..."

echo "Setting up database schema..."

# Clean up any existing Prisma client
rm -rf node_modules/.prisma

# Force reinstall Prisma to ensure correct version
echo "Ensuring correct Prisma version..."
npm install prisma@5.22.0 @prisma/client@5.22.0

# Generate Prisma client with explicit options
echo "Generating Prisma client..."
npx prisma generate

# Wait a moment for files to be written
sleep 2

# Push database schema
echo "Setting up database schema..."
npx prisma db push --accept-data-loss

# Seed database if environment variable is set
if [ "$SEED_DATABASE" = "true" ]; then
    echo "Seeding database..."
    npm run db:seed
fi

echo "Starting application..."
# Use the standalone server that was built
exec node server.js
