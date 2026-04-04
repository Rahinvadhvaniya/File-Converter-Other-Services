import { NextRequest, NextResponse } from "next/server";
import { readFile, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await context.params;

    if (!filename) {
      return NextResponse.json(
        { error: "Missing filename" },
        { status: 400 }
      );
    }

    const outputDir = join(process.cwd(), "outputs");
    const filePath = join(outputDir, filename);

    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    const fileBuffer = await readFile(filePath);

    // Determine content type based on file extension
    const extension = filename.split('.').pop()?.toLowerCase();
    let contentType = "application/octet-stream";

    const contentTypes: Record<string, string> = {
      pdf: "application/pdf",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      doc: "application/msword",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      xls: "application/vnd.ms-excel",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ppt: "application/vnd.ms-powerpoint",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      html: "text/html",
    };

    if (extension && contentTypes[extension]) {
      contentType = contentTypes[extension];
    }

    // Clean up file after download (optional - you might want to keep files for a while)
    // Uncomment the line below to delete files immediately after download
    // setTimeout(() => unlink(filePath).catch(console.error), 5000);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 }
    );
  }
}
