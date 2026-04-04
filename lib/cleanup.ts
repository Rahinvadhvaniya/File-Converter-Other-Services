import { readdir, stat, unlink } from "fs/promises";
import { join } from "path";

/**
 * Clean up files older than the specified age in a directory
 * @param directory - Directory to clean
 * @param maxAgeMs - Maximum age in milliseconds (default: 1 hour)
 */
export async function cleanupOldFiles(
  directory: string,
  maxAgeMs: number = 60 * 60 * 1000 // 1 hour default
): Promise<void> {
  try {
    const files = await readdir(directory);
    const now = Date.now();

    for (const file of files) {
      const filePath = join(directory, file);
      const stats = await stat(filePath);

      if (stats.isFile()) {
        const age = now - stats.mtimeMs;
        if (age > maxAgeMs) {
          await unlink(filePath);
          console.log(`Deleted old file: ${file}`);
        }
      }
    }
  } catch (error) {
    console.error("Cleanup error:", error);
  }
}

/**
 * Schedule periodic cleanup
 * @param directory - Directory to clean
 * @param intervalMs - Cleanup interval in milliseconds
 * @param maxAgeMs - Maximum file age in milliseconds
 */
export function scheduleCleanup(
  directory: string,
  intervalMs: number = 30 * 60 * 1000, // 30 minutes
  maxAgeMs: number = 60 * 60 * 1000 // 1 hour
): NodeJS.Timeout {
  return setInterval(() => {
    cleanupOldFiles(directory, maxAgeMs);
  }, intervalMs);
}
