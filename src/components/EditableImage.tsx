import { useRef, useState } from 'react';
import { Camera, RotateCcw } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { useAdminAuth } from '../lib/auth';
import { resizeImageFile } from '../utils/imageResize';
import { validateImageFile } from '../utils/sanitize';
import { uploadDesignImage } from '../services/designsService';
import { isSupabaseEnabled } from '../lib/supabase';

interface Props {
  /** Unique key for this editable image. */
  contentKey: string;
  /** Default (hardcoded) image URL — what shows when no override exists. */
  defaultSrc: string;
  /** Alt text for the image. */
  alt: string;
  /** Extra classes for the <img> element. */
  className?: string;
}

/**
 * Wraps any image on the site and makes it swappable for the admin.
 *
 * For visitors: renders a normal <img>.
 * For the signed-in admin: adds a camera overlay that opens a file picker.
 * The new image is uploaded to Supabase Storage (if configured) or stored
 * as a base64 data URL in localStorage.
 */
export default function EditableImage({ contentKey, defaultSrc, alt, className = '' }: Props) {
  const { get, set, reset, hasOverride } = useSiteContent();
  const { admin } = useAdminAuth();
  const [uploading, setUploading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const currentSrc = get(contentKey, defaultSrc);

  const onFile = async (file: File) => {
    if (!file) return;
    setValidationError(null);
    setUploading(true);
    try {
      const validation = await validateImageFile(file);
      if (!validation.valid) {
        setValidationError(validation.error || 'Invalid file.');
        return;
      }
      const resized = await resizeImageFile(file, 1200, 0.85);
      let url: string;
      if (isSupabaseEnabled) {
        url = await uploadDesignImage(resized);
      } else {
        // base64 fallback for localStorage-only mode
        url = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onerror = () => reject(new Error('Read failed'));
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(resized);
        });
      }
      await set(contentKey, url);
    } catch (err) {
      console.warn('[EditableImage] upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const revert = async () => {
    await reset(contentKey);
  };

  // Visitors — plain image
  if (!admin) {
    return <img src={currentSrc} alt={alt} className={className} />;
  }

  // Admin — image with swap overlay
  return (
    <span className="group/img relative inline-block">
      <img src={currentSrc} alt={alt} className={className} />

      {/* Overlay for admin */}
      <span className="absolute inset-0 flex items-center justify-center gap-2 bg-ink-900/50 opacity-0 transition-opacity group-hover/img:opacity-100">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 rounded-full bg-cream-100/95 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.15em] text-ink-800 shadow transition-colors hover:bg-bronze-400"
          title="Replace this image"
        >
          <Camera size={12} />
          {uploading ? 'Uploading…' : 'Change photo'}
        </button>
        {hasOverride(contentKey) && (
          <button
            type="button"
            onClick={revert}
            className="flex items-center gap-1 rounded-full bg-wine-500/90 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.15em] text-cream-100"
            title="Revert to original"
          >
            <RotateCcw size={10} /> Reset
          </button>
        )}
        {validationError && (
          <span className="mt-2 block rounded-lg bg-wine-500/10 px-3 py-2 text-[11px] text-wine-500">
            {validationError}
          </span>
        )}
      </span>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
    </span>
  );
}
