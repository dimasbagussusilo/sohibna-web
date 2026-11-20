# Sohibna web — APP origin (app.sohibna.com), TEMPORARILY DEACTIVATED
# (2026-11-20). Every request 302s to the marketing landing; the SPA/PWA
# server block this replaces lives in git history — `git revert` of the
# deactivation commit restores it verbatim. Nothing else changes: the image
# still builds the full app, CI still rolls both deployments, k8s stays as
# is (see below for the probes).
#
# 302, NEVER 301: browsers cache 301s aggressively and this is meant to be
# undone (same rule as the /r/ referral redirect in default.conf.landing).
#
# Target is the landing ROOT, never path-preserving: the landing catch-all
# 301s unknown paths back to ${APP_ORIGIN}$request_uri, so echoing the path
# would loop (sohibna.com/foo → app.sohibna.com/foo → sohibna.com/foo → …).
#
# Probes: k8s/deployment.yaml readiness/liveness httpGet /index.html accept
# any 200–399, so the server-level 302 keeps pods Ready without serving the
# shell. Installed PWAs see their /sw.js update fetch redirected cross-origin
# → update fails → last-cached shell, which is the expected outcome of a
# deactivation.

server {
    listen 8080;
    server_name _;
    server_tokens off;

    return 302 https://sohibna.com/;
}
