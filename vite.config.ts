import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
   base: '/PF/',   // ← ESTA LÍNEA ES LA IMPORTANTE
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});