import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Cloud,
  CloudOff,
  Lock,
  LogOut,
  Pencil,
  Plus,
  QrCode,
  ShieldCheck,
  Tag,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useCustomDesigns } from '../context/CustomDesignsContext';
import { useSiteContent } from '../context/SiteContentContext';
import { categories, type Design, type DesignCategory } from '../data/designs';
import { resizeImageFile } from '../utils/imageResize';
import { uploadDesignImage } from '../services/designsService';
import { hasAdminConfigured, useAdminAuth } from '../lib/auth';
import { ADMIN_EMAIL, isSupabaseEnabled } from '../lib/supabase';
import QrPanel from './QrPanel';

interface Props {
  open: boolean;
  onClose: () => void;
  /** When set, the panel opens in EDIT mode pre-filled with this design. */
  editingDesign?: Design | null;
}

const LOCAL_PASSCODE = 'happy2026';

type Tab = 'add' | 'categories' | 'qr';

export default function AddDesignPanel({ open, onClose, editingDesign }: Props) {
  const { customDesigns, addDesign, updateDesign, removeDesign, cloudEnabled, loading } = useCustomDesigns();
  const auth = useAdminAuth();

  const [localUnlocked, setLocalUnlocked] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [tab, setTab] = useState<Tab>('add');

  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // Sign-in form state (cloud mode)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authEmail, setAuthEmail] = useState(ADMIN_EMAIL ?? '');
  const [authPassword, setAuthPassword] = useState('');
  const [authBusy, setAuthBusy] = useState(false);

  // Form state for adding/editing a design
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<DesignCategory>('Aso-Ebi & Owambe');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string>('');
  const [keepExistingImage, setKeepExistingImage] = useState<string>('');
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const cloudReady = isSupabaseEnabled && hasAdminConfigured();
  const unlocked = cloudReady ? auth.admin !== null : localUnlocked;

  // When opened with an editingDesign, switch to add tab + pre-fill
  useEffect(() => {
    if (open && editingDesign) {
      setTab('add');
      setEditingId(editingDesign.id);
      setName(editingDesign.name);
      setCategory(editingDesign.category);
      setDescription(editingDesign.description);
      setTags(editingDesign.tags.join(', '));
      setKeepExistingImage(editingDesign.image);
      setPendingFile(null);
      if (pendingPreview) URL.revokeObjectURL(pendingPreview);
      setPendingPreview('');
    }
  }, [open, editingDesign]);

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
      setLocalUnlocked(false);
      setPasscodeInput('');
      setError(null);
      setInfo(null);
      setTab('add');
      setEditingId(null);
    }
  }, [open]);

  // ---- local passcode flow ---------------------

  const tryLocalUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput.trim() === LOCAL_PASSCODE) {
      setLocalUnlocked(true);
      setError(null);
    } else {
      setError('Incorrect passcode.');
    }
  };

  // ---- cloud auth flow --------------

  const onAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setAuthBusy(true);
    try {
      if (authMode === 'signin') {
        await auth.signIn(authEmail, authPassword);
      } else {
        const { needsConfirmation } = await auth.signUp(authEmail, authPassword);
        if (needsConfirmation) {
          setInfo('Account created. Check your email for the confirmation link, then come back and sign in.');
        } else {
          setInfo('Account created. You are signed in.');
        }
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setAuthBusy(false);
      setAuthPassword('');
    }
  };

  // ---- design form ------------------------------------------------------

  const onFileChosen = async (file: File) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const resized = await resizeImageFile(file, 900, 0.82);
      setPendingFile(resized);
      if (pendingPreview) URL.revokeObjectURL(pendingPreview);
      setPendingPreview(URL.createObjectURL(resized));
      setKeepExistingImage('');
    } catch {
      setError('Could not read that image. Try a different one.');
    } finally {
      setBusy(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setCategory('Aso-Ebi & Owambe');
    setDescription('');
    setPendingFile(null);
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    setPendingPreview('');
    setKeepExistingImage('');
    setTags('');
    setError(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError('Please enter a name.');
    const isEditing = Boolean(editingId);
    if (!isEditing && !pendingFile) return setError('Please choose a photo.');

    setBusy(true);
    try {
      let imageUrl = keepExistingImage;
      if (pendingFile) {
        if (cloudEnabled) {
          imageUrl = await uploadDesignImage(pendingFile);
        } else {
          imageUrl = await fileToBase64(pendingFile);
        }
      }

      if (isEditing && editingId) {
        await updateDesign(editingId, {
          name: name.trim(),
          category,
          description: description.trim() || `A ${category} piece by Happiness.`,
          image: imageUrl,
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        });
        setInfo('Design updated.');
      } else {
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
      }
      resetForm();
      setTimeout(() => setInfo(null), 2200);
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

  const startEdit = (d: Design) => {
    setEditingId(d.id);
    setName(d.name);
    setCategory(d.category);
    setDescription(d.description);
    setTags(d.tags.join(', '));
    setKeepExistingImage(d.image);
    setPendingFile(null);
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    setPendingPreview('');
    setTab('add');
    if (fileRef.current) fileRef.current.value = '';
  };

  const isEditing = Boolean(editingId);
  const previewSrc = pendingPreview || keepExistingImage;

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
              <UnlockScreen
                cloudReady={cloudReady}
                authBusy={authBusy}
                authLoading={auth.loading}
                authMode={authMode}
                authEmail={authEmail}
                authPassword={authPassword}
                onChangeEmail={setAuthEmail}
                onChangePassword={setAuthPassword}
                onAuthSubmit={onAuthSubmit}
                onSwitchMode={(m) => {
                  setAuthMode(m);
                  setError(null);
                  setInfo(null);
                }}
                passcodeInput={passcodeInput}
                onChangePasscode={setPasscodeInput}
                onPasscodeSubmit={tryLocalUnlock}
                error={error}
                info={info}
              />
            ) : (
              <div className="grid max-h-[88vh] grid-rows-[auto_auto_1fr] overflow-hidden">
                <header className="flex items-center justify-between gap-4 border-b border-ink-800/10 p-6 pr-16 dark:border-cream-100/10">
                  <div>
                    <p className="eyebrow">Atelier panel</p>
                    <h3 className="display-3 mt-2">Manage your collection</h3>
                    {cloudReady && auth.admin && (
                      <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-ink-800/60 dark:text-cream-100/60">
                        <ShieldCheck size={12} className="text-bronze-500" />
                        Signed in as <strong className="font-medium">{auth.admin.email}</strong>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <CloudStatus enabled={cloudEnabled} loading={loading} />
                    {cloudReady && auth.admin && (
                      <button
                        type="button"
                        onClick={() => auth.signOut()}
                        className="grid h-9 w-9 place-items-center rounded-full border border-ink-800/15 text-ink-800/70 transition-colors hover:border-bronze-500 hover:text-bronze-500 dark:border-cream-100/20 dark:text-cream-100/70"
                        title="Sign out"
                        aria-label="Sign out"
                      >
                        <LogOut size={14} />
                      </button>
                    )}
                  </div>
                </header>

                <div className="flex gap-1 border-b border-ink-800/10 px-6 dark:border-cream-100/10">
                  <TabButton active={tab === 'add'} onClick={() => setTab('add')}>
                    <Plus size={14} /> {isEditing ? 'Edit design' : 'Add design'}
                  </TabButton>
                  <TabButton active={tab === 'categories'} onClick={() => setTab('categories')}>
                    <Tag size={14} /> Categories
                  </TabButton>
                  <TabButton active={tab === 'qr'} onClick={() => setTab('qr')}>
                    <QrCode size={14} /> QR
                  </TabButton>
                </div>

                <div className="overflow-y-auto p-6 md:p-8">
                  {tab === 'qr' && <QrPanel />}

                  {tab === 'categories' && <CategoryLabelsPanel />}

                  {tab === 'add' && (
                    <>
                      {isEditing && (
                        <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-bronze-500/30 bg-bronze-400/10 p-3 text-sm">
                          <span className="flex items-center gap-2 text-bronze-600 dark:text-bronze-400">
                            <Pencil size={14} /> Editing <strong>{name || '(untitled)'}</strong>
                          </span>
                          <button
                            type="button"
                            onClick={resetForm}
                            className="rounded-full border border-ink-800/15 px-3 py-0.5 text-[10px] uppercase tracking-[0.18em] hover:border-bronze-500 dark:border-cream-100/20"
                          >
                            New design instead
                          </button>
                        </div>
                      )}

                      <form onSubmit={submit} className="grid gap-5 md:grid-cols-2">
                        <div className="md:col-span-2">
                          <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-ink-800/70 dark:text-cream-100/70">
                            Photo of the design
                          </label>
                          {previewSrc ? (
                            <div className="relative overflow-hidden rounded-2xl">
                              <img
                                src={previewSrc}
                                alt="preview"
                                className="h-64 w-full object-cover"
                              />
                              <div className="absolute right-3 top-3 flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => fileRef.current?.click()}
                                  className="rounded-full bg-cream-100/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-ink-800"
                                >
                                  Replace
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
                                    setPendingFile(null);
                                    setPendingPreview('');
                                    setKeepExistingImage('');
                                  }}
                                  className="grid h-7 w-7 place-items-center rounded-full bg-cream-100/90 text-ink-800"
                                >
                                  <X size={14} />
                                </button>
                              </div>
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
                            Category (which section to put it in)
                          </label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value as DesignCategory)}
                            className="w-full rounded-full border border-ink-800/15 bg-cream-100 px-5 py-3 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-800"
                          >
                            {categories.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
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
                        {info && (
                          <p className="rounded-2xl bg-[#25D366]/10 p-2.5 text-xs text-[#1da851] md:col-span-2">
                            {info}
                          </p>
                        )}

                        <div className="flex gap-3 md:col-span-2">
                          <button
                            type="submit"
                            disabled={busy}
                            className="btn-primary disabled:opacity-50"
                          >
                            {isEditing ? <Pencil size={16} /> : <Plus size={16} />}
                            {busy
                              ? 'Saving…'
                              : isEditing
                              ? 'Save changes'
                              : cloudEnabled
                              ? 'Publish to site'
                              : 'Save Design'}
                          </button>
                          <button type="button" onClick={resetForm} className="btn-ghost">
                            {isEditing ? 'Cancel edit' : 'Reset'}
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
                                <div className="absolute inset-x-2 bottom-2 flex items-end justify-between gap-2">
                                  <div className="min-w-0">
                                    <div className="line-clamp-1 text-xs font-medium text-cream-100">
                                      {d.name}
                                    </div>
                                    <div className="line-clamp-1 text-[9px] uppercase tracking-[0.2em] text-cream-100/70">
                                      {d.category}
                                    </div>
                                  </div>
                                  <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                    <button
                                      type="button"
                                      onClick={() => startEdit(d)}
                                      aria-label="Edit design"
                                      className="grid h-7 w-7 place-items-center rounded-full bg-bronze-500 text-cream-100"
                                    >
                                      <Pencil size={11} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRemove(d.id)}
                                      aria-label="Remove design"
                                      className="grid h-7 w-7 place-items-center rounded-full bg-wine-500 text-cream-100"
                                    >
                                      <Trash2 size={11} />
                                    </button>
                                  </div>
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

/**
 * Categories tab — admin can rename the displayed labels of the 6 default
 * categories. The underlying data uses the canonical strings; only the
 * labels shown to visitors change. Saved via SiteContentContext under
 * `category.label.<canonical>` keys, so they sync across devices when
 * Supabase is configured.
 */
function CategoryLabelsPanel() {
  const { get, set, reset, hasOverride } = useSiteContent();
  const [drafts, setDrafts] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const c of categories) initial[c] = get(`category.label.${c}`, c);
    return initial;
  });
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const onSave = async (canonical: DesignCategory) => {
    const value = drafts[canonical].trim();
    setSavingKey(canonical);
    try {
      if (!value || value === canonical) {
        await reset(`category.label.${canonical}`);
      } else {
        await set(`category.label.${canonical}`, value);
      }
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div>
      <p className="eyebrow">Section labels</p>
      <h4 className="display-3 mt-2">Rename the categories</h4>
      <p className="mt-2 text-sm text-ink-800/65 dark:text-cream-100/65">
        These labels appear on the filter chips in the Collection and the Lookbook,
        and in the dropdown when you add a new design. Renaming here does not
        move existing pieces — it just changes the label visitors see.
      </p>

      <div className="mt-6 space-y-3">
        {categories.map((c) => {
          const overridden = hasOverride(`category.label.${c}`);
          const draft = drafts[c] ?? c;
          return (
            <div
              key={c}
              className="flex flex-col gap-2 rounded-2xl border border-ink-800/10 p-4 sm:flex-row sm:items-center dark:border-cream-100/10"
            >
              <div className="min-w-[180px] sm:flex-1">
                <div className="text-[10px] uppercase tracking-[0.22em] text-ink-800/55 dark:text-cream-100/55">
                  Default name
                </div>
                <div className="font-display text-base">{c}</div>
              </div>
              <div className="flex flex-1 items-center gap-2">
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDrafts((p) => ({ ...p, [c]: e.target.value }))}
                  placeholder={c}
                  className="flex-1 rounded-full border border-ink-800/15 bg-transparent px-4 py-2 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20"
                />
                <button
                  type="button"
                  onClick={() => onSave(c)}
                  disabled={savingKey === c}
                  className="rounded-full bg-bronze-500 px-3.5 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-cream-100 disabled:opacity-50"
                >
                  {savingKey === c ? '…' : 'Save'}
                </button>
                {overridden && (
                  <button
                    type="button"
                    onClick={async () => {
                      await reset(`category.label.${c}`);
                      setDrafts((p) => ({ ...p, [c]: c }));
                    }}
                    className="rounded-full border border-ink-800/15 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-ink-800/70 hover:border-bronze-500 dark:border-cream-100/20 dark:text-cream-100/70"
                    title="Reset to default name"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface UnlockScreenProps {
  cloudReady: boolean;
  authBusy: boolean;
  authLoading: boolean;
  authMode: 'signin' | 'signup';
  authEmail: string;
  authPassword: string;
  onChangeEmail: (s: string) => void;
  onChangePassword: (s: string) => void;
  onAuthSubmit: (e: React.FormEvent) => void;
  onSwitchMode: (m: 'signin' | 'signup') => void;
  passcodeInput: string;
  onChangePasscode: (s: string) => void;
  onPasscodeSubmit: (e: React.FormEvent) => void;
  error: string | null;
  info: string | null;
}

function UnlockScreen(p: UnlockScreenProps) {
  if (p.cloudReady) {
    return (
      <div className="p-8 md:p-12">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-bronze-400/20 text-bronze-500">
          <ShieldCheck size={20} />
        </div>
        <h3 className="display-3 mt-5">
          {p.authMode === 'signin' ? 'Atelier sign in' : 'Create your atelier account'}
        </h3>
        <p className="mt-2 text-sm text-ink-800/65 dark:text-cream-100/65">
          {p.authMode === 'signin'
            ? 'Sign in with the atelier admin email to manage the collection.'
            : 'First time? Create the atelier account using your registered admin email.'}
        </p>

        <form onSubmit={p.onAuthSubmit} className="mt-8 space-y-3">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-ink-800/70 dark:text-cream-100/70">
              Email
            </label>
            <input
              type="email"
              autoFocus
              value={p.authEmail}
              onChange={(e) => p.onChangeEmail(e.target.value)}
              placeholder="atelier@happinessfashion.com"
              className="w-full rounded-full border border-ink-800/15 bg-transparent px-5 py-3 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-ink-800/70 dark:text-cream-100/70">
              Password
            </label>
            <input
              type="password"
              value={p.authPassword}
              onChange={(e) => p.onChangePassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-full border border-ink-800/15 bg-transparent px-5 py-3 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20"
              required
              minLength={6}
            />
          </div>

          {p.error && <p className="text-sm text-wine-500">{p.error}</p>}
          {p.info && (
            <p className="rounded-2xl bg-[#25D366]/10 p-3 text-sm text-[#1da851]">{p.info}</p>
          )}

          <button
            type="submit"
            disabled={p.authBusy || p.authLoading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {p.authBusy
              ? 'Working…'
              : p.authMode === 'signin'
              ? 'Sign in'
              : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-800/60 dark:text-cream-100/60">
          {p.authMode === 'signin' ? (
            <>
              First time?{' '}
              <button
                type="button"
                onClick={() => p.onSwitchMode('signup')}
                className="font-medium text-bronze-500 hover:underline"
              >
                Create your atelier account
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => p.onSwitchMode('signin')}
                className="font-medium text-bronze-500 hover:underline"
              >
                Sign in instead
              </button>
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-bronze-400/20 text-bronze-500">
        <Lock size={20} />
      </div>
      <h3 className="display-3 mt-5">Atelier access</h3>
      <p className="mt-2 text-sm text-ink-800/65 dark:text-cream-100/65">
        Enter the studio passcode to manage your collection.
      </p>
      <form onSubmit={p.onPasscodeSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
        <input
          type="password"
          autoFocus
          value={p.passcodeInput}
          onChange={(e) => p.onChangePasscode(e.target.value)}
          placeholder="Passcode"
          className="flex-1 rounded-full border border-ink-800/15 bg-transparent px-5 py-3 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20"
        />
        <button type="submit" className="btn-primary">
          Unlock
        </button>
      </form>
      {p.error && <p className="mt-3 text-sm text-wine-500">{p.error}</p>}
      <p className="mt-8 rounded-2xl bg-bronze-400/10 p-4 text-xs text-ink-800/70 dark:text-cream-100/70">
        <span className="font-medium text-bronze-500">Local-only mode.</span> Designs you add
        live on this device only. To make them sync to every visitor in real time, set up
        cloud sync — see <code>SUPABASE_SETUP.md</code>.
      </p>
    </div>
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
