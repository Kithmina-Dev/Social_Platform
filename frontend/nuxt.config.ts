// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-08-07",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@vee-validate/nuxt"],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || "http://localhost:8000/api",
    },
  },
  devServer: {
    port: 8000,
  },
  alias: {
    "@stores": "~/stores",
  },
  components: {
    dirs: [
      "~/components",
      "~/components/base",
      "~/components/forms",
      "~/components/auth",
    ],
  },
});
