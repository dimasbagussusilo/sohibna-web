#!/bin/sh
# Renders /etc/nginx/conf.d/default.conf from the mode config in
# /etc/nginx/modes/. ONE image serves two origins:
#   APP_MODE=app      → default.conf.app   (SPA + PWA)
#   APP_MODE=landing  → default.conf.landing (marketing landing, everything
#                       else 301s to ${APP_ORIGIN})
#
# Runs as an executable entrypoint script (this nginx image IGNORES
# non-executable .sh — only *.envsh gets sourced — and an executed script's
# exports don't reach 20-envsubst-on-templates.sh, so we envsubst ourselves).
# envsubst gets an explicit var list: $uri / $request_uri in the configs must
# survive untouched.
set -e

MODES=/etc/nginx/modes
OUT=/etc/nginx/conf.d/default.conf

case "${APP_MODE:-app}" in
    landing) SRC="$MODES/default.conf.landing" ;;
    *)       SRC="$MODES/default.conf.app" ;;
esac

APP_ORIGIN="${APP_ORIGIN:-https://sohibna.cendekita.id}"
export APP_ORIGIN
# API_ORIGIN is where the landing's /r/CODE short links 302 to (the API's
# GET /ref/CODE does the real redirect and counts the click). Same prod
# default as the Dockerfile ENV, so a missed k8s env is harmless.
API_ORIGIN="${API_ORIGIN:-https://sohibna-api.catatanbidan.id}"
export API_ORIGIN

# A variable is only substituted when it is LISTED here — a config that gains
# a ${VAR} without a list entry ships the literal placeholder in its 302s.
envsubst '${APP_ORIGIN} ${API_ORIGIN}' < "$SRC" > "$OUT"
