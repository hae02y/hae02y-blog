/**
 * Copies markdown-adjacent media to public/ so Next.js can serve them.
 *
 * blog/2025-07-15-NKS구축/screen1.png → public/blog/2025-07-15-NKS구축/screen1.png
 * Insight/book/year2025/cover.png → public/Insight/book/year2025/cover.png
 */
import fs from 'fs';
import path from 'path';

const MEDIA_EXTS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.bmp', '.avif',
  '.mp4', '.webm', '.ogg', '.mov', '.m4v', '.mp3', '.wav', '.m4a',
]);

const SOURCES = [
  { name: 'blog', sourceDir: path.join(process.cwd(), 'blog'), publicDir: path.join(process.cwd(), 'public', 'blog') },
  { name: 'Insight', sourceDir: path.join(process.cwd(), 'Insight'), publicDir: path.join(process.cwd(), 'public', 'Insight') },
];

function copyImages({ name, sourceDir, publicDir }) {
  if (!fs.existsSync(sourceDir)) return 0;

  let count = 0;

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const sourcePath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        walk(sourcePath);
        continue;
      }

      const ext = path.extname(entry.name).toLowerCase();
      if (!MEDIA_EXTS.has(ext)) continue;

      const relativePath = path.relative(sourceDir, sourcePath);
      const destPath = path.join(publicDir, relativePath);
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(sourcePath, destPath);
      count++;
    }
  }

  walk(sourceDir);
  console.log(`Copied ${count} ${name} media files to ${path.relative(process.cwd(), publicDir)}/`);
  return count;
}

for (const source of SOURCES) {
  copyImages(source);
}
