FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip

RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

# Init hook za Railway hosting
RUN set -eux; \
    if [ -f /var/www/railway/init-app.sh ]; then \
        cp /var/www/railway/init-app.sh /usr/local/bin/init-app.sh; \
    elif [ -f /var/www/backend/railway/init-app.sh ]; then \
        cp /var/www/backend/railway/init-app.sh /usr/local/bin/init-app.sh; \
    else \
        echo "init-app.sh not found in expected location" >&2; \
        exit 1; \
    fi; \
    chmod +x /usr/local/bin/init-app.sh


RUN composer install --no-interaction --optimize-autoloader

RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
