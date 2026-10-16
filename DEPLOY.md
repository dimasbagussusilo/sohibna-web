# Deploying sohibna-web

Static PWA served by `nginx-unprivileged` (non-root, :8080) in the same k8s
namespace (`cendekita`) as `sohibna-api`. Pushes to `main` deploy
automatically via GitHub Actions.

**Two origins, one image** (the catatanbidan/midwifery pattern):

| Origin | Serves | k8s | nginx mode |
|---|---|---|---|
| `app.sohibna.com` | the app (SPA + PWA) | `sohibna-web-deployment` | `APP_MODE=app` (default) |
| `sohibna.com` + `www.sohibna.com` | marketing landing (`/`, `/en`, `/ar`) | `sohibna-landing-deployment` | `APP_MODE=landing` |

In landing mode nginx serves the SPA shell at `/`, `/en`, `/ar` (the landing
routes in `src/App.tsx`), serves `/assets/` + fonts/icons/og-image, 404s
`/sw.js` + `/manifest.webmanifest` (the landing origin is never installable),
and **301s everything else to `https://app.sohibna.com`**. The mode is
chosen at container start by `docker-entrypoint.d/05-select-nginx-mode.sh`,
which renders `/etc/nginx/conf.d/default.conf` from `/etc/nginx/modes/`
(the config files deliberately do NOT end in `.template` — this nginx image
ignores non-executable `.sh` entrypoint scripts, and an executed script's
exports never reach its own `20-envsubst-on-templates.sh`). Fallback if you
ever need it: render the config by hand — `envsubst '${APP_ORIGIN}' <
nginx/default.conf.landing > default.conf`.

## One-time setup

1. **GitHub repo + secrets** — create `sohibna-web` on GitHub, push, then add
   repository secrets:
   - `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN` — same values as the API repo
   - `KUBE_CONFIG` — same cluster kubeconfig as the API repo
   - `VITE_API_BASE_URL` — `https://sohibna-api.catatanbidan.id`
   - `VITE_GOOGLE_WEB_CLIENT_ID` + the four `VITE_FIREBASE_*` values (Web app
     config from the Firebase console; until set, the Google button is hidden
     and email login still works)

2. **Apply the k8s objects** (first deploy only — CI afterwards just rolls
   the image tag). The Traefik + Let's Encrypt annotations are already the
   cluster's real setup (copied from the live `midwifery-web-ingress`; there
   is no cert-manager on the cluster):

   ```sh
   kubectl apply -f k8s/deployment.yaml   # app origin
   kubectl apply -f k8s/landing.yaml      # landing origin
   ```

   ⚠️ Both deployments must exist **before** the deploy workflow's
   `kubectl set image` steps run, or every CI deploy fails — apply before
   merging to main.

3. **DNS** — A records (all → the cluster's traefik LoadBalancer,
   `84.247.146.71`):
   - `app.sohibna.com` (app)
   - `sohibna.com` + `www.sohibna.com` (landing; `founder.sohibna.com`
     already points here, so the zone is set up)

   Traefik's `letsencrypt` certresolver issues each cert on the first HTTPS
   hit. Check with `kubectl describe ingress -n cendekita <name>`.

4. **Google OAuth origins** — in Google Cloud Console → the Web OAuth client:
   add `https://app.sohibna.com` (and `http://localhost:5173` for dev) to
   Authorized JavaScript origins. The landing origin needs nothing — it does
   no auth and never handles tokens.

## Every push to main

`.github/workflows/deploy.yml`: typecheck + tests + build (gate) → buildx →
Docker Hub `dimasbagussusilo/sohibna-web:<sha>` + `:latest` →
`kubectl set image` + rollout status for **both** deployments (120s each) →
auto-rollback of both on failure.

## Local development

```sh
npm run dev                                    # app tree on :5173 (default)

# Landing tree on a second server (:5174); its "Buka Aplikasi" CTA then
# points at the :5173 app dev server:
VITE_LANDING_HOSTS=localhost \
VITE_APP_ORIGIN=http://localhost:5173 \
npm run dev -- --port 5174
```

Origin detection is hostname-based (`src/origins.ts`, `VITE_LANDING_HOSTS`,
default `sohibna.com,www.sohibna.com`) and each Vite server inlines its own
env at build — so both trees run side by side on localhost.

```sh
# Local container check — both modes from one image
podman build -t sohibna-web:dev .
podman run -p 8081:8080 sohibna-web:dev                        # app mode
podman run -p 8082:8080 -e APP_MODE=landing sohibna-web:dev   # landing mode
# landing: / /en /ar → 200 · /home → 301 app · /sw.js → 404
```

## Manual

```sh
# Rollback a bad release (both origins run the same image tag)
kubectl rollout undo deployment/sohibna-landing-deployment -n cendekita
kubectl rollout undo deployment/sohibna-web-deployment -n cendekita
```

## Gotchas

- `VITE_*` values are **inlined at build time** — changing a secret requires
  a new push (or re-run) to take effect, and the browser cache may serve the
  old shell for up to `no-cache` negotiation.
- `PORT_SOURCES.md` lists files copied from the RN app — re-diff before
  porting more. The `landing.*` translation keys are maintained in BOTH
  repos' dictionaries (web renders them; RN keeps the port invariant).
- The localStorage-token tradeoff (vs the app's SecureStore) is documented in
  `src/lib/storage.ts`; the CSPs in `nginx/default.conf.*` are part of that
  mitigation — keep `script-src 'self'` strict.
- The landing must never register a service worker: gated client-side in
  `src/pwa.ts` (app origin only) and nginx-side (404 on `/sw.js`,
  `/registerSW.js`, `/manifest.webmanifest` in landing mode). If you touch
  the PWA config, re-verify `dist/` has no injected `registerSW` script and
  that `sw.js` still precaches the shell.
