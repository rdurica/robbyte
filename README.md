# Robert Durica - personal portfolio

[![PHP](https://img.shields.io/badge/PHP-8.4-blue.svg)](http://php.net)
[![Docker](https://img.shields.io/badge/Docker-powered-blue.svg)](https://www.docker.com/)
[![composer](https://img.shields.io/badge/composer-latest-green.svg)](https://getcomposer.org/)

![Image](https://github.com/user-attachments/assets/18313929-0851-4499-9c51-e9f974fef338)

## Overview

This repository contains the source code of my personal developer portfolio. It showcases selected projects, technical
skills, certifications, and professional experience – with a focus on backend development in PHP, modern DevOps tools,
and clean software architecture.


##  Live Site

[robbyte.net](https://robbyte.net)

## Production

- Build the production image with dependencies baked in (no deploy-time composer install needed): `docker build -f build/prod/Dockerfile -t rdurica/robbyte:latest .` (ideally in CI, then push to your registry), or let Compose build it on the server.
- The image listens on plain HTTP port `80`. Put it behind your reverse proxy and terminate TLS there; proxy traffic to port 80 on the container.
- Required env: `APP_SECRET` (provide via shell or an env file copied from `build/prod/example.env`). Optional: `TRUSTED_PROXIES`, `TRUSTED_HOSTS`, `DOCKER_NETWORK` (defaults to `apps`).
- Example run: `APP_SECRET=... docker run -d -p 80:80 --name robbyte rdurica/robbyte:latest`.

## Contributing

If you would like to contribute to this project, please fork the repository and create a pull request. We welcome all
contributions, including bug fixes, new features, and documentation improvements.

## License

This project is licensed under the terms of the MIT license.
