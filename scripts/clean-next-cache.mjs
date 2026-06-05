/**
 * Removes Next.js / webpack caches (fixes missing chunk errors like ./8948.js).
 * Stop the dev server first for best results on Windows.
 */
import { rmSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const dirs = [
  resolve(root, ".next"),
  resolve(root, "node_modules", ".cache"),
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function removeDir(dir) {
  if (!existsSync(dir)) return;
  const label = dir.replace(root + "\\", "").replace(root + "/", "");
  for (let attempt = 1; attempt <= 10; attempt++) {
    try {
      rmSync(dir, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
      console.log(`Removed ${label}`);
      return;
    } catch (err) {
      if (attempt === 10) {
        console.warn(`Could not remove ${label}: ${err.message}`);
        console.warn("Stop npm run dev, then run: npm run clean");
      } else {
        await sleep(300);
      }
    }
  }
}

for (const dir of dirs) {
  await removeDir(dir);
}

console.log("Cache clean complete");
