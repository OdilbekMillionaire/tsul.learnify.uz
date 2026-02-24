/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FORGE_API_URL?: string;
  readonly VITE_FORGE_API_KEY?: string;
  readonly VITE_API_KEY?: string;
  readonly VITE_OPENAI_API_KEY?: string;
  readonly VITE_GROQ_API_KEY?: string;
  readonly VITE_GOOGLE_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
