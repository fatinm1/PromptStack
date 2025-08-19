#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."

# Check if database has existing data
echo "Checking database state..."
npx prisma db push --accept-data-loss

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Try to run migrations, fallback to db push if no migrations exist
echo "Running database migrations..."
if [ -d "prisma/migrations" ] && [ "$(ls -A prisma/migrations)" ]; then
    echo "Migrations found, running migrate deploy..."
    npx prisma migrate deploy || npx prisma db push --accept-data-loss
else
    echo "No migrations found, using db push..."
    npx prisma db push --accept-data-loss
fi

# Seed database if needed (optional)
if [ "$SEED_DATABASE" = "true" ]; then
    echo "Seeding database..."
    npx prisma db seed
fi

# Start the application
echo "Starting application..."
exec node server.js
