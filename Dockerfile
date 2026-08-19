# ---- Stage 1: Build ----
# Node 22 LTS alpine. VITE_* env vars are inlined at build time — pass the
# production ones via --build-arg when they differ from .env.production.
FROM node:22-alpine AS builder
WORKDIR /src

# Cache deps: copy manifests before the source.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
ARG VITE_API_BASE_URL=https://sohibna-api.cendekita.id
ARG VITE_GOOGLE_WEB_CLIENT_ID=
ARG VITE_FIREBASE_API_KEY=
ARG VITE_FIREBASE_AUTH_DOMAIN=
ARG VITE_FIREBASE_PROJECT_ID=
ARG VITE_FIREBASE_APP_ID=
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_GOOGLE_WEB_CLIENT_ID=$VITE_GOOGLE_WEB_CLIENT_ID \
    VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY \
    VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN \
    VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID \
    VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID
RUN npm run build

# ---- Stage 2: Serve ----
# nginx-unprivileged: runs as the bundled uid (101), listens on 8080 — no
# root anywhere in the runtime image.
FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /src/dist /usr/share/nginx/html

EXPOSE 8080
USER 101
