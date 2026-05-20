/**
 * Resize an uploaded image File to a max dimension and return a new File
 * (JPEG, well-compressed). Keeps both upload bandwidth and localStorage
 * usage manageable, especially for phone-camera photos.
 */
export async function resizeImageFile(
  file: File,
  maxDimension = 900,
  quality = 0.82
): Promise<File> {
  const dataUrl = await readAsDataUrl(file);
  const img = await loadImage(dataUrl);
  const ratio = Math.min(maxDimension / img.width, maxDimension / img.height, 1);
  const w = Math.round(img.width * ratio);
  const h = Math.round(img.height * ratio);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');
  ctx.drawImage(img, 0, 0, w, h);

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Could not encode image'))),
      'image/jpeg',
      quality
    );
  });

  const baseName = file.name.replace(/\.[^.]+$/, '') || 'design';
  return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' });
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load image'));
    img.src = src;
  });
}
