/**
 * Environment Configuration
 */

export const ENV = {
  forgeApiUrl: import.meta.env.VITE_FORGE_API_URL || 'https://api.example.com',
  forgeApiKey: import.meta.env.VITE_FORGE_API_KEY || '',
  apiKey: import.meta.env.VITE_API_KEY || '',
  openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  groqApiKey: import.meta.env.VITE_GROQ_API_KEY || '',
  googleApiKey: import.meta.env.VITE_GOOGLE_API_KEY || '',
} as const;
