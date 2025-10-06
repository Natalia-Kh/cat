// https://nuxt.com/docs/api/configuration/nuxt-config
import svgLoader from "vite-svg-loader";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["vue3-carousel-nuxt", "@nuxt/image", "@pinia/nuxt"],

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "Cat test",
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
});
