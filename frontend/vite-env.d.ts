/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ACCESS_MANAGER_ADDRESS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
