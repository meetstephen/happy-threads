import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Lock, Plus, Trash2, Upload, X } from 'lucide-react';
import { useCustomDesigns } from '../context/CustomDesignsContext';
import { categories, type DesignCategory } from '../data/designs';
import { resizeImageToBase64 } from '../utils/imageResize';

interface Props {
  open: boolean;
  onClose: () => void;
}

const PASSCODE = 'happy2026';

export default function AddDesignPanel({ open, onClose }: Props) {
  const { customDesigns, addDesign, removeDesign } = useCustomDesigns();
  const [unlocked, setUnlocked] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  // form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<DesignCategory>('Aso-Ebi & Owambe');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [tags, setTags] = useState('');
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  // reset on close
  useEffect(() => {
    if (!open) {
      setUnlocked(false);
      setPasscodeInput('');
      setError(null);
    }
  }, [open]);

  const tryUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput.trim() === PASSCODE) {
      setUnlocked(true);
      setError(null);
    } else {
      setError('Incorrect passcode.');
    }
  };

  const onFileChosen = async (file: File) => {
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await resizeImageToBase64(file, 900, 0.82);
      setImagePreview(dataUrl);
    } catch {
      setError('Could not read that image. Try a different one.');
    } finally {
      setBusy(false);
    }
  };

  const resetForm = () => {
    setName('');
    setCategory('Aso-Ebi & Owambe');
    setDescription('');
    setImagePreview('');
    setTags('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError('Please enter a name.');
    if (!imagePreview) return setError('Please choose a photo.');

    try {
      addDesign({
        name: name.trim(),
        category,
        description: description.trim() || `A new ${category} piece by Happiness.`,
        image: imagePreview,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        occasions: ['party'],
        vibes: ['classic'],
        colorMood: 'neutral',
      });
      resetForm();
    } catch {
      setError(
        'Could not save — your browser storage may be full. Try removing older designs first.'
      );
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-ink-900/85 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-cream-100 shadow-luxe dark:bg-ink-800"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-cream-100/90 text-ink-800 backdrop-blur-md transition-colors hover:bg-cream-100 dark:bg-ink-900/90 dark:text-cream-100"
            >
              <X size={18} />
            </button>

            {!unlocked ? (
              <div className="p-10 md:p-14">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-bronze-400/20 text-bronze-500">
                  <Lock size={20} />
                </div>
                <h3 className="display-3 mt-5">Atelier access</h3>
                <p className="mt-2 text-sm text-ink-800/65 dark:text-cream-100/65">
                  Enter the studio passcode to add new designs.
                </p>
                <form onSubmit={tryUnlock} className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <input
                    type="password"
                    autoFocus
                    value={passcodeInput}
                    onChange={(e) => setPasscodeInput(e.target.value)}
                    placeholder="Passcode"
                    className="flex-1 rounded-full border border-ink-800/15 bg-transparent px-5 py-3 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20"
                  />
                  <button type="submit" className="btn-primary">
                    Unlock
                  </button>
                </form>
                {error && <p className="mt-3 text-sm text-wine-500">{error}</p>}
                <p className="mt-8 rounded-2xl bg-bronze-400/10 p-4 text-xs text-ink-800/70 dark:text-cream-100/70">
                  <span className="font-medium text-bronze-500">For Happiness:</span> the default
                  passcode is{' '}
                  <code className="rounded bg-ink-800/10 px-2 py-0.5 font-mono dark:bg-cream-100/10">
                    {PASSCODE}
                  </code>
                  . You can change it in <code>src/components/AddDesignPanel.tsx</code>.
                </p>
              </div>
            ) : (
              <div className="grid max-h-[85vh] grid-rows-[auto_1fr] overflow-hidden">
                <div className="border-b border-ink-800/10 p-6 dark:border-cream-100/10">
                  <p className="eyebrow">Manage your collection</p>
                  <h3 className="display-3 mt-2">Add a new design</h3>
                </div>
                <div className="overflow-y-auto p-6 md:p-8">
                  <form onSubmit={submit} className="grid gap-5 md:grid-cols-2">
                    {/* Image */}
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-ink-800/70 dark:text-cream-100/70">
                        Photo of the design
                      </label>
                      {imagePreview ? (
                        <div className="relative overflow-hidden rounded-2xl">
                          <img src={imagePreview} alt="preview" className="h-64 w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setImagePreview('')}
                            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-cream-100/90 text-ink-800"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          className="grid w-full place-items-center gap-2 rounded-2xl border-2 border-dashed border-ink-800/20 px-6 py-12 text-sm text-ink-800/70 transition-colors hover:border-bronze-500 hover:text-bronze-500 dark:border-cream-100/20 dark:text-cream-100/70"
                        >
                          <Upload size={22} />
                          <span>{busy ? 'Resizing…' : 'Click to upload a photo'}</span>
                          <span className="text-[11px] uppercase tracking-[0.2em] text-ink-800/40 dark:text-cream-100/40">
                            Auto-resized to 900px wide
                          </span>
                        </button>
                      )}
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && onFileChosen(e.target.files[0])}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-ink-800/70 dark:text-cream-100/70">
                        Design name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Sapphire Aso-Ebi"
                        className="w-full rounded-full border border-ink-800/15 bg-transparent px-5 py-3 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-ink-800/70 dark:text-cream-100/70">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as DesignCategory)}
                        className="w-full rounded-full border border-ink-800/15 bg-cream-100 px-5 py-3 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-800"
                      >
                        {categories.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-ink-800/70 dark:text-cream-100/70">
                        Description (optional)
                      </label>
                      <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Tell clients what makes this piece special..."
                        className="w-full rounded-2xl border border-ink-800/15 bg-transparent px-5 py-3 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-ink-800/70 dark:text-cream-100/70">
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="lace, embroidered, beaded"
                        className="w-full rounded-full border border-ink-800/15 bg-transparent px-5 py-3 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20"
                      />
                    </div>

                    {error && (
                      <p className="md:col-span-2 text-sm text-wine-500">{error}</p>
                    )}

                    <div className="flex gap-3 md:col-span-2">
                      <button type="submit" className="btn-primary">
                        <Plus size={16} /> Save Design
                      </button>
                      <button type="button" onClick={resetForm} className="btn-ghost">
                        Reset
                      </button>
                    </div>
                  </form>

                  {customDesigns.length > 0 && (
                    <div className="mt-12">
                      <p className="eyebrow">Your additions ({customDesigns.length})</p>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {customDesigns.map((d) => (
                          <div
                            key={d.id}
                            className="group relative overflow-hidden rounded-xl"
                          >
                            <img src={d.image} alt={d.name} className="h-32 w-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/0" />
                            <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between gap-2">
                              <span className="line-clamp-1 text-xs font-medium text-cream-100">
                                {d.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeDesign(d.id)}
                                aria-label="Remove design"
                                className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-wine-500 text-cream-100 opacity-0 transition-opacity group-hover:opacity-100"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
