/**
 * Fallback background removal for UI mockups.
 * Samples corner gradient colors, flood-fills connected outer pixels
 * (tolerance ~30), then feathers alpha ~2px.
 */
import { access, mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const inputPath = path.join(root, "public", "input.png");
const outputPath = path.join(root, "public", "output.png");

const TOLERANCE = 30;
const FEATHER_PX = 2;

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function assertInputExists() {
  try {
    await access(inputPath);
  } catch {
    throw new Error(
      `Input file not found: ${inputPath}\nPlace your UI mockup at public/input.png and try again.`,
    );
  }
}

function colorDist(r, g, b, cr, cg, cb) {
  return Math.hypot(r - cr, g - cg, b - cb);
}

function isProtectedContent(r, g, b) {
  const mn = Math.min(r, g, b);
  const mx = Math.max(r, g, b);
  // Dark UI chrome / text / photos — never clear
  if (mx < 220) return true;
  // Saturated accents (purple buttons, icons, etc.)
  if (mx - mn >= 28) return true;
  return false;
}

function isNearWhitePage(r, g, b) {
  const mn = Math.min(r, g, b);
  const mx = Math.max(r, g, b);
  return mn >= 248 && mx - mn <= 12;
}

function sampleCorners(data, width, height, channels) {
  const samples = [];
  const patches = [
    [0, 0],
    [width - 3, 0],
    [0, height - 3],
    [width - 3, height - 3],
  ];
  for (const [ox, oy] of patches) {
    for (let dy = 0; dy < 3; dy++) {
      for (let dx = 0; dx < 3; dx++) {
        const x = Math.min(width - 1, Math.max(0, ox + dx));
        const y = Math.min(height - 1, Math.max(0, oy + dy));
        const i = (y * width + x) * channels;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // Prefer lavender / mist samples; skip pure white
        if (isNearWhitePage(r, g, b)) continue;
        samples.push([r, g, b]);
      }
    }
  }
  for (const [x, y] of [
    [Math.floor(width / 2), 0],
    [Math.floor(width / 2), height - 1],
    [0, Math.floor(height / 2)],
    [width - 1, Math.floor(height / 2)],
  ]) {
    const i = (y * width + x) * channels;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (!isNearWhitePage(r, g, b)) samples.push([r, g, b]);
  }
  // If corners were all white, fall back to a few inward samples
  if (samples.length === 0) {
    for (const [x, y] of [
      [20, 20],
      [width - 21, 20],
      [20, height - 21],
      [width - 21, height - 21],
    ]) {
      const i = (y * width + x) * channels;
      samples.push([data[i], data[i + 1], data[i + 2]]);
    }
  }
  return samples;
}

function matchesBg(r, g, b, samples) {
  if (isProtectedContent(r, g, b)) return false;
  // Outer page white (edge-connected via flood)
  if (isNearWhitePage(r, g, b)) return true;
  for (const [cr, cg, cb] of samples) {
    if (colorDist(r, g, b, cr, cg, cb) <= TOLERANCE) return true;
  }
  return false;
}

function floodOuterMask(data, width, height, channels, samples) {
  const N = width * height;
  const mask = new Uint8Array(N); // 1 = outer bg to clear
  const visited = new Uint8Array(N);
  const qx = new Int32Array(N);
  const qy = new Int32Array(N);
  let head = 0;
  let tail = 0;

  const trySeed = (x, y) => {
    const idx = y * width + x;
    if (visited[idx]) return;
    const i = idx * channels;
    if (!matchesBg(data[i], data[i + 1], data[i + 2], samples)) return;
    visited[idx] = 1;
    mask[idx] = 1;
    qx[tail] = x;
    qy[tail] = y;
    tail++;
  };

  for (let x = 0; x < width; x++) {
    trySeed(x, 0);
    trySeed(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    trySeed(0, y);
    trySeed(width - 1, y);
  }

  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (head < tail) {
    const x = qx[head];
    const y = qy[head];
    head++;
    for (const [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const nidx = ny * width + nx;
      if (visited[nidx]) continue;
      visited[nidx] = 1;
      const i = nidx * channels;
      if (matchesBg(data[i], data[i + 1], data[i + 2], samples)) {
        mask[nidx] = 1;
        qx[tail] = nx;
        qy[tail] = ny;
        tail++;
      }
    }
  }

  return mask;
}

async function removeBgByCornerColors() {
  const { data, info } = await sharp(inputPath, { failOn: "none" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const samples = sampleCorners(data, width, height, channels);
  const mask = floodOuterMask(data, width, height, channels, samples);

  const out = Buffer.from(data);
  for (let i = 0; i < width * height; i++) {
    if (mask[i]) {
      const p = i * channels;
      out[p + 3] = 0;
    }
  }

  // Build RGBA, blur alpha 2px for feathered edges, rejoin
  const rgba = await sharp(out, {
    raw: { width, height, channels: 4 },
  })
    .png({ compressionLevel: 1 })
    .toBuffer();

  const alpha = await sharp(rgba).extractChannel(3).blur(FEATHER_PX).toBuffer();
  const rgb = await sharp(rgba).removeAlpha().toBuffer();

  return sharp(rgb)
    .joinChannel(alpha)
    .ensureAlpha()
    .png({ compressionLevel: 1 })
    .toBuffer();
}

async function main() {
  await assertInputExists();
  await mkdir(path.dirname(outputPath), { recursive: true });

  console.log(
    "Fallback: sharp corner flood-fill (tolerance=30, feather=2px)…",
  );

  let buffer;
  try {
    buffer = await removeBgByCornerColors();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Background removal failed: ${message}`);
  }

  await writeFile(outputPath, buffer);

  const info = await stat(outputPath);
  console.log(`Success: wrote ${outputPath}`);
  console.log(`Output file size: ${formatBytes(info.size)} (${info.size} bytes)`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exitCode = 1;
});
