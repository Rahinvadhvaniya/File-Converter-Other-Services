export type ConversionType =
  | "pdf-to-word"
  | "pdf-to-excel"
  | "pdf-to-jpg"
  | "word-to-pdf"
  | "jpg-to-pdf"
  | "compress-pdf"
  | "merge-pdf"
  | "split-pdf"
  | "rotate-pdf"
  | "pdf-to-ppt"
  | "excel-to-pdf"
  | "unlock-pdf";

export interface ConversionOptions {
  files?: string[];
  pageRanges?: { start: number; end: number }[];
  rotation?: number;
  password?: string;
  quality?: number;
}

export interface UploadResponse {
  success: boolean;
  filename: string;
  originalName: string;
  size: number;
  type: string;
}

export interface ConversionResponse {
  success: boolean;
  message?: string;
  filename?: string;
  downloadUrl?: string;
  error?: string;
}
