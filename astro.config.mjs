import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [
    vue(),
    sitemap(),
  ],
  site: 'https://barbara-costantini-pianetastudios-projects.vercel.app',
  vite: {
    plugins: [tailwindcss()],
  },
});
