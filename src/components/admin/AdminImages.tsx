import { useRef, useState } from 'react';
import { Camera, Eye, EyeOff, RotateCcw, Upload } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';
import { resizeImageFile } from '../../utils/imageResize';
import { validateImageFile } from '../../utils/sanitize';
import { uploadDesignImage } from '../../services/designsService';
import { isSupabaseEnabled } from '../../lib/supabase';
import { HIDDEN_IMAGE_VALUE } from '../EditableImage';
import { HERO_IMAGE } from '../Hero';
import { ABOUT_IMG } from '../About';

const IMAGE_KEYS: { key: string; label: string; section: string; defaultSrc: string }[] = [
  { key: 'hero.image', label: 'Hero Fashion Portrait', section: 'Hero', defaultSrc: HERO_IMAGE },
  { key: 'about.image', label: 'About the Designer', section: 'About', defaultSrc: ABOUT_IMG },
];

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

export default function AdminImages() {
  const { get, set, reset, hasOverride } = useSiteContent();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleReplace = async (key: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setBusy(key);
    setError(null);
    try {
      const validation = await validateImageFile(file);
      if (!validation.valid) {
        setError(validation.error || 'Invalid image');
        setBusy(null);
        return;
      }
      const resized = await resizeImageFile(file, 1200, 0.85);
      let url: string;
      if (isSupabaseEnabled) {
        url = await uploadDesignImage(resized);
      } else {
        url = await fileToBase64(resized);
      }
      await set(key, url);
    } catch (err) {
      setError((err as Error).message || 'Upload failed');
    } finally {
      setBusy(null);
    }
  };

  const handleHide = async (key: string, label: string) => {
    if (!window.confirm(`Hide ${label} from the public site? You can restore it here.`)) return;
    try { await set(key, HIDDEN_IMAGE_VALUE); }
    catch (err) { setError((err as Error).message); }
  };

  const handleReset = async (key: string) => {
    try { await reset(key); }
    catch (err) { setError((err as Error).message); }
  };

  return (
    <div>
      <p className="eyebrow">Site Images</p>
      <h3 className="mt-2 font-display text-2xl">Image Manager</h3>
      <p className="mt-2 text-sm text-ink-800/65 dark:text-cream-100/65">
        Replace, hide, or restore the site portraits. Lookbook photography is managed from the Curate tab.
      </p>

      {error && (
        <p className="mt-4 rounded-2xl border border-wine-500/30 bg-wine-500/10 p-3 text-sm text-wine-500">
          {error}
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {IMAGE_KEYS.map(({ key, label, section, defaultSrc }) => {
          const currentUrl = get(key, defaultSrc);
          const overridden = hasOverride(key);
          const hidden = currentUrl === HIDDEN_IMAGE_VALUE;
          return (
            <div
              key={key}
              className="overflow-hidden rounded-2xl border border-ink-800/10 dark:border-cream-100/10"
            >
              {currentUrl && !hidden ? (
                <img
                  src={currentUrl}
                  alt={label}
                  className="aspect-video w-full object-cover"
                />
              ) : (
                <div className="grid aspect-video w-full place-items-center bg-cream-200 text-ink-800/30 dark:bg-ink-900 dark:text-cream-100/30">
                  {hidden ? <EyeOff size={24} /> : <Upload size={24} />}
                </div>
              )}
              <div className="flex items-center justify-between gap-2 p-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium">{label}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-ink-800/50 dark:text-cream-100/50">
                    {section}
                    {hidden ? ' \u2022 Hidden' : overridden ? ' \u2022 Custom' : ' \u2022 Original'}
                  </div>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <button
                    type="button"
                    onClick={() => fileRefs.current[key]?.click()}
                    disabled={busy === key}
                    className="grid h-9 w-9 place-items-center rounded-full bg-bronze-500 text-cream-100 transition-transform hover:bg-bronze-600 active:scale-90 disabled:opacity-50"
                    title="Replace"
                    aria-label={`Replace ${label}`}
                  >
                    <Camera size={14} />
                  </button>
                  {!hidden && (
                    <button
                      type="button"
                      onClick={() => handleHide(key, label)}
                      className="grid h-9 w-9 place-items-center rounded-full bg-wine-500 text-cream-100 transition-transform hover:bg-wine-600 active:scale-90"
                      title="Hide from site"
                      aria-label={`Hide ${label} from site`}
                    >
                      <EyeOff size={14} />
                    </button>
                  )}
                  {hidden && (
                    <button
                      type="button"
                      onClick={() => void handleReset(key)}
                      className="grid h-9 w-9 place-items-center rounded-full bg-bronze-500 text-cream-100 transition-transform hover:bg-bronze-600 active:scale-90"
                      title="Show original image"
                      aria-label={`Show ${label}`}
                    >
                      <Eye size={14} />
                    </button>
                  )}
                  {overridden && !hidden && (
                    <button
                      type="button"
                      onClick={() => void handleReset(key)}
                      className="grid h-9 w-9 place-items-center rounded-full border border-ink-800/15 text-ink-800/60 transition-transform active:scale-90 dark:border-cream-100/20 dark:text-cream-100/60"
                      title="Restore original image"
                      aria-label={`Restore original ${label}`}
                    >
                      <RotateCcw size={14} />
                    </button>
                  )}
                </div>
              </div>
              <input
                ref={(el) => { fileRefs.current[key] = el; }}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                className="hidden"
                onChange={(e) => handleReplace(key, e.target.files)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
