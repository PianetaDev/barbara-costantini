import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [
    vue(),
  ],
  site: 'https://barbara-costantini-pianetastudios-projects.vercel.app',
  vite: {
    plugins: [tailwindcss()],
  },
});
