/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  /** The app (PWA) origin — where "Buka Aplikasi" from the landing points. */
  readonly VITE_APP_ORIGIN?: string
  /** The landing (apex) origin — used for canonical/hreflang URLs. */
  readonly VITE_LANDING_ORIGIN?: string
  /** Comma-separated hostnames that serve the landing tree (dev override). */
  readonly VITE_LANDING_HOSTS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
