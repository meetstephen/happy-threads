/**
 * Security utilities for input sanitization and file validation.
 */

/** Maximum allowed text length for user-submitted content. */
const MAX_TEXT_LENGTH = 5000;

/** Allowed image MIME types. */
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'] as const;

/** Maximum file size before resize: 10MB. */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Strips HTML tags and script content from user-submitted text.
 * Trims whitespace and enforces max length.
 */
export function sanitizeText(input: string): string {
  if (!input) return '';

  let clean = input
    // Decode common HTML entities FIRST so any resulting tags get stripped
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove style tags and their content
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // Remove all remaining HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove null bytes
    .replace(/\0/g, '')
    // Normalize whitespace (but keep single newlines for multiline text)
    .replace(/[^\S\n]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Enforce max length
  if (clean.length > MAX_TEXT_LENGTH) {
    clean = clean.slice(0, MAX_TEXT_LENGTH);
  }

  return clean;
}

/**
 * Validates an image file by checking:
 * 1. File size (max 10MB)
 * 2. MIME type (must be in allowed list)
 * 3. Magic bytes (file signature verification)
 */
export async function validateImageFile(
  file: File
): Promise<{ valid: boolean; error?: string }> {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is 10MB.` };
  }

  // Check MIME type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as typeof ALLOWED_IMAGE_TYPES[number])) {
    return { valid: false, error: `Unsupported file type "${file.type}". Use JPEG, PNG, WebP, or HEIC.` };
  }

  // Validate magic bytes
  try {
    const buffer = await file.slice(0, 12).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    if (!checkMagicBytes(bytes, file.type)) {
      return { valid: false, error: 'File content does not match its type. The file may be corrupted or disguised.' };
    }
  } catch {
    return { valid: false, error: 'Could not read file for validation.' };
  }

  return { valid: true };
}

/**
 * Checks file magic bytes against expected signatures.
 */
function checkMagicBytes(bytes: Uint8Array, mimeType: string): boolean {
  switch (mimeType) {
    case 'image/jpeg':
      // JPEG: FF D8 FF
      return bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF;

    case 'image/png':
      // PNG: 89 50 4E 47 0D 0A 1A 0A
      return (
        bytes[0] === 0x89 &&
        bytes[1] === 0x50 &&
        bytes[2] === 0x4E &&
        bytes[3] === 0x47 &&
        bytes[4] === 0x0D &&
        bytes[5] === 0x0A &&
        bytes[6] === 0x1A &&
        bytes[7] === 0x0A
      );

    case 'image/webp':
      // WebP: RIFF....WEBP (bytes 0-3 = RIFF, bytes 8-11 = WEBP)
      return (
        bytes[0] === 0x52 && // R
        bytes[1] === 0x49 && // I
        bytes[2] === 0x46 && // F
        bytes[3] === 0x46 && // F
        bytes[8] === 0x57 && // W
        bytes[9] === 0x45 && // E
        bytes[10] === 0x42 && // B
        bytes[11] === 0x50    // P
      );

    case 'image/heic':
    case 'image/heif':
      // HEIC/HEIF: bytes 4-7 = 'ftyp'
      return (
        bytes[4] === 0x66 && // f
        bytes[5] === 0x74 && // t
        bytes[6] === 0x79 && // y
        bytes[7] === 0x70    // p
      );

    default:
      return false;
  }
}
