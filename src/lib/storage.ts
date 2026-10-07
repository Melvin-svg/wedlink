import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export interface UploadResult {
  url: string;
  filename: string;
  sizeBytes: number;
  mimeType: string;
}

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export async function saveLocalUpload(file: File): Promise<UploadResult> {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(`File type ${file.type} is not supported. Use JPG, PNG, WEBP, or AVIF.`);
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File exceeds maximum allowed size of 15MB.");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate safe unique filename
  const hash = crypto.randomBytes(12).toString("hex");
  const ext = path.extname(file.name) || ".jpg";
  const safeFilename = `${Date.now()}-${hash}${ext.toLowerCase()}`;

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  const filepath = path.join(uploadsDir, safeFilename);
  await fs.writeFile(filepath, buffer);

  return {
    url: `/uploads/${safeFilename}`,
    filename: safeFilename,
    sizeBytes: file.size,
    mimeType: file.type,
  };
}
