import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.error('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to Backend:', {
              method: req.method,
              path: req.url,
              targetUrl: proxyReq.path,
              body: req.body
            });

            if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
              const bodyData = JSON.stringify(req.body);
              proxyReq.removeHeader('Content-Length');
              proxyReq.setHeader('Content-Type', 'application/json');
              proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
              proxyReq.write(bodyData);
            }
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from Backend:', {
              status: proxyRes.statusCode,
              path: req.url,
              method: req.method,
              headers: proxyRes.headers
            });

            let responseBody = '';
            proxyRes.on('data', chunk => {
              responseBody += chunk;
            });
            proxyRes.on('end', () => {
              try {
                const parsedBody = JSON.parse(responseBody);
                console.log('Response body:', parsedBody);
              } catch (e) {
                console.log('Raw response body:', responseBody);
              }
            });
          });
        }
      }
    },
    cors: false
  }
})