#!/bin/bash
set -euo pipefail

# Allow overriding the supervisor config path via `-c <path>`
CONFIG="/etc/supervisor/conf.d/supervisord.conf"
if [[ "${1:-}" == "-c" && -n "${2:-}" ]]; then
  CONFIG="$2"
  shift 2
fi

exec /usr/bin/supervisord -c "$CONFIG" "$@"
