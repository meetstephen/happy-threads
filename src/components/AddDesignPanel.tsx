import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Cloud, CloudOff, Lock, Plus, QrCode, Trash2, Upload, X } from 'lucide-react';
import { useCustomDesigns } from '../context/CustomDesignsContext';
import { categories, type DesignCategory } from '../data/designs';
import { resizeImageFile } from '../utils/imageResize';
import { uploadDesignImage } from '../services/designsService';
import QrPanel from './QrPanel';

interface Props {
  open: boolean;
  onClose: () => void;
}

const PASSCODE = 'happy2026';

type Tab = 'add' | 'qr';

export default function AddDesignPanel({ open, onClose }: Props) {
  const { customDesigns, addDesign, removeDesign, cloudEnabled, loading } = useCustomDesigns();
  const [unlocked, setUnlocked] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('add');

  // form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<DesignCategory>('Aso-Ebi & Owambe');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string>('');
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

  useEffect(() => {
    if (!open) {
      setUnlocked(false);
      setPasscodeInput('');
      setError(null);
      setTab('add');
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
    setError(null);
    try {
      const resized = await resizeImageFile(file, 900, 0.82);
      setPendingFile(resized);
      setPendingPreview(URL.createObjectURL(resized));
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
    setPendingFile(null);
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    setPendingPreview('');
    setTags('');
    setError(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError('Please enter a name.');
    if (!pendingFile) return setError('Please choose a photo.');

    setBusy(true);
    try {
      let imageUrl: string;
      if (cloudEnabled) {
        imageUrl = await uploadDesignImage(pendingFile);
      } else {
        // localStorage path: store as base64
        imageUrl = await fileToBase64(pendingFile);
      }

      await addDesign({
        name: name.trim(),
        category,
        description: description.trim() || `A new ${category} piece by Happiness.`,
        image: imageUrl,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        occasions: ['party'],
        vibes: ['classic'],
        colorMood: 'neutral',
      });
      resetForm();
    } catch (err) {
      setError((err as Error).message ?? 'Could not save. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removeDesign(id);
    } catch (err) {
      setError((err as Error).message ?? 'Could not remove design.');
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
                  Enter the studio passcode to manage your collection.
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
                  . Change it in <code>src/components/AddDesignPanel.tsx</code>.
                </p>
              </div>
            ) : (
              <div className="grid max-h-[88vh] grid-rows-[auto_auto_1fr] overflow-hidden">
                <div className="flex items-center justify-between gap-4 border-b border-ink-800/10 p-6 pr-16 dark:border-cream-100/10">
                  <div>
                    <p className="eyebrow">Atelier panel</p>
                    <h3 className="display-3 mt-2">Manage your collection</h3>
                  </div>
                  <CloudStatus enabled={cloudEnabled} loading={loading} />
                </div>

                {/* tabs */}
                <div className="flex gap-1 border-b border-ink-800/10 px-6 dark:border-cream-100/10">
                  <TabButton active={tab === 'add'} onClick={() => setTab('add')}>
                    <Plus size={14} /> Add design
                  </TabButton>
                  <TabButton active={tab === 'qr'} onClick={() => setTab('qr')}>
                    <QrCode size={14} /> Site QR code
                  </TabButton>
                </div>

                <div className="overflow-y-auto p-6 md:p-8">
                  {tab === 'qr' ? (
                    <QrPanel />
                  ) : (
                    <>
                      <form onSubmit={submit} className="grid gap-5 md:grid-cols-2">
                        <div className="md:col-span-2">
                          <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-ink-800/70 dark:text-cream-100/70">
                            Photo of the design
                          </label>
                          {pendingPreview ? (
                            <div className="relative overflow-hidden rounded-2xl">
                              <img
                                src={pendingPreview}
                                alt="preview"
                                className="h-64 w-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (pendingPreview) URL.revokeObjectURL(pendingPreview);
                                  setPendingFile(null);
                                  setPendingPreview('');
                                }}
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
                            onChange={(e) =>
                              e.target.files?.[0] && onFileChosen(e.target.files[0])
                            }
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
                          <p className="text-sm text-wine-500 md:col-span-2">{error}</p>
                        )}

                        <div className="flex gap-3 md:col-span-2">
                          <button type="submit" disabled={busy} className="btn-primary disabled:opacity-50">
                            <Plus size={16} />
                            {busy ? 'Saving…' : cloudEnabled ? 'Publish to site' : 'Save Design'}
                          </button>
                          <button type="button" onClick={resetForm} className="btn-ghost">
                            Reset
                          </button>
                        </div>
                      </form>

                      {customDesigns.length > 0 && (
                        <div className="mt-12">
                          <p className="eyebrow">
                            {cloudEnabled ? 'Live on the site' : 'Saved on this device'} (
                            {customDesigns.length})
                          </p>
                          <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                            {customDesigns.map((d) => (
                              <div
                                key={d.id}
                                className="group relative overflow-hidden rounded-xl"
                              >
                                <img
                                  src={d.image}
                                  alt={d.name}
                                  className="h-32 w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/0" />
                                <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between gap-2">
                                  <span className="line-clamp-1 text-xs font-medium text-cream-100">
                                    {d.name}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemove(d.id)}
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
                    </>
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

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`-mb-px flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-medium uppercase tracking-[0.18em] transition-colors ${
        active
          ? 'border-bronze-500 text-bronze-500'
          : 'border-transparent text-ink-800/60 hover:text-ink-800 dark:text-cream-100/60 dark:hover:text-cream-100'
      }`}
    >
      {children}
    </button>
  );
}

function CloudStatus({ enabled, loading }: { enabled: boolean; loading: boolean }) {
  if (enabled) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-[#25D366]/30 bg-[#25D366]/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-[#1da851]">
        <Cloud size={12} />
        {loading ? 'Syncing…' : 'Live sync'}
      </div>
    );
  }
  return (
    <div
      className="flex items-center gap-2 rounded-full border border-ink-800/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-ink-800/60 dark:border-cream-100/20 dark:text-cream-100/60"
      title="Designs are saved on this device only. Set up Supabase to sync everywhere."
    >
      <CloudOff size={12} />
      Local only
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}
