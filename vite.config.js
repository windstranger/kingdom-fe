import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteBasicSslPlugin from '@vitejs/plugin-basic-ssl';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteBasicSslPlugin(), tailwindcss()],
  server: {
    https: true,
    host: true,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
});
