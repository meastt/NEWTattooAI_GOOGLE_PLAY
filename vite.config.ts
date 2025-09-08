import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    // Debug: Log environment variables
    console.log('Vite Environment Variables:', {
      mode,
      hasGeminiKey: !!env.GEMINI_API_KEY,
      hasRevenueCatKey: !!env.VITE_REVENUECAT_API_KEY,
      revenueCatKeyLength: env.VITE_REVENUECAT_API_KEY?.length || 0
    });
    
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'import.meta.env.VITE_REVENUECAT_API_KEY': JSON.stringify(env.VITE_REVENUECAT_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      server: {
        host: true, // Allow external connections for mobile testing
        port: 5173
      }
    };
});
