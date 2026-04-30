import { basename } from "path";

export const MAX_FILE_SIZE = 50 * 1024 * 1024;

export function validateFile(file: { size: number; name: string; type?: string }): void {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds 50MB limit`);
  }
}

export function sanitizeFilename(filename: string): string {
  const base = basename(filename).replace(/\s+/g, "_");
  if (base.includes("..")) throw new Error("Invalid filename");
  const safe = base.replace(/[^a-zA-Z0-9._\-]/g, "");
  if (!safe || safe.startsWith(".")) {
    throw new Error("Invalid filename");
  }
  return safe;
}
