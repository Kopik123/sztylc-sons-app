# Deploy plan (UK) – VPS + Nginx + SSL

## Minimalny setup serwera
- Ubuntu 22.04/24.04
- Nginx
- PHP-FPM 8.2+
- MySQL/MariaDB
- Certbot (Let's Encrypt)
- Git + Composer + Node (na build) lub build lokalnie i upload

## Domeny
- `sztylcsons.co.uk` -> frontend (React build)
- `api.sztylcsons.co.uk` -> Laravel API

## Kroki (skrót)
1) Ustaw DNS (A/AAAA) na VPS
2) Zainstaluj Nginx + PHP-FPM + MySQL
3) Wgraj backend do `/var/www/api`
4) Skonfiguruj `.env` prod + `php artisan migrate --force`
5) Ustaw Nginx vhost dla API
6) Wgraj frontend build do `/var/www/site`
7) Ustaw Nginx vhost dla strony
8) SSL: certbot dla obu domen
9) Cron backup DB + logrotate
