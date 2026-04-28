import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { validateFile, sanitizeFilename } from "@/lib/validation";
import { cleanupOldFiles } from "@/lib/cleanup";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    try {
      validateFile({ size: file.size, name: file.name });
    } catch (e: unknown) {
      return NextResponse.json({ error: (e as Error).message }, { status: 400 });
    }

    const sanitizedName = sanitizeFilename(file.name);

    const uploadsDir = join(process.cwd(), "uploads");
    if (!existsSync(uploadsDir)) await mkdir(uploadsDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const filename = `${timestamp}-${sanitizedName}`;
    const filepath = join(uploadsDir, filename);
    await writeFile(filepath, buffer);

    cleanupOldFiles().catch((err) => console.error("Cleanup failed:", err));

    return NextResponse.json({
      success: true,
      filename,
      originalName: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
