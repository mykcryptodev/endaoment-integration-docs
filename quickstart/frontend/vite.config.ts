import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  // Prefix for all public environment variables
  envPrefix: 'SAFE_',
  server: {
    port: 3000,
  },
});
