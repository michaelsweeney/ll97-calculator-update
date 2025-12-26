import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'components': path.resolve(__dirname, './src/components'),
      'store': path.resolve(__dirname, './src/store'),
      'locallaw': path.resolve(__dirname, './src/locallaw'),
      'styles': path.resolve(__dirname, './src/styles'),
      'types': path.resolve(__dirname, './src/types'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  server: {
    port: 3001,
    open: false,
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-redux', 'react-router-dom'],
          'mui-vendor': ['@mui/material', '@emotion/react', '@emotion/styled'],
          'd3-vendor': ['d3'],
        },
      },
    },
  },
})
