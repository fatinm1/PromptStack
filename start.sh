#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Push database schema (creates tables if they don't exist)
echo "Setting up database schema..."
npx prisma db push --accept-data-loss

# Seed database if needed (optional)
if [ "$SEED_DATABASE" = "true" ]; then
    echo "Seeding database..."
    npm run db:seed
fi

# Start the application
echo "Starting application..."
exec node server.js
