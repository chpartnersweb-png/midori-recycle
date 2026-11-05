// @ts-check
import { defineConfig } from 'astro/config';
import { seo } from './src/config/seo.mjs';

// https://astro.build/config
export default defineConfig({
  site: seo.siteUrl,
  trailingSlash: 'always',
});
