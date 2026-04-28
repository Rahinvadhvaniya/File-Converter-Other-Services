import { readdir, stat, unlink } from "fs/promises";
import { join } from "path";

const ONE_HOUR = 60 * 60 * 1000;

export async function cleanupOldFiles(): Promise<void> {
  const dirs = [join(process.cwd(), "uploads"), join(process.cwd(), "outputs")];
  const now = Date.now();
  for (const dir of dirs) {
    try {
      const files = await readdir(dir);
      for (const file of files) {
        const filePath = join(dir, file);
        const stats = await stat(filePath);
        if (now - stats.mtimeMs > ONE_HOUR) {
          await unlink(filePath).catch(() => {});
        }
      }
    } catch {
      // directory may not exist
    }
  }
}
