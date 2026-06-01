import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    {
      name: 'startup-log',
      configureServer(server) {
        server.httpServer?.once('listening', () => {
          console.log('\n🥑  BLW Tracker is running at http://localhost:3000\n');
        });
      },
    },
  ],
  server: {
    port: 3000,
  },
});
