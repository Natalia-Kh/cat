// https://nuxt.com/docs/api/configuration/nuxt-config
import svgLoader from "vite-svg-loader";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "vue3-carousel-nuxt",
    "@nuxt/image",
    "@pinia/nuxt",
    "nuxt-svgo",
    "v-gsap-nuxt",
  ],

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "Cat Game - Интерактивная игра с котиками",
      meta: [
        {
          name: "description",
          content:
            "Увлекательная игра где нужно накормить кота. Ловите еду миской и проходите уровни!",
        },
        {
          name: "keywords",
          content: "игра, кот, котик, еда, миска, развлечение",
        },
        {
          property: "og:title",
          content: "Cat Game - Интерактивная игра с котиками",
        },
        {
          property: "og:description",
          content:
            "Увлекательная игра где нужно накормить кота. Ловите еду миской и проходите уровни!",
        },
        { property: "og:image", content: "/og-image.jpg" },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "default" },
        { name: "apple-mobile-web-app-title", content: "Cat Game" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
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
  runtimeConfig: {
    apiBaseUrl: process.env.API_BASE_URL || "https://api.los-bio.ru",
    public: {
      dev: true,
    },
  },
});
