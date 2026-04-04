import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, unlink, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import {
  compressPdf,
  mergePdfs,
  splitPdf,
  rotatePdf,
  unlockPdf,
  pdfToJpg,
  jpgToPdf,
  pngToPdf,
  imageToPdf,
  pdfToWord,
  pdfToExcel,
  pdfToPowerPoint,
  wordToPdf,
  excelToPdf,
  powerPointToPdf,
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
    const inputPath = join(uploadsDir, filename);

    // Check if input file exists
    if (!existsSync(inputPath)) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    // Generate output filename
    const timestamp = Date.now();
    let outputFilename: string;
    let outputPath: string;
    let downloadUrl: string;

    switch (conversionType) {
      case "pdf-to-word":
        outputFilename = `${timestamp}-converted.docx`;
        outputPath = join(uploadsDir, outputFilename);
        await pdfToWord(inputPath, outputPath);
        downloadUrl = `/api/download/${outputFilename}`;
        break;

      case "pdf-to-excel":
        outputFilename = `${timestamp}-converted.xlsx`;
        outputPath = join(uploadsDir, outputFilename);
        await pdfToExcel(inputPath, outputPath);
        downloadUrl = `/api/download/${outputFilename}`;
        break;

      case "pdf-to-ppt":
      case "pdf-to-powerpoint":
        outputFilename = `${timestamp}-converted.pptx`;
        outputPath = join(uploadsDir, outputFilename);
        await pdfToPowerPoint(inputPath, outputPath);
        downloadUrl = `/api/download/${outputFilename}`;
        break;

      case "pdf-to-jpg":
        const jpgOutputDir = join(uploadsDir, `${timestamp}-jpg`);
        if (!existsSync(jpgOutputDir)) {
          await mkdir(jpgOutputDir, { recursive: true });
        }
        const jpgFiles = await pdfToJpg(inputPath, jpgOutputDir, options);
        outputFilename = `${timestamp}-images.zip`; // In production, zip the images
        downloadUrl = `/api/download/${timestamp}-jpg`; // Return directory or zip
        break;

      case "word-to-pdf":
        outputFilename = `${timestamp}-converted.pdf`;
        outputPath = join(uploadsDir, outputFilename);
        await wordToPdf(inputPath, outputPath);
        downloadUrl = `/api/download/${outputFilename}`;
        break;

      case "excel-to-pdf":
        outputFilename = `${timestamp}-converted.pdf`;
        outputPath = join(uploadsDir, outputFilename);
        await excelToPdf(inputPath, outputPath);
        downloadUrl = `/api/download/${outputFilename}`;
        break;

      case "ppt-to-pdf":
      case "powerpoint-to-pdf":
        outputFilename = `${timestamp}-converted.pdf`;
        outputPath = join(uploadsDir, outputFilename);
        await powerPointToPdf(inputPath, outputPath);
        downloadUrl = `/api/download/${outputFilename}`;
        break;

      case "jpg-to-pdf":
      case "png-to-pdf":
      case "image-to-pdf":
        outputFilename = `${timestamp}-converted.pdf`;
        outputPath = join(uploadsDir, outputFilename);
        if (conversionType === "jpg-to-pdf") {
          await jpgToPdf(inputPath, outputPath);
        } else if (conversionType === "png-to-pdf") {
          await pngToPdf(inputPath, outputPath);
        } else {
          await imageToPdf([inputPath], outputPath, options);
        }
        downloadUrl = `/api/download/${outputFilename}`;
        break;

      case "compress-pdf":
        outputFilename = `${timestamp}-compressed.pdf`;
        outputPath = join(uploadsDir, outputFilename);
        await compressPdf(inputPath, outputPath);
        downloadUrl = `/api/download/${outputFilename}`;
        break;

      case "merge-pdf":
        if (!options?.filenames || !Array.isArray(options.filenames)) {
          return NextResponse.json(
            { error: "Multiple files required for merging" },
            { status: 400 }
          );
        }
        const inputPaths = options.filenames.map((f: string) =>
          join(uploadsDir, f)
        );
        outputFilename = `${timestamp}-merged.pdf`;
        outputPath = join(uploadsDir, outputFilename);
        await mergePdfs(inputPaths, outputPath);
        downloadUrl = `/api/download/${outputFilename}`;
        break;

      case "split-pdf":
        const splitOutputDir = join(uploadsDir, `${timestamp}-split`);
        if (!existsSync(splitOutputDir)) {
          await mkdir(splitOutputDir, { recursive: true });
        }
        const splitFiles = await splitPdf(
          inputPath,
          splitOutputDir,
          options?.pageRanges
        );
        outputFilename = `${timestamp}-split.zip`; // In production, zip the files
        downloadUrl = `/api/download/${timestamp}-split`; // Return directory or zip
        break;

      case "rotate-pdf":
        outputFilename = `${timestamp}-rotated.pdf`;
        outputPath = join(uploadsDir, outputFilename);
        const rotation = options?.rotation || 90;
        await rotatePdf(inputPath, outputPath, rotation, options?.pageNumbers);
        downloadUrl = `/api/download/${outputFilename}`;
        break;

      case "unlock-pdf":
        outputFilename = `${timestamp}-unlocked.pdf`;
        outputPath = join(uploadsDir, outputFilename);
        await unlockPdf(inputPath, outputPath, options?.password);
        downloadUrl = `/api/download/${outputFilename}`;
        break;

      default:
        return NextResponse.json(
          { error: "Unsupported conversion type" },
          { status: 400 }
        );
    }

    // Clean up input file after conversion
    try {
      await unlink(inputPath);
    } catch (error) {
      console.warn("Failed to delete input file:", error);
    }

    return NextResponse.json({
      success: true,
      message: `File converted successfully`,
      downloadUrl,
      outputFilename,
    });
  } catch (error) {
    console.error("Conversion error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to convert file" },
      { status: 500 }
    );
  }
}
