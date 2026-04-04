const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export const ALLOWED_FILE_TYPES: Record<string, string[]> = {
  "pdf-to-word": [".pdf"],
  "pdf-to-excel": [".pdf"],
  "pdf-to-jpg": [".pdf"],
  "word-to-pdf": [".doc", ".docx"],
  "jpg-to-pdf": [".jpg", ".jpeg", ".png"],
  "compress-pdf": [".pdf"],
  "merge-pdf": [".pdf"],
  "split-pdf": [".pdf"],
  "rotate-pdf": [".pdf"],
  "pdf-to-ppt": [".pdf"],
  "excel-to-pdf": [".xls", ".xlsx"],
  "unlock-pdf": [".pdf"],
};

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate file size
 */
export function validateFileSize(size: number): ValidationResult {
  if (size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }
  return { valid: true };
}

/**
 * Validate file type for conversion
 */
export function validateFileType(
  filename: string,
  conversionType: string
): ValidationResult {
  const extension = `.${filename.split('.').pop()?.toLowerCase()}`;
  const allowedTypes = ALLOWED_FILE_TYPES[conversionType];

  if (!allowedTypes) {
    return {
      valid: false,
      error: "Invalid conversion type",
    };
  }

  if (!allowedTypes.includes(extension)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`,
    };
  }

  return { valid: true };
}

/**
 * Sanitize filename to prevent path traversal
 */
export function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9.-]/g, "_");
}
