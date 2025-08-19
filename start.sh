#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."
npx prisma db push --accept-data-loss

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Seed database if needed (optional)
if [ "$SEED_DATABASE" = "true" ]; then
    echo "Seeding database..."
    npx prisma db seed
fi

# Start the application
echo "Starting application..."
exec node server.js
