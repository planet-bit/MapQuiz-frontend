import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: '0.0.0.0',  // 全てのIPアドレスからアクセス可能に設定
    port: 5173,
    watch: {
      usePolling: true,  // ファイル監視のためにPollingを使う
    },
    proxy: {
      '/server': {
        target: 'http://localhost:3000', 
        changeOrigin: true,
        rewrite: path => path.replace(/^\/server/, '')
      }
    }
  }
})
