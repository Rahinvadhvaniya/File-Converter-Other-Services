import { NextRequest, NextResponse } from "next/server";
import { readFile, stat, readdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    if (!filename) {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 }
      );
    }

    const uploadsDir = join(process.cwd(), "uploads");
    const filePath = join(uploadsDir, filename);

    // Check if it's a directory (for multi-file outputs like split PDFs)
    if (existsSync(filePath)) {
      const stats = await stat(filePath);

      if (stats.isDirectory()) {
        // For directories, we would zip the contents
        // For now, return an error asking for a specific file
        const files = await readdir(filePath);
        return NextResponse.json({
          error: "Directory download not implemented",
          message: "Please request a specific file",
          files,
        }, { status: 501 });
      }

      // Read the file
      const fileBuffer = await readFile(filePath);

      // Determine content type based on extension
      const ext = filename.split(".").pop()?.toLowerCase();
      let contentType = "application/octet-stream";

      switch (ext) {
        case "pdf":
          contentType = "application/pdf";
          break;
        case "docx":
          contentType =
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
          break;
        case "xlsx":
          contentType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
          break;
        case "pptx":
          contentType =
            "application/vnd.openxmlformats-officedocument.presentationml.presentation";
          break;
        case "jpg":
        case "jpeg":
          contentType = "image/jpeg";
          break;
        case "png":
          contentType = "image/png";
          break;
        case "zip":
          contentType = "application/zip";
          break;
      }

      // Return the file with appropriate headers
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Content-Length": fileBuffer.length.toString(),
        },
      });
    }

    return NextResponse.json(
      { error: "File not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 }
    );
  }
}
