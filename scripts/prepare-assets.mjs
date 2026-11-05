import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// 生成済み原本の取り込み・配信用形式への変換。再生成やAPIアクセスは行いません。
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'src/assets/generated');
const originals = path.join(output, 'originals');
const publicDir = path.join(root, 'public');
const manifest = JSON.parse(await fs.readFile(new URL('./generated-assets.json', import.meta.url), 'utf8'));
await fs.mkdir(originals, { recursive: true });
await fs.mkdir(publicDir, { recursive: true });

for (const asset of manifest.assets) {
  const original = path.join(originals, asset.name);
  // 次回はプロジェクト内の原本を使用できるようにします。
  try { await fs.access(original); }
  catch { await fs.copyFile(asset.source, original); }
  if (asset.key === 'logo') {
    await sharp(original).resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(path.join(output, 'logo-mark.png'));
    await sharp(original).resize(48, 48).png().toFile(path.join(publicDir, 'favicon.png'));
    await sharp(original).resize(180, 180).flatten({ background: '#faf9f2' }).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
    await sharp(original).resize(192, 192).png().toFile(path.join(publicDir, 'icon-192.png'));
    await sharp(original).resize(512, 512).png().toFile(path.join(publicDir, 'icon-512.png'));
  } else if (asset.key === 'ogp') {
    await sharp(original).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 91, mozjpeg: true }).toFile(path.join(publicDir, 'ogp.jpg'));
  } else {
    const image = sharp(original);
    if (asset.key === 'hero') image.resize({ width: 2000, withoutEnlargement: true });
    else if (asset.key === 'heroMobile') image.resize({ width: 1200, withoutEnlargement: true });
    else image.resize(1000, 750, { fit: 'cover' });
    await image.webp({ quality: 85, effort: 5 }).toFile(path.join(output, asset.name.replace(/\.png$/, '.webp')));
  }
  process.stdout.write(`Prepared: ${asset.key}\n`);
}
