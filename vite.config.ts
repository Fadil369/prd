import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.anthropic\.com\/.*/,
            handler: "NetworkFirst",
            options: {
              cacheName: "claude-api-cache",
              networkTimeoutSeconds: 10,
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "google-fonts-stylesheets",
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },
      manifest: {
        name: "من الأفكار إلى الابتكار - Ideas to Innovation",
        short_name: "Ideas2Innovation",
        description:
          "منصة مدعومة بالذكاء الاصطناعي للإبداع والابتكار لرواد الأعمال السعوديين - AI-powered innovation platform for Saudi entrepreneurs",
        theme_color: "#059669",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        lang: "ar",
        dir: "rtl",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        categories: ["business", "productivity", "developer"],
        shortcuts: [
          {
            name: "عصف أفكار - Brainstorm",
            short_name: "أفكار",
            description: "ابدأ بعصف الأفكار - Start brainstorming",
            url: "/?step=brainstorm",
            icons: [{ src: "brainstorm-96x96.png", sizes: "96x96" }],
          },
          {
            name: "إنشاء مستند - Create PRD",
            short_name: "مستند",
            description:
              "إنشاء مستند متطلبات المنتج - Create Product Requirements Document",
            url: "/?step=prd",
            icons: [{ src: "prd-96x96.png", sizes: "96x96" }],
          },
        ],
      },
    }),
  ],
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["lucide-react", "framer-motion"],
          utils: ["date-fns", "js-cookie"],
        },
      },
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
});
