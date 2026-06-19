import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
import { join } from "node:path";

const SRC = "public/media/from-pdf";
const OUT = "public/media/curated";

const QUALITY = 82;

const picks = [
  { src: "nn-194.jpg", out: "hero-river.jpg", width: 2400, label: "hero backdrop" },
  { src: "nn-011.jpg", out: "about-1.jpg", width: 2000, label: "about/story" },
  { src: "nn-032.jpg", out: "case-1.jpg", width: 1600, label: "case study" },
  { src: "nn-027.jpg", out: "case-2.jpg", width: 1600, label: "case study" },
  { src: "nn-094.jpg", out: "case-3.jpg", width: 1600, label: "case study" },
  { src: "nn-096.jpg", out: "case-4.jpg", width: 1600, label: "case study" },
  { src: "nn-098.jpg", out: "case-5.jpg", width: 1600, label: "case study" },
  { src: "nn-097.jpg", out: "case-6.jpg", width: 1600, label: "case study" },
  { src: "nn-095.jpg", out: "case-7.jpg", width: 1600, label: "case study" },
  { src: "nn-101.jpg", out: "case-8.jpg", width: 1600, label: "case study" },
  { src: "nn-099.jpg", out: "case-9.jpg", width: 1600, label: "case study" },
  { src: "nn-050.jpg", out: "team-1.jpg", width: 1000, label: "team portrait" },
  { src: "nn-037.jpg", out: "team-2.jpg", width: 1000, label: "team portrait" },
  { src: "nn-049.png", out: "team-3.png", width: 800, label: "team portrait" },
  { src: "nn-054.png", out: "team-4.png", width: 800, label: "team portrait" },
  { src: "nn-058.png", out: "team-5.png", width: 800, label: "team portrait" },
  { src: "nn-069.jpg", out: "production-1.jpg", width: 2000, label: "production" },
  { src: "nn-068.jpg", out: "community-1.jpg", width: 1600, label: "community" },
  { src: "nn-020.jpg", out: "experiences-1.jpg", width: 1600, label: "experiences" },
  { src: "nn-191.jpg", out: "community-2.jpg", width: 1600, label: "community event" },
  { src: "nn-006.png", out: "graphic-1.png", width: 1600, label: "graphic/screenshot" },
  { src: "nn-051.jpg", out: "graphic-2.jpg", width: 1600, label: "graphic/screenshot" },
  { src: "nn-000.jpg", out: "brand-graphic-1.jpg", width: 1200, label: "brand graphic" },
  { src: "nn-002.png", out: "brand-graphic-2.png", width: 1200, label: "brand graphic" },
];

await mkdir(OUT, { recursive: true });

let totalOriginal = 0;
let totalOptimized = 0;

for (const p of picks) {
  const srcPath = join(SRC, p.src);
  const outPath = join(OUT, p.out);
  const origSize = (await stat(srcPath)).size;
  totalOriginal += origSize;

  await sharp(srcPath)
    .rotate()
    .resize({ width: p.width, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(p.out.endsWith(".png") ? outPath : outPath.replace(/\.jpg$/, ".jpg"));

  const optSize = (await stat(outPath)).size;
  totalOptimized += optSize;
  console.log(`${p.src} -> ${p.out}  ${(origSize / 1024).toFixed(0)}KB -> ${(optSize / 1024).toFixed(0)}KB  (${p.label})`);
}

console.log(`\nTotal: ${(totalOriginal / 1024 / 1024).toFixed(1)}MB -> ${(totalOptimized / 1024 / 1024).toFixed(1)}MB`);
