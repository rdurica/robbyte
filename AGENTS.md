# Agent Context for Robbyte

## Stack

- **Backend**: PHP 8.5+, FrankenPHP (Caddy-powered PHP server)
- **Frontend**: Vite, Node.js 20+
- **Framework**: Symfony 7.3
- **Database**: PostgreSQL (recommended), MySQL/MariaDB, SQLite
- **Cache/Sessions/Queue**: Redis
- **Infrastructure**: Docker (FrankenPHP)

## Dev Environment

All development runs inside Docker containers via `docker compose`.

| Command               | Description                                          |
| --------------------- | ---------------------------------------------------- |
| `make init`           | First-time setup: network, images, containers        |
| `make up`             | Start containers detached                            |
| `make down`           | Stop containers                                      |
| `make logs`           | Stream logs                                          |
| `make php`            | Shell into FrankenPHP container                      |

**All `bin/console`, `composer`, and `npm` commands must run inside containers:**

```shell
docker compose exec portfolio bin/console <cmd>
docker compose exec portfolio composer <cmd>
docker compose exec portfolio npm <cmd>
```

## Key Commands

```shell
# Setup (inside container)
composer install

# Symfony
php bin/console doctrine:migrations:migrate
php bin/console doctrine:fixtures:load
vendor/bin/phpunit

# Frontend (inside container)
npm install
npm run dev          # Vite dev server
npm run build        # production build
```
