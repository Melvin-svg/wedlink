import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export interface UploadResult {
  url: string;
  filename: string;
  sizeBytes: number;
  mimeType: string;
}

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export interface DetectedImage {
  mime: string;
  ext: string;
}

/**
 * Inspects leading magic bytes to identify valid image binaries.
 * Prevents disguised files (e.g. HTML/SVG/executables) from masquerading as images.
 */
export function detectImageMagicBytes(buffer: Buffer): DetectedImage | null {
  if (buffer.length < 12) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mime: "image/jpeg", ext: ".jpg" };
  }

  // PNG: 89 50 4E 47
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return { mime: "image/png", ext: ".png" };
  }

  // WEBP: RIFF .... WEBP
  const riff = buffer.toString("ascii", 0, 4);
  const webp = buffer.toString("ascii", 8, 12);
  if (riff === "RIFF" && webp === "WEBP") {
    return { mime: "image/webp", ext: ".webp" };
  }

  // AVIF: ....ftypavif or ftypavis or mif1
  const ftyp = buffer.toString("ascii", 4, 8);
  const brand = buffer.toString("ascii", 8, 12);
  if (ftyp === "ftyp" && (brand === "avif" || brand === "avis" || brand === "mif1")) {
    return { mime: "image/avif", ext: ".avif" };
  }

  return null;
}

export async function saveLocalUpload(file: File): Promise<UploadResult> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File exceeds maximum allowed size of 15MB.");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const detected = detectImageMagicBytes(buffer);
  if (!detected) {
    throw new Error(
      "Unsupported or invalid image file. Only genuine JPG, PNG, WEBP, or AVIF image files are accepted."
    );
  }

  // Generate safe unique filename using detected extension (NEVER trust user-supplied extension)
  const hash = crypto.randomBytes(16).toString("hex");
  const safeFilename = `${Date.now()}-${hash}${detected.ext}`;

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  const filepath = path.join(uploadsDir, safeFilename);
  await fs.writeFile(filepath, buffer);

  return {
    url: `/uploads/${safeFilename}`,
    filename: safeFilename,
    sizeBytes: file.size,
    mimeType: detected.mime,
  };
}
