import { NextRequest, NextResponse } from "next/server";
import { mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import {
  pdfToWord,
  pdfToExcel,
  pdfToJpg,
  wordToPdf,
  jpgToPdf,
  compressPdf,
  mergePdfs,
  splitPdf,
  rotatePdf,
  pdfToPpt,
  excelToPdf,
  unlockPdf,
} from "@/lib/converters";

export async function POST(request: NextRequest) {
  try {
    const { filename, conversionType, options } = await request.json();

    if (!filename || !conversionType) {
      return NextResponse.json(
        { error: "Missing filename or conversion type" },
        { status: 400 }
      );
    }

    const uploadsDir = join(process.cwd(), "uploads");
    const outputDir = join(process.cwd(), "outputs");

    // Create output directory if it doesn't exist
    if (!existsSync(outputDir)) {
      await mkdir(outputDir, { recursive: true });
    }

    const inputPath = join(uploadsDir, filename);
    const timestamp = Date.now();
    let result;

    switch (conversionType) {
      case "pdf-to-word":
        const wordOutput = join(outputDir, `${timestamp}-converted.docx`);
        result = await pdfToWord(inputPath, wordOutput);
        break;

      case "pdf-to-excel":
        const excelOutput = join(outputDir, `${timestamp}-converted.xlsx`);
        result = await pdfToExcel(inputPath, excelOutput);
        break;

      case "pdf-to-jpg":
        result = await pdfToJpg(inputPath, outputDir);
        break;

      case "word-to-pdf":
        const wordPdfOutput = join(outputDir, `${timestamp}-converted.pdf`);
        result = await wordToPdf(inputPath, wordPdfOutput);
        break;

      case "jpg-to-pdf":
        const jpgPdfOutput = join(outputDir, `${timestamp}-converted.pdf`);
        result = await jpgToPdf(inputPath, jpgPdfOutput);
        break;

      case "compress-pdf":
        const compressOutput = join(outputDir, `${timestamp}-compressed.pdf`);
        result = await compressPdf(inputPath, compressOutput);
        break;

      case "merge-pdf":
        const mergeOutput = join(outputDir, `${timestamp}-merged.pdf`);
        const filesToMerge = options?.files || [inputPath];
        result = await mergePdfs(filesToMerge, mergeOutput);
        break;

      case "split-pdf":
        result = await splitPdf(inputPath, outputDir, options?.pageRanges);
        break;

      case "rotate-pdf":
        const rotateOutput = join(outputDir, `${timestamp}-rotated.pdf`);
        result = await rotatePdf(inputPath, rotateOutput, options?.rotation || 90);
        break;

      case "pdf-to-ppt":
        const pptOutput = join(outputDir, `${timestamp}-converted.pptx`);
        result = await pdfToPpt(inputPath, pptOutput);
        break;

      case "excel-to-pdf":
        const excelPdfOutput = join(outputDir, `${timestamp}-converted.pdf`);
        result = await excelToPdf(inputPath, excelPdfOutput);
        break;

      case "unlock-pdf":
        const unlockOutput = join(outputDir, `${timestamp}-unlocked.pdf`);
        result = await unlockPdf(inputPath, unlockOutput, options?.password);
        break;

      default:
        return NextResponse.json(
          { error: "Unsupported conversion type" },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Conversion failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `File converted successfully`,
      filename: result.outputFilename,
      downloadUrl: `/api/download/${result.outputFilename}`,
    });
  } catch (error) {
    console.error("Conversion error:", error);
    return NextResponse.json(
      { error: "Failed to convert file" },
      { status: 500 }
    );
  }
}
