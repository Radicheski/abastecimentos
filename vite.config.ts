import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      pwaAssets: {
        config: true,
      },
      manifest: {
        name: "Abastecimentos",
        short_name: "Abastecimentos",
        description: "Registro de abastecimentos de veículos",
        lang: "pt-BR",
        start_url: "/",
        display: "standalone",
        orientation: "portrait",
        theme_color: "#171717",
        background_color: "#ffffff",
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
