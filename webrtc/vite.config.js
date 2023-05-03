import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {VitePWA} from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    // server: {
    //  https: {
    //    ca: "~/localhost.pem",
    //    key: "~/localhost-key.pem"
    //  }
    // },
    plugins: [VitePWA({
        registerType: 'autoUpdate',
        workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg,data,wasm}'],
            runtimeCaching: [
                {
                    urlPattern: ({url})=>{
                        return url.pathname
                    },
                    handler: "CacheFirst"
                }
            ],
            maximumFileSizeToCacheInBytes: 50000000


        }
    }), react()],
})
