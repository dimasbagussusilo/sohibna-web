# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
# sohibna-web
# sohibna-web

## Landing page (split origin)

One image serves two origins — see [DEPLOY.md](DEPLOY.md) for the full
picture:

- `app.sohibna.com` — the app (SPA + PWA), nginx `APP_MODE=app`
- `sohibna.com` — marketing landing at `/`, `/en`, `/ar` (ID/EN/AR, RTL for
  Arabic), nginx `APP_MODE=landing` (everything else 301s to the app)

Local dev — two servers side by side:

```sh
npm run dev                                              # app, :5173
VITE_LANDING_HOSTS=localhost VITE_APP_ORIGIN=http://localhost:5173 \
  npm run dev -- --port 5174                             # landing, :5174
```

Landing source: `src/routes/landing/`; origin detection: `src/origins.ts`;
the landing never registers a service worker (`src/pwa.ts` gates it).
