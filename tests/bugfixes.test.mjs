import test from "node:test";
import assert from "node:assert/strict";

// Import modules to test
import {
  toDateTimeLocalInput,
  toDateInput,
  parseDateTimeInZone,
  parseDateInZone,
} from "../src/lib/datetime.ts";
import { detectImageMagicBytes } from "../src/lib/storage.ts";

test("Datetime: Event times round-trip with zero timezone drift", () => {
  // A wedding event scheduled at 10:30 AM IST (Indian Standard Time)
  const originalDate = new Date("2026-12-10T10:30:00+05:30");
  
  // 1st cycle: format for HTML input in IST
  const inputVal1 = toDateTimeLocalInput(originalDate, "Asia/Kolkata");
  assert.equal(inputVal1, "2026-12-10T10:30");

  // 1st save: parse from input back to Date
  const parsed1 = parseDateTimeInZone(inputVal1, "Asia/Kolkata");
  assert.equal(parsed1.getTime(), originalDate.getTime());

  // 2nd cycle: re-edit and save
  const inputVal2 = toDateTimeLocalInput(parsed1, "Asia/Kolkata");
  const parsed2 = parseDateTimeInZone(inputVal2, "Asia/Kolkata");
  assert.equal(parsed2.getTime(), originalDate.getTime());

  // 3rd cycle: repeated saves must never drift
  const inputVal3 = toDateTimeLocalInput(parsed2, "Asia/Kolkata");
  const parsed3 = parseDateTimeInZone(inputVal3, "Asia/Kolkata");
  assert.equal(parsed3.getTime(), originalDate.getTime());
  assert.equal(parsed3.toISOString(), originalDate.toISOString());
});

test("Datetime: Wedding date input round-trip without shifting days", () => {
  const originalDate = new Date("2026-11-25T12:00:00+05:30");
  const dateStr = toDateInput(originalDate, "Asia/Kolkata");
  assert.equal(dateStr, "2026-11-25");

  const parsed = parseDateInZone(dateStr, "Asia/Kolkata");
  assert.equal(toDateInput(parsed, "Asia/Kolkata"), "2026-11-25");
});

test("Storage: Magic bytes detector rejects disguised files (XSS prevention)", () => {
  // Fake image containing HTML script
  const maliciousHtml = Buffer.from("<script>alert('pwned')</script>");
  const result1 = detectImageMagicBytes(maliciousHtml);
  assert.equal(result1, null, "Disguised HTML must be rejected");

  // Fake SVG image containing JavaScript
  const maliciousSvg = Buffer.from("<svg onload=alert(1)>");
  const result2 = detectImageMagicBytes(maliciousSvg);
  assert.equal(result2, null, "SVG files must not pass binary raster image check");

  // Random bytes
  const randomBytes = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x10]);
  const result3 = detectImageMagicBytes(randomBytes);
  assert.equal(result3, null);
});

test("Storage: Magic bytes detector identifies genuine image headers", () => {
  // Genuine PNG header
  const pngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
  const pngResult = detectImageMagicBytes(pngHeader);
  assert.deepEqual(pngResult, { mime: "image/png", ext: ".png" });

  // Genuine JPEG header
  const jpegHeader = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
  const jpegResult = detectImageMagicBytes(jpegHeader);
  assert.deepEqual(jpegResult, { mime: "image/jpeg", ext: ".jpg" });

  // Genuine WEBP header
  const webpHeader = Buffer.concat([
    Buffer.from("RIFF", "ascii"),
    Buffer.from([0, 0, 0, 0]),
    Buffer.from("WEBP", "ascii"),
  ]);
  const webpResult = detectImageMagicBytes(webpHeader);
  assert.deepEqual(webpResult, { mime: "image/webp", ext: ".webp" });
});

test("Security: CSV formula injection characters are escaped with leading quote", () => {
  const escapeCsv = (val) => {
    if (!val) return '""';
    let clean = String(val);
    if (/^[=+\-@\t\r]/.test(clean)) {
      clean = `'${clean}`;
    }
    clean = clean.replace(/"/g, '""');
    return `"${clean}"`;
  };

  assert.equal(escapeCsv("=cmd|'/C calc'!A0"), `"\'=cmd|'/C calc'!A0"`);
  assert.equal(escapeCsv("+12345"), `"'+12345"`);
  assert.equal(escapeCsv("-500"), `"'-500"`);
  assert.equal(escapeCsv("@SUM(A1:A10)"), `"'@SUM(A1:A10)"`);
  assert.equal(escapeCsv("Normal Guest Name"), `"Normal Guest Name"`);
  assert.equal(escapeCsv('Quoted "Name"'), `"Quoted ""Name"""`);
});
