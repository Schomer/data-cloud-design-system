import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from 'fs';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5900,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8000',
                changeOrigin: true,
                secure: false,
            }
        }
    }
});
