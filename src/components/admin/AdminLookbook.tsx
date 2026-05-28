import { useEffect, useRef, useState } from 'react';
import { Camera, Layers, Pencil, Plus, Star, Tag, Trash2, Upload, X } from 'lucide-react';
import { useCustomDesigns } from '../../context/CustomDesignsContext';
import { useSiteContent } from '../../context/SiteContentContext';
import { categories, type Design, type DesignCategory } from '../../data/designs';
import { resizeImageFile } from '../../utils/imageResize';
import { validateImageFile } from '../../utils/sanitize';
import { uploadDesignImage } from '../../services/designsService';

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

type LookbookTab = 'add' | 'batch' | 'categories';

interface Props { editingDesign?: Design | null; }

export default function AdminLookbook({ editingDesign }: Props) {
  const { customDesigns, addDesign, updateDesign, removeDesign, cloudEnabled } = useCustomDesigns();
  const { get, set, reset, hasOverride } = useSiteContent();
  const [tab, setTab] = useState<LookbookTab>('add');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<DesignCategory>('Aso-Ebi & Owambe');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [featured, setFeatured] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState('');
  const [keepExistingImage, setKeepExistingImage] = useState('');
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const batchFileRef = useRef<HTMLInputElement>(null);
  const [batchFiles, setBatchFiles] = useState<{id:string;file:File;preview:string;name:string;category:DesignCategory}[]>([]);
  const [batchBusy, setBatchBusy] = useState(false);

  useEffect(() => {
    if (editingDesign) {
      setTab('add');
      setEditingId(editingDesign.id);
      setName(editingDesign.name);
      setCategory(editingDesign.category);
      setDescription(editingDesign.description);
      setTags(editingDesign.tags.join(', '));
      setFeatured(Boolean(editingDesign.featured));
      setKeepExistingImage(editingDesign.image);
    }
  }, [editingDesign]);

  useEffect(() => { return () => { batchFiles.forEach(b => URL.revokeObjectURL(b.preview)); if (pendingPreview) URL.revokeObjectURL(pendingPreview); }; }, []);

  const resetForm = () => { setEditingId(null); setName(''); setCategory('Aso-Ebi & Owambe'); setDescription(''); setFeatured(false); setTags(''); setPendingFile(null); if (pendingPreview) URL.revokeObjectURL(pendingPreview); setPendingPreview(''); setKeepExistingImage(''); setError(null); if (fileRef.current) fileRef.current.value = ''; };

  const onFileChosen = async (files: FileList | null) => { if (!files || !files.length) return; const file = files[0]; setBusy(true); setError(null); try { const v = await validateImageFile(file); if (!v.valid) { setError(v.error || 'Invalid image'); setBusy(false); return; } const resized = await resizeImageFile(file, 900, 0.82); setPendingFile(resized); if (pendingPreview) URL.revokeObjectURL(pendingPreview); setPendingPreview(URL.createObjectURL(resized)); setKeepExistingImage(''); } catch { setError('Could not read that image.'); } finally { setBusy(false); } };

  const submit = async (e: React.FormEvent) => { e.preventDefault(); setError(null); if (!name.trim()) { setError('Please enter a name.'); return; } const isEditing = Boolean(editingId); if (!isEditing && !pendingFile) { setError('Please choose a photo.'); return; } setBusy(true); try { let imageUrl = keepExistingImage; if (pendingFile) { imageUrl = cloudEnabled ? await uploadDesignImage(pendingFile) : await fileToBase64(pendingFile); } if (isEditing && editingId) { await updateDesign(editingId, { name: name.trim(), category, description: description.trim() || `A ${category} piece by Happiness.`, image: imageUrl, tags: tags.split(',').map(t => t.trim()).filter(Boolean), featured }); setInfo('Design updated.'); } else { await addDesign({ name: name.trim(), category, description: description.trim() || `A new ${category} piece by Happiness.`, image: imageUrl, tags: tags.split(',').map(t => t.trim()).filter(Boolean), occasions: ['party'], vibes: ['classic'], colorMood: 'neutral', featured }); setInfo('Design published.'); } resetForm(); setTimeout(() => setInfo(null), 2200); } catch (err) { setError((err as Error).message || 'Could not save.'); } finally { setBusy(false); } };

  const handleRemove = async (id: string, label: string) => { if (!window.confirm(`Delete "${label}"? This cannot be undone.`)) return; try { await removeDesign(id); setInfo('Design removed.'); setTimeout(() => setInfo(null), 2000); } catch (err) { setError((err as Error).message || 'Could not remove.'); } };

  const startEdit = (d: Design) => { setEditingId(d.id); setName(d.name); setCategory(d.category); setDescription(d.description); setTags(d.tags.join(', ')); setFeatured(Boolean(d.featured)); setKeepExistingImage(d.image); setPendingFile(null); if (pendingPreview) URL.revokeObjectURL(pendingPreview); setPendingPreview(''); setTab('add'); };

  const onBatchFiles = async (files: FileList | null) => { if (!files || !files.length) return; const items: typeof batchFiles = []; for (let i = 0; i < files.length; i++) { const f = files[i]; try { const v = await validateImageFile(f); if (!v.valid) continue; const resized = await resizeImageFile(f, 900, 0.82); items.push({ id: `${Date.now()}-${i}`, file: resized, preview: URL.createObjectURL(resized), name: `New piece ${batchFiles.length + i + 1}`, category }); } catch {} } setBatchFiles(prev => [...prev, ...items]); if (batchFileRef.current) batchFileRef.current.value = ''; };

  const publishBatch = async () => { if (!batchFiles.length) return; setBatchBusy(true); setError(null); let ok = 0; for (const item of batchFiles) { try { const url = cloudEnabled ? await uploadDesignImage(item.file) : await fileToBase64(item.file); await addDesign({ name: item.name.trim() || `New piece`, category: item.category, description: `A new ${item.category} piece by Happiness.`, image: url, tags: [], occasions: ['party'], vibes: ['classic'], colorMood: 'neutral' }); ok++; } catch {} } setBatchFiles([]); setBatchBusy(false); setInfo(`Published ${ok} design${ok === 1 ? '' : 's'}.`); setTimeout(() => setInfo(null), 3000); };

  const previewSrc = pendingPreview || keepExistingImage;
  const isEditing = Boolean(editingId);

  // Category labels panel
  const [catDrafts, setCatDrafts] = useState<Record<string, string>>(() => { const m: Record<string, string> = {}; categories.forEach(c => { m[c] = get(`category.label.${c}`, c); }); return m; });

  return (
    <div>
      <p className="eyebrow">Lookbook</p>
      <h3 className="mt-2 font-display text-2xl">{isEditing ? 'Edit Design' : 'Design Manager'}</h3>
      <p className="mt-2 text-sm text-ink-800/65 dark:text-cream-100/65">Add, edit, or remove designs from your lookbook collection.</p>

      {/* Tabs */}
      <div className="mt-4 flex gap-1 overflow-x-auto border-b border-ink-800/10 pb-px dark:border-cream-100/10">
        <button type="button" onClick={() => setTab('add')} className={`inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium uppercase tracking-[0.18em] transition-colors ${tab === 'add' ? 'border-b-2 border-bronze-500 text-bronze-500' : 'text-ink-800/60 hover:text-bronze-500 dark:text-cream-100/60'}`}><Plus size={13} /> {isEditing ? 'Edit' : 'Add'}</button>
        <button type="button" onClick={() => setTab('batch')} className={`inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium uppercase tracking-[0.18em] transition-colors ${tab === 'batch' ? 'border-b-2 border-bronze-500 text-bronze-500' : 'text-ink-800/60 hover:text-bronze-500 dark:text-cream-100/60'}`}><Layers size={13} /> Batch{batchFiles.length > 0 && <span className="ml-1 rounded-full bg-bronze-500 px-1.5 py-0.5 text-[9px] text-cream-100">{batchFiles.length}</span>}</button>
        <button type="button" onClick={() => setTab('categories')} className={`inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium uppercase tracking-[0.18em] transition-colors ${tab === 'categories' ? 'border-b-2 border-bronze-500 text-bronze-500' : 'text-ink-800/60 hover:text-bronze-500 dark:text-cream-100/60'}`}><Tag size={13} /> Labels</button>
      </div>

      {error && <p className="mt-4 rounded-2xl border border-wine-500/30 bg-wine-500/10 p-3 text-sm text-wine-500">{error}</p>}
      {info && <p className="mt-4 rounded-2xl border border-[#25D366]/30 bg-[#25D366]/10 p-3 text-sm text-[#1da851]">{info}</p>}

      {tab === 'add' && (
        <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-xs font-medium uppercase tracking-[0.22em] text-ink-800/70 dark:text-cream-100/70">Photo</label>
            {previewSrc ? (
              <div className="relative overflow-hidden rounded-2xl border border-ink-800/10 dark:border-cream-100/10">
                <img src={previewSrc} alt="preview" className="aspect-[4/5] w-full object-cover sm:aspect-[16/10]" />
                <div className="absolute right-2 top-2 flex gap-2">
                  <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-full bg-cream-100/95 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink-800 shadow-soft active:scale-95"><Camera size={12} /> Replace</button>
                  <button type="button" onClick={() => { if (pendingPreview) URL.revokeObjectURL(pendingPreview); setPendingFile(null); setPendingPreview(''); setKeepExistingImage(''); }} className="inline-flex items-center gap-1.5 rounded-full bg-wine-500/95 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-cream-100 shadow-soft active:scale-95"><Trash2 size={12} /> Remove</button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => fileRef.current?.click()} className="grid w-full place-items-center gap-2 rounded-2xl border-2 border-dashed border-ink-800/20 px-6 py-10 text-sm text-ink-800/70 transition-colors hover:border-bronze-500 active:scale-[0.99] dark:border-cream-100/20 dark:text-cream-100/70"><Upload size={26} /><span className="font-medium">{busy ? 'Resizing...' : 'Tap to upload'}</span></button>
            )}
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" className="hidden" onChange={e => onFileChosen(e.target.files)} />
          </div>
          <div><label className="mb-2 block text-xs font-medium uppercase tracking-[0.22em] text-ink-800/70 dark:text-cream-100/70">Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sapphire Aso-Ebi" className="w-full rounded-2xl border border-ink-800/15 bg-cream-50 px-4 py-3.5 text-base focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" /></div>
          <div><label className="mb-2 block text-xs font-medium uppercase tracking-[0.22em] text-ink-800/70 dark:text-cream-100/70">Category</label><select value={category} onChange={e => setCategory(e.target.value as DesignCategory)} className="w-full appearance-none rounded-2xl border border-ink-800/15 bg-cream-50 px-4 py-3.5 text-base focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900">{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
          <div className="md:col-span-2"><label className="mb-2 block text-xs font-medium uppercase tracking-[0.22em] text-ink-800/70 dark:text-cream-100/70">Description</label><textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Tell clients what makes this piece special..." className="w-full rounded-2xl border border-ink-800/15 bg-cream-50 px-4 py-3 text-base focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" /></div>
          <div className="md:col-span-2"><label className="mb-2 block text-xs font-medium uppercase tracking-[0.22em] text-ink-800/70 dark:text-cream-100/70">Tags (comma-separated)</label><input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="lace, embroidered, beaded" className="w-full rounded-2xl border border-ink-800/15 bg-cream-50 px-4 py-3.5 text-base focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" /></div>
          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-ink-800/15 bg-cream-50 px-4 py-3.5 md:col-span-2 dark:border-cream-100/20 dark:bg-ink-900">
            <span className="flex items-center gap-3"><Star size={18} className={featured ? 'text-bronze-500' : 'text-ink-800/40 dark:text-cream-100/40'} fill={featured ? 'currentColor' : 'none'} /><span><span className="block font-medium">Featured</span><span className="block text-[11px] text-ink-800/55 dark:text-cream-100/55">Gold ribbon on homepage</span></span></span>
            <span className={`relative inline-block h-6 w-11 rounded-full transition-colors ${featured ? 'bg-bronze-500' : 'bg-ink-800/20 dark:bg-cream-100/20'}`}><input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="absolute inset-0 cursor-pointer opacity-0" /><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-cream-100 shadow transition-transform ${featured ? 'translate-x-[22px]' : 'translate-x-0.5'}`} /></span>
          </label>
          <div className="flex gap-2 md:col-span-2">
            <button type="submit" disabled={busy} className="btn-primary disabled:opacity-50">{isEditing ? <Pencil size={16} /> : <Plus size={16} />}{busy ? 'Saving...' : isEditing ? 'Save changes' : 'Publish'}</button>
            <button type="button" onClick={resetForm} className="btn-ghost">{isEditing ? 'Cancel' : 'Reset'}</button>
          </div>
        </form>
      )}

      {tab === 'batch' && (
        <div className="mt-6 space-y-4">
          <button type="button" onClick={() => batchFileRef.current?.click()} disabled={batchBusy} className="grid w-full place-items-center gap-2 rounded-2xl border-2 border-dashed border-bronze-500/40 bg-bronze-400/5 px-6 py-7 text-sm text-bronze-600 hover:border-bronze-500 disabled:opacity-50 dark:text-bronze-400"><Layers size={26} /><span className="font-medium">{batchFiles.length === 0 ? 'Pick photos' : 'Add more'}</span></button>
          <input ref={batchFileRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" multiple className="hidden" onChange={e => onBatchFiles(e.target.files)} />
          {batchFiles.length > 0 && (
            <>
              <div className="grid gap-3">
                {batchFiles.map(item => (
                  <div key={item.id} className="flex gap-3 rounded-2xl border border-ink-800/10 bg-cream-50 p-3 dark:border-cream-100/10 dark:bg-ink-900">
                    <img src={item.preview} alt="" className="h-20 w-16 shrink-0 rounded-xl object-cover" />
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <input type="text" value={item.name} onChange={e => setBatchFiles(prev => prev.map(b => b.id === item.id ? {...b, name: e.target.value} : b))} className="w-full rounded-xl border border-ink-800/10 bg-cream-100 px-3 py-2 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/10 dark:bg-ink-800" />
                      <select value={item.category} onChange={e => setBatchFiles(prev => prev.map(b => b.id === item.id ? {...b, category: e.target.value as DesignCategory} : b))} className="w-full rounded-xl border border-ink-800/10 bg-cream-100 px-3 py-2 text-sm dark:border-cream-100/10 dark:bg-ink-800">{categories.map(c => <option key={c} value={c}>{c}</option>)}</select>
                    </div>
                    <button type="button" onClick={() => { const item2 = batchFiles.find(b => b.id === item.id); if (item2) URL.revokeObjectURL(item2.preview); setBatchFiles(prev => prev.filter(b => b.id !== item.id)); }} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-800/50 hover:text-wine-500 dark:text-cream-100/50"><X size={14} /></button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => { batchFiles.forEach(b => URL.revokeObjectURL(b.preview)); setBatchFiles([]); }} className="btn-ghost">Clear</button>
                <button type="button" onClick={publishBatch} disabled={batchBusy} className="btn-primary disabled:opacity-50"><Plus size={14} /> {batchBusy ? 'Publishing...' : `Publish all ${batchFiles.length}`}</button>
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'categories' && (
        <div className="mt-6 space-y-3">
          {categories.map(c => (
            <div key={c} className="flex flex-col gap-2 rounded-2xl border border-ink-800/10 p-4 sm:flex-row sm:items-center dark:border-cream-100/10">
              <div className="min-w-0 sm:flex-1"><div className="text-[10px] uppercase tracking-[0.22em] text-ink-800/55 dark:text-cream-100/55">Default</div><div className="font-display">{c}</div></div>
              <div className="flex flex-1 gap-2 sm:items-center">
                <input type="text" value={catDrafts[c] ?? c} onChange={e => setCatDrafts(prev => ({...prev, [c]: e.target.value}))} className="w-full rounded-xl border border-ink-800/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" />
                <button type="button" onClick={async () => { const v = (catDrafts[c] ?? '').trim(); if (!v || v === c) await reset(`category.label.${c}`); else await set(`category.label.${c}`, v); }} className="shrink-0 rounded-full bg-bronze-500 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-cream-100">Save</button>
                {hasOverride(`category.label.${c}`) && <button type="button" onClick={async () => { await reset(`category.label.${c}`); setCatDrafts(prev => ({...prev, [c]: c})); }} className="shrink-0 rounded-full border border-ink-800/15 px-3 py-2 text-[11px] uppercase tracking-[0.18em] dark:border-cream-100/20">Reset</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Existing designs grid */}
      {customDesigns.length > 0 && tab === 'add' && (
        <div className="mt-10">
          <div className="mb-3 flex items-center justify-between"><p className="eyebrow">{cloudEnabled ? 'Live on site' : 'Saved locally'} ({customDesigns.length})</p></div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {customDesigns.map(d => (
              <div key={d.id} className="group relative overflow-hidden rounded-xl bg-ink-900 shadow-soft">
                <img src={d.image} alt={d.name} className="aspect-[3/4] w-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-ink-900/0" />
                <div className="absolute right-2 top-2 flex flex-col gap-1.5">
                  <button type="button" onClick={() => startEdit(d)} className="grid h-9 w-9 place-items-center rounded-full bg-bronze-500/95 text-cream-100 shadow-soft active:scale-90"><Pencil size={13} /></button>
                  <button type="button" onClick={() => handleRemove(d.id, d.name)} className="grid h-9 w-9 place-items-center rounded-full bg-wine-500/95 text-cream-100 shadow-soft active:scale-90"><Trash2 size={13} /></button>
                </div>
                {d.featured && <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-bronze-500/95 px-2 py-0.5 text-[8px] font-medium uppercase tracking-[0.2em] text-cream-100"><Star size={9} fill="currentColor" /> Featured</span>}
                <div className="absolute inset-x-2 bottom-2"><div className="line-clamp-1 text-xs font-medium text-cream-100">{d.name}</div><div className="line-clamp-1 text-[9px] uppercase tracking-[0.2em] text-cream-100/70">{d.category}</div></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
