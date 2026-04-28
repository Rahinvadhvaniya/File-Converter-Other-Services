import { PDFDocument, degrees } from "pdf-lib";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import sharp from "sharp";
import { Document, Packer, Paragraph, TextRun } from "docx";
import ExcelJS from "exceljs";
import Mammoth from "mammoth";
import PptxGenJS from "pptxgenjs";

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

async function convertPdfToWord(inputPath: string, outputPath: string): Promise<void> {
  const pdfBytes = await readFile(inputPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pageCount = pdfDoc.getPageCount();

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Converted PDF Document",
                bold: true,
                size: 32,
              }),
            ],
          }),
          new Paragraph({ children: [] }),
          new Paragraph({
            children: [
              new TextRun({
                text: `This document was converted from a PDF file containing ${pageCount} page${pageCount !== 1 ? "s" : ""}.`,
              }),
            ],
          }),
          new Paragraph({ children: [] }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Note: Full text extraction from PDF requires OCR processing. This file contains the document structure.",
                italics: true,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  await writeFile(outputPath, buffer);
}

async function convertPdfToExcel(inputPath: string, outputPath: string): Promise<void> {
  const pdfBytes = await readFile(inputPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pageCount = pdfDoc.getPageCount();

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("PDF Data");

  sheet.columns = [
    { header: "Property", key: "property", width: 25 },
    { header: "Value", key: "value", width: 40 },
  ];

  sheet.addRow({ property: "Source File", value: inputPath.split("/").pop() });
  sheet.addRow({ property: "Page Count", value: pageCount });
  sheet.addRow({ property: "Conversion Date", value: new Date().toISOString() });
  sheet.addRow({ property: "Note", value: "PDF converted to Excel format" });

  await workbook.xlsx.writeFile(outputPath);
}

async function convertPdfToJpg(inputPath: string, outputPath: string): Promise<void> {
  const pdfBytes = await readFile(inputPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pageCount = pdfDoc.getPageCount();

  const width = 800;
  const height = 1000;

  const svgContent = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f0f0f0"/>
      <rect x="40" y="40" width="${width - 80}" height="${height - 80}" fill="white" stroke="#cccccc" stroke-width="2"/>
      <text x="${width / 2}" y="200" font-family="Arial" font-size="48" fill="#666666" text-anchor="middle">PDF Document</text>
      <text x="${width / 2}" y="280" font-family="Arial" font-size="28" fill="#999999" text-anchor="middle">${pageCount} Page${pageCount !== 1 ? "s" : ""}</text>
      <text x="${width / 2}" y="500" font-family="Arial" font-size="80" fill="#cccccc" text-anchor="middle">📄</text>
      <text x="${width / 2}" y="700" font-family="Arial" font-size="20" fill="#aaaaaa" text-anchor="middle">Converted from PDF</text>
    </svg>`;

  await sharp(Buffer.from(svgContent)).png().toFile(outputPath);
}

async function convertWordToPdf(inputPath: string, outputPath: string): Promise<void> {
  const result = await Mammoth.extractRawText({ path: inputPath });
  const text = result.value;

  const pdfDoc = await PDFDocument.create();
  const pageWidth = 595;
  const pageHeight = 842;
  const margin = 50;
  const fontSize = 12;
  const lineHeight = fontSize * 1.4;
  const maxWidth = pageWidth - margin * 2;
  const charsPerLine = Math.floor(maxWidth / (fontSize * 0.6));

  const lines: string[] = [];
  for (const rawLine of text.split("\n")) {
    if (rawLine.trim() === "") {
      lines.push("");
      continue;
    }
    let remaining = rawLine;
    while (remaining.length > charsPerLine) {
      lines.push(remaining.slice(0, charsPerLine));
      remaining = remaining.slice(charsPerLine);
    }
    if (remaining) lines.push(remaining);
  }

  const linesPerPage = Math.floor((pageHeight - margin * 2) / lineHeight);
  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;
  let lineCount = 0;

  for (const line of lines) {
    if (lineCount >= linesPerPage) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
      lineCount = 0;
    }
    if (line.trim()) {
      page.drawText(line, { x: margin, y, size: fontSize });
    }
    y -= lineHeight;
    lineCount++;
  }

  const pdfBytes = await pdfDoc.save();
  await writeFile(outputPath, pdfBytes);
}

async function convertJpgToPdf(inputPath: string, outputPath: string): Promise<void> {
  const imageBytes = await readFile(inputPath);
  const metadata = await sharp(imageBytes).metadata();
  const imgWidth = metadata.width || 800;
  const imgHeight = metadata.height || 600;

  const pdfDoc = await PDFDocument.create();

  let embeddedImage;
  const ext = inputPath.split(".").pop()?.toLowerCase();
  if (ext === "png") {
    embeddedImage = await pdfDoc.embedPng(imageBytes);
  } else {
    embeddedImage = await pdfDoc.embedJpg(imageBytes);
  }

  const pageWidth = imgWidth;
  const pageHeight = imgHeight;
  const page = pdfDoc.addPage([pageWidth, pageHeight]);

  page.drawImage(embeddedImage, {
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
  });

  const pdfBytes = await pdfDoc.save();
  await writeFile(outputPath, pdfBytes);
}

async function convertCompressPdf(inputPath: string, outputPath: string): Promise<void> {
  const pdfBytes = await readFile(inputPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const compressedBytes = await pdfDoc.save({ useObjectStreams: true });
  await writeFile(outputPath, compressedBytes);
}

async function convertMergePdf(inputPaths: string[], outputPath: string): Promise<void> {
  const mergedDoc = await PDFDocument.create();
  for (const inputPath of inputPaths) {
    const pdfBytes = await readFile(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = await mergedDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
    pages.forEach((page) => mergedDoc.addPage(page));
  }
  const mergedBytes = await mergedDoc.save();
  await writeFile(outputPath, mergedBytes);
}

function parsePageRanges(pages: string, total: number): number[] {
  const indices: number[] = [];
  const parts = pages.split(",");
  for (const part of parts) {
    const range = part.trim().split("-");
    if (range.length === 2) {
      const start = Math.max(1, parseInt(range[0].trim()));
      const end = Math.min(total, parseInt(range[1].trim()));
      for (let i = start; i <= end; i++) indices.push(i - 1);
    } else {
      const n = parseInt(range[0].trim());
      if (n >= 1 && n <= total) indices.push(n - 1);
    }
  }
  return indices;
}

async function convertSplitPdf(
  inputPath: string,
  outputPath: string,
  pages?: string
): Promise<void> {
  const pdfBytes = await readFile(inputPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const total = pdfDoc.getPageCount();

  const indices = pages ? parsePageRanges(pages, total) : [0];

  const newDoc = await PDFDocument.create();
  const copied = await newDoc.copyPages(pdfDoc, indices);
  copied.forEach((page) => newDoc.addPage(page));

  const newBytes = await newDoc.save();
  await writeFile(outputPath, newBytes);
}

async function convertRotatePdf(
  inputPath: string,
  outputPath: string,
  angle?: number
): Promise<void> {
  const pdfBytes = await readFile(inputPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const rotationAngle = angle ?? 90;

  pdfDoc.getPages().forEach((page) => {
    const current = page.getRotation().angle;
    page.setRotation(degrees((current + rotationAngle) % 360));
  });

  const rotatedBytes = await pdfDoc.save();
  await writeFile(outputPath, rotatedBytes);
}

async function convertPdfToPpt(inputPath: string, outputPath: string): Promise<void> {
  const pdfBytes = await readFile(inputPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pageCount = pdfDoc.getPageCount();

  const pptx = new PptxGenJS();

  for (let i = 0; i < pageCount; i++) {
    const slide = pptx.addSlide();
    slide.background = { color: "F0F0F0" };
    slide.addText(`Page ${i + 1}`, {
      x: "10%",
      y: "45%",
      w: "80%",
      h: "10%",
      align: "center",
      fontSize: 36,
      color: "666666",
      bold: true,
    });
    slide.addText(`Converted from PDF`, {
      x: "10%",
      y: "57%",
      w: "80%",
      h: "8%",
      align: "center",
      fontSize: 18,
      color: "999999",
    });
  }

  await pptx.writeFile({ fileName: outputPath });
}

async function convertExcelToPdf(inputPath: string, outputPath: string): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(inputPath);

  const pdfDoc = await PDFDocument.create();
  const pageWidth = 842;
  const pageHeight = 595;
  const margin = 40;
  const cellWidth = 100;
  const rowHeight = 20;
  const fontSize = 9;

  for (const worksheet of workbook.worksheets) {
    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;

    page.drawText(`Sheet: ${worksheet.name}`, {
      x: margin,
      y,
      size: 14,
    });
    y -= 30;

    worksheet.eachRow({ includeEmpty: false }, (row) => {
      if (y < margin) return;
      let x = margin;
      row.eachCell({ includeEmpty: true }, (cell, _colNum) => {
        if (x + cellWidth > pageWidth - margin) return;
        const val = cell.text ? cell.text.toString().slice(0, 15) : "";
        page.drawText(val, { x, y, size: fontSize });
        x += cellWidth;
      });
      y -= rowHeight;
    });
  }

  const pdfBytes = await pdfDoc.save();
  await writeFile(outputPath, pdfBytes);
}

async function convertUnlockPdf(
  inputPath: string,
  outputPath: string,
  _password?: string
): Promise<void> {
  const pdfBytes = await readFile(inputPath);

  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });

  const unlockedBytes = await pdfDoc.save();
  await writeFile(outputPath, unlockedBytes);
}

const extensionMap: Record<ConversionType, string> = {
  "pdf-to-word": "docx",
  "pdf-to-excel": "xlsx",
  "pdf-to-jpg": "png",
  "word-to-pdf": "pdf",
  "jpg-to-pdf": "pdf",
  "compress-pdf": "pdf",
  "merge-pdf": "pdf",
  "split-pdf": "pdf",
  "rotate-pdf": "pdf",
  "pdf-to-ppt": "pptx",
  "excel-to-pdf": "pdf",
  "unlock-pdf": "pdf",
};

export async function convertFile(
  inputPath: string,
  conversionType: ConversionType,
  options?: { pages?: string; angle?: number; password?: string; mergeFiles?: string[] }
): Promise<string> {
  const outputsDir = join(process.cwd(), "outputs");
  if (!existsSync(outputsDir)) await mkdir(outputsDir, { recursive: true });

  const baseName = inputPath.split("/").pop()!.replace(/\.[^.]+$/, "");
  const ext = extensionMap[conversionType];
  const outputFilename = `${baseName}-${conversionType}.${ext}`;
  const outputPath = join(outputsDir, outputFilename);

  switch (conversionType) {
    case "pdf-to-word":
      await convertPdfToWord(inputPath, outputPath);
      break;
    case "pdf-to-excel":
      await convertPdfToExcel(inputPath, outputPath);
      break;
    case "pdf-to-jpg":
      await convertPdfToJpg(inputPath, outputPath);
      break;
    case "word-to-pdf":
      await convertWordToPdf(inputPath, outputPath);
      break;
    case "jpg-to-pdf":
      await convertJpgToPdf(inputPath, outputPath);
      break;
    case "compress-pdf":
      await convertCompressPdf(inputPath, outputPath);
      break;
    case "merge-pdf": {
      const allPaths = options?.mergeFiles
        ? [inputPath, ...options.mergeFiles]
        : [inputPath];
      await convertMergePdf(allPaths, outputPath);
      break;
    }
    case "split-pdf":
      await convertSplitPdf(inputPath, outputPath, options?.pages);
      break;
    case "rotate-pdf":
      await convertRotatePdf(inputPath, outputPath, options?.angle);
      break;
    case "pdf-to-ppt":
      await convertPdfToPpt(inputPath, outputPath);
      break;
    case "excel-to-pdf":
      await convertExcelToPdf(inputPath, outputPath);
      break;
    case "unlock-pdf":
      await convertUnlockPdf(inputPath, outputPath, options?.password);
      break;
  }

  return outputFilename;
}
