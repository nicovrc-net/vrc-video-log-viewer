import { rmSync } from "node:fs";
import { platform } from "node:os";
import { join } from "node:path";

const distPath = join(process.cwd(), "dist");

try {
  rmSync(distPath, { recursive: true, force: true });
  console.log(`[Info] Cleared: ${distPath}`);
} catch (e) {
  console.error(`[Error] Failed to clear dist folder:`, e);
}
