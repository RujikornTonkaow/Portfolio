export default defineNuxtConfig({
  compatibilityDate: '2025-05-04',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
    },
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
  ],

  app: {
    head: {
      title: 'Portfolio',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'description', content: 'Personal Portfolio Website' },
      ],
      script: [
        {
          innerHTML: `(function(){try{var t=localStorage.getItem('portfolio-theme');if(t==='midnight'||t==='sunshine'){document.documentElement.classList.remove('midnight','sunshine');document.documentElement.classList.add(t)}}catch(e){}})()`,
        },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap',
        },
      ],
    },
  },

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
  },
})
