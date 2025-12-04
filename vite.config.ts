import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Sửa ở dòng dưới đây
      "@": path.resolve(__dirname, "./src"),
    },
  },
});