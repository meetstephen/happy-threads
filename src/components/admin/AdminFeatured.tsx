import { useRef, useState } from 'react';
import { Camera, Star, Trash2 } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';
import { useCustomDesigns } from '../../context/CustomDesignsContext';
import { resizeImageFile } from '../../utils/imageResize';
import { validateImageFile } from '../../utils/sanitize';
import { uploadDesignImage } from '../../services/designsService';
import { isSupabaseEnabled } from '../../lib/supabase';

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

export default function AdminFeatured() {
  const { get, set, reset, hasOverride } = useSiteContent();
  const { customDesigns, updateDesign } = useCustomDesigns();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const heroImage = get('hero.image', '');

  const handleHeroReplace = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setBusy(true); setError(null);
    try {
      const v = await validateImageFile(files[0]);
      if (!v.valid) { setError(v.error || 'Invalid'); setBusy(false); return; }
      const resized = await resizeImageFile(files[0], 1400, 0.85);
      const url = isSupabaseEnabled ? await uploadDesignImage(resized) : await fileToBase64(resized);
      await set('hero.image', url);
      setInfo('Hero image updated.'); setTimeout(() => setInfo(null), 2000);
    } catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    try { await updateDesign(id, { featured: !current }); } catch (err) { setError((err as Error).message); }
  };

  return (
    <div>
      <p className="eyebrow">Featured</p>
      <h3 className="mt-2 font-display text-2xl">Hero & Featured</h3>
      <p className="mt-2 text-sm text-ink-800/65 dark:text-cream-100/65">Manage the hero image and which designs are featured.</p>

      {error && <p className="mt-4 rounded-2xl border border-wine-500/30 bg-wine-500/10 p-3 text-sm text-wine-500">{error}</p>}
      {info && <p className="mt-4 rounded-2xl border border-[#25D366]/30 bg-[#25D366]/10 p-3 text-sm text-[#1da851]">{info}</p>}

      <div className="mt-6">
        <h4 className="mb-3 font-display text-lg">Hero Image</h4>
        <div className="relative overflow-hidden rounded-2xl border border-ink-800/10 dark:border-cream-100/10">
          {heroImage ? <img src={heroImage} alt="Hero" className="aspect-video w-full object-cover" /> : <div className="grid aspect-video w-full place-items-center bg-cream-200 text-ink-800/30 dark:bg-ink-900">No hero image set</div>}
          <div className="absolute right-2 top-2 flex gap-2">
            <button type="button" onClick={() => fileRef.current?.click()} disabled={busy} className="inline-flex items-center gap-1.5 rounded-full bg-cream-100/95 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink-800 shadow-soft active:scale-95 disabled:opacity-50"><Camera size={12} /> Replace</button>
            {hasOverride('hero.image') && <button type="button" onClick={() => reset('hero.image')} className="inline-flex items-center gap-1.5 rounded-full bg-wine-500/95 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-cream-100 shadow-soft active:scale-95"><Trash2 size={12} /> Reset</button>}
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" className="hidden" onChange={e => handleHeroReplace(e.target.files)} />
      </div>

      {customDesigns.length > 0 && (
        <div className="mt-8">
          <h4 className="mb-3 font-display text-lg">Toggle Featured</h4>
          <div className="space-y-2">
            {customDesigns.map(d => (
              <div key={d.id} className="flex items-center justify-between gap-3 rounded-2xl border border-ink-800/10 p-3 dark:border-cream-100/10">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={d.image} alt={d.name} className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                  <span className="truncate text-sm font-medium">{d.name}</span>
                </div>
                <button type="button" onClick={() => toggleFeatured(d.id, Boolean(d.featured))} className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors ${d.featured ? 'bg-bronze-500 text-cream-100' : 'border border-ink-800/15 text-ink-800/40 hover:border-bronze-500 hover:text-bronze-500 dark:border-cream-100/20 dark:text-cream-100/40'}`}><Star size={14} fill={d.featured ? 'currentColor' : 'none'} /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
