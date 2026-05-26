import { useRef, useState } from 'react';
import { Camera, RotateCcw, Loader2, X as XIcon } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { useAdminAuth } from '../lib/auth';
import { resizeImageFile } from '../utils/imageResize';
import { validateImageFile } from '../utils/sanitize';
import { uploadDesignImage } from '../services/designsService';
import { isSupabaseEnabled } from '../lib/supabase';

interface Props {
  /** Unique key for this editable image. */
  contentKey: string;
  /** Default (hardcoded) image URL - what shows when no override exists. */
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
 * For the signed-in admin: adds an ALWAYS-VISIBLE camera chip in the
 * top-right corner. Tapping it opens the file picker. The new image
 * is uploaded to Supabase Storage (if configured) or stored as a base64
 * data URL in localStorage.
 *
 * Critical mobile fixes vs. the previous version:
 *   1. Controls no longer hide behind a hover-only opacity rule, so they
 *      are reachable on touch devices.
 *   2. Validation errors render in a persistent banner *outside* the
 *      hover overlay, so the admin can read what went wrong without
 *      having to keep her finger on the image.
 *   3. The visible "Change photo" button is large enough for a comfortable
 *      tap target (44x44 minimum on mobile).
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
      setValidationError((err as Error).message ?? 'Upload failed. Try again.');
      console.warn('[EditableImage] upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const revert = async () => {
    setValidationError(null);
    setUploading(true);
    try {
      await reset(contentKey);
    } catch (err) {
      setValidationError((err as Error).message ?? 'Could not reset.');
    } finally {
      setUploading(false);
    }
  };

  const dismissError = () => setValidationError(null);

  // Visitors - plain image
  if (!admin) {
    return <img src={currentSrc} alt={alt} className={className} />;
  }

  // Admin - image with always-visible swap controls
  return (
    <span className="group/img relative inline-block h-full w-full">
      <img src={currentSrc} alt={alt} className={className} />

      {/* ALWAYS-VISIBLE corner action chips */}
      <span className="pointer-events-none absolute right-2 top-2 z-10 flex flex-col items-end gap-1.5 sm:right-3 sm:top-3">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            fileRef.current?.click();
          }}
          disabled={uploading}
          className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-cream-100/95 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.15em] text-ink-800 shadow-soft backdrop-blur-md transition-colors hover:bg-bronze-400 disabled:opacity-50 active:scale-95 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
          title="Replace this image"
          aria-label={`Change ${alt} image`}
        >
          {uploading ? <Loader2 size={12} className="animate-spin" /> : <Camera size={12} />}
          <span>{uploading ? 'Uploading' : 'Change'}</span>
        </button>
        {hasOverride(contentKey) && !uploading && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              revert();
            }}
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-wine-500/95 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.15em] text-cream-100 shadow-soft backdrop-blur-md transition-colors hover:bg-wine-600 active:scale-95"
            title="Revert to original"
            aria-label="Reset to original image"
          >
            <RotateCcw size={11} /> Reset
          </button>
        )}
      </span>

      {/* Persistent error banner OUTSIDE any hover overlay */}
      {validationError && (
        <span className="absolute inset-x-2 bottom-2 z-10 flex items-start justify-between gap-2 rounded-xl bg-wine-500 px-3 py-2.5 text-[11px] font-medium text-cream-100 shadow-luxe sm:inset-x-3">
          <span className="flex-1 leading-snug">{validationError}</span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dismissError();
            }}
            aria-label="Dismiss error"
            className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-cream-100/20 hover:bg-cream-100/30"
          >
            <XIcon size={10} />
          </button>
        </span>
      )}

      {/* Optional uploading shade so the admin knows something is happening */}
      {uploading && (
        <span className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center bg-ink-900/40 text-[11px] font-medium uppercase tracking-[0.2em] text-cream-100">
          Uploading...
        </span>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
    </span>
  );
}
