# ── Stage 1: instalar dependencias PHP ────────────────────────
FROM composer:2.7 AS composer_builder

WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-scripts --prefer-dist --ignore-platform-reqs
COPY . .
RUN composer dump-autoload --optimize --ignore-platform-reqs

# ── Stage 2: imagen final PHP-FPM ────────────────────────────
FROM php:8.4-fpm-alpine

RUN apk add --no-cache libpng-dev libjpeg-turbo-dev libzip-dev icu-dev oniguruma-dev \
    && docker-php-ext-install pdo pdo_mysql bcmath mbstring zip gd intl opcache

WORKDIR /var/www/html

COPY --from=composer_builder /app/vendor ./vendor
COPY --from=composer_builder /app .

RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]