/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUZZLE_STRATEGY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
