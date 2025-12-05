#!/bin/sh
set -e

echo "Waiting for MySQL to be ready..."
until nc -z -v -w30 shoppingcart_db 3306
do
  echo "Waiting for database connection..."
  sleep 2
done

echo "MySQL is up - executing migrations"
yarn migration:run

echo "Starting application..."
exec "$@"
