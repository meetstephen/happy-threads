import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Pull big, rarely-changing dependencies into their own chunks
          // so they cache aggressively across deploys.
          'react-vendor': ['react', 'react-dom'],
          'motion-vendor': ['framer-motion'],
          'supabase-vendor': ['@supabase/supabase-js'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
