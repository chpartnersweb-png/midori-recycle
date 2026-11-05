// 公開URLはAstro設定・メタ情報・サイトマップ・robotsで共通化します。
export const seo = Object.freeze({
  siteUrl: 'https://midori-recycle.pages.dev/',
  language: 'ja-JP',
  locale: 'ja_JP',
  ogImagePath: '/ogp.jpg',
  logoPath: '/icon-512.png',
});

// 独立したHTMLページを追加した場合に更新します。ページ内アンカーは含めません。
export const sitemapPaths = Object.freeze(['/']);
