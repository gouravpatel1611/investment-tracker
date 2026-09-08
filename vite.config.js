import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        name: "Investment Tracker",
        short_name: "Investments",
        description: "Personal Investment Portfolio Tracker",

        theme_color: "#0f172a",
        background_color: "#020617",

        display: "standalone",
        orientation: "portrait",

        start_url: "/",
        scope: "/",

        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],

  server: {
    proxy: {
      "/api/sgb": {
        target: "https://www.nseindia.com",
        changeOrigin: true,
        secure: true,

        rewrite: (path) =>
          path.replace(
            /^\/api\/sgb/,
            "/api/sovereign-gold-bonds"
          ),
      },
    },
  },
});