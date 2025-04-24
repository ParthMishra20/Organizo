/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
  readonly VITE_MONGODB_URI: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}