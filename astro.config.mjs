import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [
    vue(),
    tailwind({ applyBaseStyles: false }),
  ],
  site: 'https://barbara-costantini-pianetastudios-projects.vercel.app',
});
