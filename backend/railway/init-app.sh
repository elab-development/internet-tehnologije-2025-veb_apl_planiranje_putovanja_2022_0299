#!/bin/sh

set -e

if [ -f /var/www/artisan ]; then
    cd /var/www
elif [ -f /var/www/backend/artisan ]; then
    cd /var/www/backend
else
    echo "artisan file not found under /var/www or /var/www/backend" >&2
    exit 1
fi

php artisan migrate --force

php artisan optimize:clear

php artisan config:cache
php artisan event:cache
php artisan route:cache
php artisan view:cache
