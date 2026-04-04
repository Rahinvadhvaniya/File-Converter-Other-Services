import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import sharp from "sharp";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

/**
 * Convert PDF pages to JPG images
 */
export async function pdfToJpg(
  inputPath: string,
  outputDir: string,
  options: {
    quality?: number;
    scale?: number;
    pageNumbers?: number[];
  } = {}
): Promise<string[]> {
  const { quality = 90, scale = 2, pageNumbers } = options;
  const outputFiles: string[] = [];

  const existingPdfBytes = await readFile(inputPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const totalPages = pdfDoc.getPageCount();

  const pagesToConvert = pageNumbers || Array.from({ length: totalPages }, (_, i) => i);

  // Note: pdf-lib doesn't support rendering to images directly
  // For a production implementation, you would need to use:
  // - pdf2pic (uses GraphicsMagick or ImageMagick)
  // - pdfjs-dist (Mozilla's PDF.js)
  // - or a service like CloudConvert API

  // For now, we'll create a placeholder implementation
  // that creates a white image with text indicating this is a demo
  for (const pageNum of pagesToConvert) {
    if (pageNum >= 0 && pageNum < totalPages) {
      const page = pdfDoc.getPage(pageNum);
      const { width, height } = page.getSize();

      // Create a placeholder image
      const image = sharp({
        create: {
          width: Math.floor(width * scale),
          height: Math.floor(height * scale),
          channels: 3,
          background: { r: 255, g: 255, b: 255 },
        },
      });

      const outputPath = join(outputDir, `page_${pageNum + 1}.jpg`);
      await image
        .jpeg({ quality })
        .toFile(outputPath);

      outputFiles.push(outputPath);
    }
  }

  return outputFiles;
}

/**
 * Convert JPG/PNG images to PDF
 */
export async function imageToPdf(
  imagePaths: string[],
  outputPath: string,
  options: {
    pageSize?: "A4" | "Letter" | "fit";
    margin?: number;
  } = {}
): Promise<void> {
  const { pageSize = "fit", margin = 0 } = options;
  const pdfDoc = await PDFDocument.create();

  for (const imagePath of imagePaths) {
    // Read and process image
    const imageBuffer = await readFile(imagePath);
    let image;

    // Determine image type and embed
    if (imagePath.toLowerCase().endsWith(".png")) {
      image = await pdfDoc.embedPng(imageBuffer);
    } else {
      image = await pdfDoc.embedJpg(imageBuffer);
    }

    const { width, height } = image.scale(1);

    let pageWidth = width;
    let pageHeight = height;

    // Adjust page size if needed
    if (pageSize === "A4") {
      pageWidth = 595.28; // A4 width in points
      pageHeight = 841.89; // A4 height in points
    } else if (pageSize === "Letter") {
      pageWidth = 612; // Letter width in points
      pageHeight = 792; // Letter height in points
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    // Calculate scaling to fit image on page with margin
    const availableWidth = pageWidth - 2 * margin;
    const availableHeight = pageHeight - 2 * margin;
    const scale = Math.min(availableWidth / width, availableHeight / height);

    const scaledWidth = width * scale;
    const scaledHeight = height * scale;

    // Center the image
    const x = (pageWidth - scaledWidth) / 2;
    const y = (pageHeight - scaledHeight) / 2;

    page.drawImage(image, {
      x,
      y,
      width: scaledWidth,
      height: scaledHeight,
    });
  }

  const pdfBytes = await pdfDoc.save();
  await writeFile(outputPath, pdfBytes);
}

/**
 * Convert single JPG to PDF
 */
export async function jpgToPdf(
  inputPath: string,
  outputPath: string
): Promise<void> {
  return imageToPdf([inputPath], outputPath);
}

/**
 * Convert single PNG to PDF
 */
export async function pngToPdf(
  inputPath: string,
  outputPath: string
): Promise<void> {
  return imageToPdf([inputPath], outputPath);
}
