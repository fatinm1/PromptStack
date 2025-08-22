#!/bin/bash

echo "Starting PromptStack application..."

# Set proper permissions for npm cache
export npm_config_cache=/tmp/.npm

echo "Setting up database schema..."

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push --accept-data-loss

# Seed database if environment variable is set
if [ "$SEED_DATABASE" = "true" ]; then
    echo "Seeding database..."
    npm run db:seed
fi

echo "Starting application..."
# Use the standalone server that was built
exec node server.js
