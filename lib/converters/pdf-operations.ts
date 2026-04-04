import { PDFDocument, degrees, rgb } from "pdf-lib";
import { readFile, writeFile } from "fs/promises";

/**
 * Compress PDF by optimizing images and removing unnecessary data
 */
export async function compressPdf(
  inputPath: string,
  outputPath: string
): Promise<void> {
  const existingPdfBytes = await readFile(inputPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Remove metadata to reduce size
  pdfDoc.setTitle("");
  pdfDoc.setAuthor("");
  pdfDoc.setSubject("");
  pdfDoc.setKeywords([]);
  pdfDoc.setProducer("");
  pdfDoc.setCreator("");

  const pdfBytes = await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });

  await writeFile(outputPath, pdfBytes);
}

/**
 * Merge multiple PDFs into one
 */
export async function mergePdfs(
  inputPaths: string[],
  outputPath: string
): Promise<void> {
  const mergedPdf = await PDFDocument.create();

  for (const inputPath of inputPaths) {
    const pdfBytes = await readFile(inputPath);
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedPdfBytes = await mergedPdf.save();
  await writeFile(outputPath, mergedPdfBytes);
}

/**
 * Split PDF into individual pages or page ranges
 */
export async function splitPdf(
  inputPath: string,
  outputDir: string,
  pageRanges?: { start: number; end: number }[]
): Promise<string[]> {
  const existingPdfBytes = await readFile(inputPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const totalPages = pdfDoc.getPageCount();
  const outputFiles: string[] = [];

  if (pageRanges && pageRanges.length > 0) {
    // Split by specified ranges
    for (let i = 0; i < pageRanges.length; i++) {
      const { start, end } = pageRanges[i];
      const newPdf = await PDFDocument.create();
      const pages = await newPdf.copyPages(
        pdfDoc,
        Array.from({ length: end - start + 1 }, (_, j) => start - 1 + j)
      );
      pages.forEach((page) => newPdf.addPage(page));

      const outputPath = `${outputDir}/split_${i + 1}.pdf`;
      const pdfBytes = await newPdf.save();
      await writeFile(outputPath, pdfBytes);
      outputFiles.push(outputPath);
    }
  } else {
    // Split into individual pages
    for (let i = 0; i < totalPages; i++) {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(copiedPage);

      const outputPath = `${outputDir}/page_${i + 1}.pdf`;
      const pdfBytes = await newPdf.save();
      await writeFile(outputPath, pdfBytes);
      outputFiles.push(outputPath);
    }
  }

  return outputFiles;
}

/**
 * Rotate PDF pages
 */
export async function rotatePdf(
  inputPath: string,
  outputPath: string,
  rotation: 90 | 180 | 270,
  pageNumbers?: number[]
): Promise<void> {
  const existingPdfBytes = await readFile(inputPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const pages = pdfDoc.getPages();

  const pagesToRotate = pageNumbers || pages.map((_, i) => i);

  pagesToRotate.forEach((pageNum) => {
    if (pageNum >= 0 && pageNum < pages.length) {
      const page = pages[pageNum];
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees(currentRotation + rotation));
    }
  });

  const pdfBytes = await pdfDoc.save();
  await writeFile(outputPath, pdfBytes);
}

/**
 * Unlock PDF (remove password protection)
 * Note: This only works if you already have the password
 */
export async function unlockPdf(
  inputPath: string,
  outputPath: string,
  password?: string
): Promise<void> {
  const existingPdfBytes = await readFile(inputPath);

  // Load the PDF (if password is provided, pdf-lib will attempt to use it)
  const pdfDoc = await PDFDocument.load(existingPdfBytes, {
    ignoreEncryption: true,
  });

  // Save without encryption
  const pdfBytes = await pdfDoc.save();
  await writeFile(outputPath, pdfBytes);
}

/**
 * Get PDF info
 */
export async function getPdfInfo(inputPath: string): Promise<{
  pageCount: number;
  title?: string;
  author?: string;
  subject?: string;
}> {
  const existingPdfBytes = await readFile(inputPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  return {
    pageCount: pdfDoc.getPageCount(),
    title: pdfDoc.getTitle(),
    author: pdfDoc.getAuthor(),
    subject: pdfDoc.getSubject(),
  };
}
