import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        login: 'login.html',
        dashboard: 'dashboard.html',
        resumeBuilder: 'resume-builder.html'
      }
    }
  }
});