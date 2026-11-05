import type { APIRoute } from 'astro';
import { seo } from '../config/seo.mjs';

export const prerender = true;

export const GET: APIRoute = () => new Response([
  'User-agent: *',
  'Allow: /',
  '',
  `Sitemap: ${new URL('/sitemap.xml', seo.siteUrl).href}`,
  '',
].join('\n'), {
  headers: { 'Content-Type': 'text/plain; charset=utf-8' },
});
