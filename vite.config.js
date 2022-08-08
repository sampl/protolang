import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import macrosPlugin from "vite-plugin-babel-macros"
import mdPlugin from "vite-plugin-markdown"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    macrosPlugin(),

    // requires @babel/preset-react
    // https://github.com/hmsk/vite-plugin-markdown/issues/238
    mdPlugin({mode: 'react'}),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
