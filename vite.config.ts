import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
          charts: ['recharts'],
          supabase: ['@supabase/supabase-js'],
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 1000,
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
    // Ensure proper asset handling for Netlify
    assetsInlineLimit: 4096,
    // Better error reporting
    reportCompressedSize: false,
    // Ensure proper chunk loading
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@supabase/supabase-js'],
  },
  // Ensure proper base path for Netlify
  base: '/',
}));
