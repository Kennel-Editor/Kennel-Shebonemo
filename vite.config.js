import { defineConfig } from 'vite';
import process from 'node:process';
import react from '@vitejs/plugin-react';
import snapshot from './src/data/shebonemo-legacy-reconstructed-preview.json' with { type: 'json' };
import { validateProductionSnapshot } from './functions/lib/_posthogStats.mjs';

export default defineConfig(({ command }) => {
  if (command === 'build' && process.env.CONTEXT === 'production') {
    validateProductionSnapshot(snapshot, process.env.POSTHOG_START_AT);
  }
  return {
    plugins: [react()],
    server: {
      port: 5173,
      strictPort: true,
    },
    define: {
      __NETLIFY_CONTEXT__: JSON.stringify(process.env.CONTEXT || 'unknown'),
      __PRODUCTION_SITE_HOST__: JSON.stringify(process.env.URL ? new URL(process.env.URL).hostname : ''),
      'process.env': {
        SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
        SANITY_DATASET: process.env.SANITY_DATASET,
        SANITY_API_VERSION: process.env.SANITY_API_VERSION,
      },
    },
  };
});
