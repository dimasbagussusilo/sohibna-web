# Deploying sohibna-web

Static PWA served by `nginx-unprivileged` (non-root, :8080) in the same k8s
namespace (`cendekita`) as `sohibna-api`. Pushes to `main` deploy
automatically via GitHub Actions.

## One-time setup

1. **GitHub repo + secrets** — create `sohibna-web` on GitHub, push, then add
   repository secrets:
   - `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN` — same values as the API repo
   - `KUBE_CONFIG` — same cluster kubeconfig as the API repo
   - `VITE_API_BASE_URL` — `https://sohibna-api.cendekita.id`
   - `VITE_GOOGLE_WEB_CLIENT_ID` + the four `VITE_FIREBASE_*` values (Web app
     config from the Firebase console; until set, the Google button is hidden
     and email login still works)

2. **Apply the k8s objects** (first deploy only — CI afterwards just rolls
   the image tag):

   ```sh
   # Copy the ingress class + TLS annotations the API ingress uses into
   # k8s/deployment.yaml's Ingress first:
   kubectl get ingress -n cendekita -o yaml

   kubectl apply -f k8s/deployment.yaml
   ```

3. **DNS** — point `sohibna.cendekita.id` at the ingress load balancer IP.

4. **Google OAuth origins** — in Google Cloud Console → the Web OAuth client:
   add `https://sohibna.cendekita.id` (and `http://localhost:5173` for dev) to
   Authorized JavaScript origins.

## Every push to main

`.github/workflows/deploy.yml`: typecheck + tests + build (gate) → buildx →
Docker Hub `dimasbagussusilo/sohibna-web:<sha>` + `:latest` →
`kubectl set image` → rollout status (120s) → auto-rollback on failure.

## Manual

```sh
# Local container check
podman build -t sohibna-web:dev .
podman run -p 8081:8080 sohibna-web:dev   # → http://127.0.0.1:8081

# Rollback a bad release
kubectl rollout undo deployment/sohibna-web-deployment -n cendekita
```

## Gotchas

- `VITE_*` values are **inlined at build time** — changing a secret requires
  a new push (or re-run) to take effect, and the browser cache may serve the
  old shell for up to `no-cache` negotiation.
- `PORT_SOURCES.md` lists files copied from the RN app — re-diff before
  porting more.
- The localStorage-token tradeoff (vs the app's SecureStore) is documented in
  `src/lib/storage.ts`; the CSP in `nginx.conf` is part of that mitigation —
  keep `script-src 'self'` strict.
