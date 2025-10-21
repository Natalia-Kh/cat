// https://nuxt.com/docs/api/configuration/nuxt-config
import svgLoader from "vite-svg-loader";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["vue3-carousel-nuxt", "@nuxt/image", "@pinia/nuxt", "nuxt-svgo", "v-gsap-nuxt"],

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "Cat Game - Интерактивная игра с котиками",
      meta: [
        { name: "description", content: "Увлекательная игра где нужно накормить кота. Ловите еду миской и проходите уровни!" },
        { name: "keywords", content: "игра, кот, котик, еда, миска, развлечение" },
        { property: "og:title", content: "Cat Game - Интерактивная игра с котиками" },
        { property: "og:description", content: "Увлекательная игра где нужно накормить кота. Ловите еду миской и проходите уровни!" },
        { property: "og:image", content: "/og-image.jpg" },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://cat-game.example.com" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Cat Game - Интерактивная игра с котиками" },
        { name: "twitter:description", content: "Увлекательная игра где нужно накормить кота. Ловите еду миской и проходите уровни!" },
        { name: "twitter:image", content: "/og-image.jpg" },
        { name: "theme-color", content: "#285599" },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "default" },
        { name: "apple-mobile-web-app-title", content: "Cat Game" }
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
        { rel: "manifest", href: "/manifest.json" }
      ],
    },
  },
  vite: {
    plugins: [svgLoader()],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:
            '@use  "~/assets/scss/_colors.scss" as *; @use  "~/assets/scss/_variables.scss" as *;',
        },
      },
    },
  },
  css: ["~/assets/scss/main.scss"],
  features: {
    inlineStyles: false,
  },
  image: {
    format: ["avif", "webp"],
  },
});