import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read ../.env if it exists
let geminiApiKey = "";
try {
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/^(?:VITE_)?GEMINI_API_KEY\s*=\s*([^\s#\r\n]+)/mi) || envContent.match(/Gemini\s*api\s*key:\s*([^\s#\r\n]+)/i);
        if (match) {
            geminiApiKey = match[1].trim();
            console.log('✓ Found Gemini API Key in root .env');
        }
    }
} catch (e) {
    console.error('Failed to read .env:', e);
}

export default defineConfig({
    plugins: [react()],
    define: {
        __GEMINI_API_KEY__: JSON.stringify(geminiApiKey)
    },
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

