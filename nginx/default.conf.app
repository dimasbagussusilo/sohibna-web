# Sohibna web — APP mode (SPA + PWA), served by nginx-unprivileged on :8080.
# Rendered to /etc/nginx/conf.d/default.conf at container start by
# docker-entrypoint.d/05-select-nginx-mode.sh (APP_MODE=app, the default).
#
# nginx add_header gotcha: a location-level add_header REPLACES everything
# inherited from the server level. So cache policy uses the `expires`
# directive (which coexists with inherited add_headers), and the ONE place
# that needs a custom Cache-Control (immutable assets) re-declares the
# security headers itself.

server {
    listen 8080;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript
               application/manifest+json image/svg+xml;
    gzip_min_length 1024;

    # Security headers. CSP: no third-party scripts; fonts/audio/frames are
    # content-only (see lib/storage.ts for the localStorage-token tradeoff
    # this enables). frame-ancestors blocks clickjacking.
    add_header Content-Security-Policy "default-src 'self'; connect-src 'self' https://sohibna-api.catatanbidan.id https://api.bigdatacloud.net; font-src 'self' https://verses.quran.foundation https://fonts.gstatic.com data:; media-src 'self' https://audio.qurancdn.com; img-src 'self' data: https://*.googleusercontent.com https://maps.gstatic.com https://maps.googleapis.com; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; frame-src https://maps.google.com https://www.google.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(self)" always;

    # Default: negotiated freshness (no-cache semantics without add_header).
    expires -1;

    # Hashed, immutable build assets — cache forever. add_header here would
    # drop the security headers, so they are re-declared.
    location /assets/ {
        expires off;
        add_header Cache-Control "public, max-age=31536000, immutable" always;
        add_header Content-Security-Policy "default-src 'self'; connect-src 'self' https://sohibna-api.catatanbidan.id https://api.bigdatacloud.net; font-src 'self' https://verses.quran.foundation https://fonts.gstatic.com data:; media-src 'self' https://audio.qurancdn.com; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'; frame-ancestors 'none'; base-uri 'self'" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Permissions-Policy "geolocation=(self)" always;
    }

    # The service worker + shell must always be fresh so updates land.
    location = /sw.js {
        expires -1;
    }
    # No longer emitted: registration is manual (src/pwa.ts) since the
    # landing split, which stops vite-plugin-pwa from emitting registerSW.js.
    # 404 (not the SPA fallback) so stale shells fail fast on it instead of
    # parsing HTML as JavaScript.
    location = /registerSW.js {
        return 404;
    }
    location = /manifest.webmanifest {
        expires -1;
        # Stock nginx mime.types lacks webmanifest — without this, strict
        # browsers (and Lighthouse) refuse the install prompt.
        default_type application/manifest+json;
    }
    location = /offline.html {
        expires -1;
    }

    # SPA fallback: unknown paths serve the app shell.
    location / {
        try_files $uri $uri/ /index.html;
    }
}
