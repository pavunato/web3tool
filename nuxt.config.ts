// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  css: [
    '@/assets/css/tailwind.css'
  ],
  devtools: { enabled: true }
})
