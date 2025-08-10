// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-08-07",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@vee-validate/nuxt"],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || "http://localhost:3000",
    },
  },
  devServer: {
    port: 8080,
  },
  css: [
    "primevue/resources/themes/lara-light-blue/theme.css",
    "primevue/resources/primevue.css",
    "primeicons/primeicons.css",
    "~/assets/css/main.css",
  ],
  build: {
    transpile: ["primevue"],
  },
  components: {
    dirs: [
      "~/components",
      "~/components/base",
      "~/components/forms",
      "~/components/auth",
      "~/components/posts",
      "~/components/layout",
      "~/components/profile",
    ],
  },
});
