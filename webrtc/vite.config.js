import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // server: {
  //  https: {
  //    ca: "~/localhost.pem",
  //    key: "~/localhost-key.pem"
  //  }
  // },
  plugins: [react()],
})
