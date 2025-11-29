#!/bin/bash
set -e

# Run under supervisord so php-fpm and nginx stay up and log to stdout/stderr
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
