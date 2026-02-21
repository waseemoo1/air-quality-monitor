#!/bin/sh
set -e

echo "Running Prisma database migrations..."

npx prisma migrate deploy --schema=./prisma/schema.prisma

echo "Starting the microservice..."

exec "$@"