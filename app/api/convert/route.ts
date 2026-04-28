import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { existsSync } from "fs";
import { convertFile, ConversionType } from "@/lib/converters";
import { sanitizeFilename } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filename, conversionType, options } = body;

    if (!filename || !conversionType) {
      return NextResponse.json({ error: "Missing filename or conversion type" }, { status: 400 });
    }

    const safeFilename = sanitizeFilename(filename);
    const uploadsDir = join(process.cwd(), "uploads");
    const inputPath = join(uploadsDir, safeFilename);

    if (!existsSync(inputPath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const outputFilename = await convertFile(inputPath, conversionType as ConversionType, options);

    return NextResponse.json({
      success: true,
      message: `File converted successfully`,
      downloadUrl: `/api/download/${outputFilename}`,
      filename: outputFilename,
    });
  } catch (error) {
    console.error("Conversion error:", error);
    return NextResponse.json({ error: "Failed to convert file" }, { status: 500 });
  }
}
