import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  Camera,
  Cloud,
  CloudOff,
  Eye,
  EyeOff,
  ImagePlus,
  Layers,
  Lock,
  LogOut,
  Pencil,
  Plus,
  QrCode,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useCustomDesigns } from '../context/CustomDesignsContext';
import { useSiteContent } from '../context/SiteContentContext';
import { categories, type Design, type DesignCategory } from '../data/designs';
import { resizeImageFile } from '../utils/imageResize';
import { validateImageFile } from '../utils/sanitize';
import { uploadDesignImage } from '../services/designsService';
import { hasAdminConfigured, useAdminAuth } from '../lib/auth';
import { ADMIN_EMAIL, isSupabaseEnabled } from '../lib/supabase';
import QrPanel from './QrPanel';
import AnalyticsDashboard from './AnalyticsDashboard';

interface Props {
  open: boolean;
  onClose: () => void;
  /** When set, the panel opens in EDIT mode pre-filled with this design. */
  editingDesign?: Design | null;
}

const LOCAL_PASSCODE = 'happy2026';
const ATTEMPT_STORAGE_KEY = 'hfw-admin-attempts';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 300000; // 5 minutes in ms

interface AttemptState {
  count: number;
  lockedUntil: number | null;
}

function getAttemptState(): AttemptState {
  try {
    const raw = sessionStorage.getItem(ATTEMPT_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { count: 0, lockedUntil: null };
}

function setAttemptState(state: AttemptState) {
  try {
    sessionStorage.setItem(ATTEMPT_STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

type Tab = 'add' | 'batch' | 'categories' | 'qr' | 'analytics';

/** A single pending design in batch mode (one card per uploaded photo). */
interface BatchItem {
  /** Local-only random id for React keys. */
  localId: string;
  file: File;
  preview: string;
  name: string;
  category: DesignCategory;
  status: 'pending' | 'uploading' | 'done' | 'error';
  errorMessage?: string;
}

export default function AddDesignPanel({ open, onClose, editingDesign }: Props) {
  const { customDesigns, addDesign, updateDesign, removeDesign, cloudEnabled, loading } = useCustomDesigns();
  const auth = useAdminAuth();

  const [localUnlocked, setLocalUnlocked] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const [tab, setTab] = useState<Tab>('add');

  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // Sign-in form state (cloud mode)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authEmail, setAuthEmail] = useState(ADMIN_EMAIL ?? '');
  const [authPassword, setAuthPassword] = useState('');
  const [authBusy, setAuthBusy] = useState(false);

  // Form state for adding/editing a single design
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<DesignCategory>('Aso-Ebi & Owambe');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [featured, setFeatured] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string>('');
  const [keepExistingImage, setKeepExistingImage] = useState<string>('');
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Batch mode state
  const [batch, setBatch] = useState<BatchItem[]>([]);
  const [batchPublishing, setBatchPublishing] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ done: 0, total: 0 });
  const batchFileRef = useRef<HTMLInputElement>(null);

  const cloudReady = isSupabaseEnabled && hasAdminConfigured();
  const unlocked = cloudReady ? auth.admin !== null : localUnlocked;

  // Cleanup any object URLs to avoid leaks
  useEffect(() => {
    return () => {
      batch.forEach((b) => URL.revokeObjectURL(b.preview));
      if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When opened with an editingDesign, switch to add tab + pre-fill
  useEffect(() => {
    if (open && editingDesign) {
      setTab('add');
      setEditingId(editingDesign.id);
      setName(editingDesign.name);
      setCategory(editingDesign.category);
      setDescription(editingDesign.description);
      setTags(editingDesign.tags.join(', '));
      setFeatured(Boolean(editingDesign.featured));
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
      // Clear batch on close (release object URLs)
      setBatch((prev) => {
        prev.forEach((b) => URL.revokeObjectURL(b.preview));
        return [];
      });
    }
  }, [open]);

  // ---- rate-limit lockout countdown ----
  useEffect(() => {
    const interval = setInterval(() => {
      const state = getAttemptState();
      if (state.lockedUntil) {
        const remaining = state.lockedUntil - Date.now();
        if (remaining <= 0) {
          setAttemptState({ count: 0, lockedUntil: null });
          setLockoutRemaining(0);
          setError(null);
        } else {
          setLockoutRemaining(remaining);
        }
      } else {
        setLockoutRemaining(0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ---- local passcode flow ----
  const tryLocalUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const state = getAttemptState();
    if (state.lockedUntil && state.lockedUntil > Date.now()) {
      const remaining = Math.ceil((state.lockedUntil - Date.now()) / 1000);
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      setError(`Too many failed attempts. Try again in ${mins}:${secs.toString().padStart(2, '0')}.`);
      return;
    }

    if (passcodeInput.trim() === LOCAL_PASSCODE) {
      setLocalUnlocked(true);
      setError(null);
      setAttemptState({ count: 0, lockedUntil: null });
      setLockoutRemaining(0);
    } else {
      const newCount = state.count + 1;
      if (newCount >= MAX_ATTEMPTS) {
        const lockedUntil = Date.now() + LOCKOUT_DURATION;
        setAttemptState({ count: newCount, lockedUntil });
        setLockoutRemaining(LOCKOUT_DURATION);
        setError('Too many failed attempts. Try again in 5:00.');
      } else {
        setAttemptState({ count: newCount, lockedUntil: null });
        const remaining = MAX_ATTEMPTS - newCount;
        setError(`Incorrect passcode. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`);
      }
    }
  };

  // ---- cloud auth flow ----
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

  // ---- single-design form ----
  const onSingleFileChosen = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // Multiple selected? -> route through batch mode for easy bulk upload.
    if (files.length > 1) {
      await onBatchFilesChosen(files);
      setTab('batch');
      return;
    }

    const file = files[0];
    setBusy(true);
    setError(null);
    try {
      const validation = await validateImageFile(file);
      if (!validation.valid) {
        setError(validation.error || 'Invalid image file.');
        setBusy(false);
        return;
      }
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

  const removeSingleImage = () => {
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    setPendingFile(null);
    setPendingPreview('');
    setKeepExistingImage('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setCategory('Aso-Ebi & Owambe');
    setDescription('');
    setFeatured(false);
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
          featured,
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
          featured,
        });
        setInfo('Design published.');
      }
      resetForm();
      setTimeout(() => setInfo(null), 2200);
    } catch (err) {
      setError((err as Error).message ?? 'Could not save. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async (id: string, label: string) => {
    if (!window.confirm(`Delete "${label}"? This cannot be undone.`)) return;
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
    setFeatured(Boolean(d.featured));
    setKeepExistingImage(d.image);
    setPendingFile(null);
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    setPendingPreview('');
    setTab('add');
    if (fileRef.current) fileRef.current.value = '';
  };

  // ---- BATCH UPLOAD ---- (multi-file flow)
  const onBatchFilesChosen = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setInfo(null);

    const newItems: BatchItem[] = [];
    const startCount = batch.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const validation = await validateImageFile(file);
        if (!validation.valid) {
          // Skip invalid files; user gets a banner at end
          continue;
        }
        const resized = await resizeImageFile(file, 900, 0.82);
        newItems.push({
          localId: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
          file: resized,
          preview: URL.createObjectURL(resized),
          name: '',
          category,
          status: 'pending',
        });
      } catch {
        /* skip unreadable files */
      }
    }

    if (newItems.length === 0) {
      setError('None of the selected files were valid images.');
      return;
    }

    const skipped = files.length - newItems.length;
    if (skipped > 0) {
      setInfo(`Added ${newItems.length} photo${newItems.length === 1 ? '' : 's'}. Skipped ${skipped} invalid file${skipped === 1 ? '' : 's'}.`);
    } else {
      setInfo(`Added ${newItems.length} photo${newItems.length === 1 ? '' : 's'}. Give them quick names below, then publish.`);
    }
    setBatch((prev) => [...prev, ...newItems]);
    if (batchFileRef.current) batchFileRef.current.value = '';
    // Auto-suggest "Untitled" names so she can publish without typing if she wants
    setTimeout(() => {
      setBatch((prev) =>
        prev.map((b, i) => (i >= startCount && !b.name ? { ...b, name: `New piece ${i + 1}` } : b))
      );
    }, 50);
    setTimeout(() => setInfo(null), 3500);
  };

  const updateBatchItem = (id: string, patch: Partial<BatchItem>) =>
    setBatch((prev) => prev.map((b) => (b.localId === id ? { ...b, ...patch } : b)));

  const removeBatchItem = (id: string) => {
    setBatch((prev) => {
      const item = prev.find((b) => b.localId === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((b) => b.localId !== id);
    });
  };

  const clearBatch = () => {
    batch.forEach((b) => URL.revokeObjectURL(b.preview));
    setBatch([]);
  };

  const publishBatch = async () => {
    if (batch.length === 0) return;
    const pending = batch.filter((b) => b.status === 'pending' || b.status === 'error');
    if (pending.length === 0) return;

    // Validate names
    for (const b of pending) {
      if (!b.name.trim()) {
        setError('Every photo needs a name. Tap each card to fill in the name.');
        return;
      }
    }

    setBatchPublishing(true);
    setError(null);
    setInfo(null);
    setBatchProgress({ done: 0, total: pending.length });

    let okCount = 0;
    for (let i = 0; i < pending.length; i++) {
      const item = pending[i];
      updateBatchItem(item.localId, { status: 'uploading', errorMessage: undefined });
      try {
        let imageUrl: string;
        if (cloudEnabled) {
          imageUrl = await uploadDesignImage(item.file);
        } else {
          imageUrl = await fileToBase64(item.file);
        }
        await addDesign({
          name: item.name.trim(),
          category: item.category,
          description: `A new ${item.category} piece by Happiness.`,
          image: imageUrl,
          tags: [],
          occasions: ['party'],
          vibes: ['classic'],
          colorMood: 'neutral',
        });
        updateBatchItem(item.localId, { status: 'done' });
        okCount += 1;
      } catch (err) {
        updateBatchItem(item.localId, {
          status: 'error',
          errorMessage: (err as Error).message ?? 'Upload failed.',
        });
      }
      setBatchProgress({ done: i + 1, total: pending.length });
    }

    setBatchPublishing(false);
    if (okCount > 0) {
      setInfo(`Published ${okCount} new piece${okCount === 1 ? '' : 's'} to your Lookbook.`);
      // Clean up successful items so the list shrinks to just failures
      setBatch((prev) => {
        const keep = prev.filter((b) => b.status !== 'done');
        prev
          .filter((b) => b.status === 'done')
          .forEach((b) => URL.revokeObjectURL(b.preview));
        return keep;
      });
    }
    if (okCount < pending.length) {
      setError(`${pending.length - okCount} photo${pending.length - okCount === 1 ? '' : 's'} could not be published. Tap each card to retry.`);
    }
  };

  const isEditing = Boolean(editingId);
  const previewSrc = pendingPreview || keepExistingImage;

  const headerTitle = useMemo(() => {
    if (tab === 'qr') return 'QR & sharing';
    if (tab === 'analytics') return 'Visitor analytics';
    if (tab === 'categories') return 'Category labels';
    if (tab === 'batch') return 'Quick batch upload';
    return isEditing ? 'Edit design' : 'Add a new design';
  }, [tab, isEditing]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-stretch justify-center bg-ink-900/85 backdrop-blur-md sm:items-center sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-[100dvh] w-full max-w-3xl flex-col overflow-hidden bg-cream-100 shadow-luxe sm:h-auto sm:max-h-[92vh] sm:rounded-3xl dark:bg-ink-800"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-[max(env(safe-area-inset-top,0),0.75rem)] z-20 grid h-11 w-11 place-items-center rounded-full bg-cream-100/95 text-ink-800 shadow-soft backdrop-blur-md transition-colors hover:bg-cream-100 active:scale-95 dark:bg-ink-900/95 dark:text-cream-100"
            >
              <X size={20} />
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
                onResetPassword={(email) => auth.resetPassword(email)}
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
                lockoutRemaining={lockoutRemaining}
              />
            ) : (
              <div className="flex h-full min-h-0 flex-col overflow-hidden">
                {/* Header */}
                <header className="flex shrink-0 items-start justify-between gap-3 border-b border-ink-800/10 px-4 pb-3 pr-16 pt-[max(env(safe-area-inset-top,0),1rem)] sm:px-6 sm:pb-4 dark:border-cream-100/10">
                  <div className="min-w-0 flex-1">
                    <p className="eyebrow text-[10px] sm:text-xs">Atelier panel</p>
                    <h3 className="mt-1 break-words font-display text-xl leading-tight sm:mt-2 sm:text-3xl md:text-4xl">
                      {headerTitle}
                    </h3>
                    {cloudReady && auth.admin && (
                      <p className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] text-ink-800/60 sm:mt-2 sm:text-xs dark:text-cream-100/60">
                        <ShieldCheck size={12} className="shrink-0 text-bronze-500" />
                        <span className="break-all">{auth.admin.email}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
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

                {/* Tabs */}
                <div className="flex shrink-0 gap-0.5 overflow-x-auto border-b border-ink-800/10 px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-1 sm:px-4 dark:border-cream-100/10">
                  <TabButton active={tab === 'add'} onClick={() => setTab('add')}>
                    <Plus size={14} /> {isEditing ? 'Edit' : 'Add'}
                  </TabButton>
                  <TabButton active={tab === 'batch'} onClick={() => setTab('batch')}>
                    <Layers size={14} /> Batch
                    {batch.length > 0 && (
                      <span className="ml-1 rounded-full bg-bronze-500 px-1.5 py-0.5 text-[9px] font-medium text-cream-100">
                        {batch.length}
                      </span>
                    )}
                  </TabButton>
                  <TabButton active={tab === 'categories'} onClick={() => setTab('categories')}>
                    <Tag size={14} /> Labels
                  </TabButton>
                  <TabButton active={tab === 'qr'} onClick={() => setTab('qr')}>
                    <QrCode size={14} /> QR
                  </TabButton>
                  <TabButton active={tab === 'analytics'} onClick={() => setTab('analytics')}>
                    <BarChart3 size={14} /> Stats
                  </TabButton>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-4 py-5 pb-[max(env(safe-area-inset-bottom,0),1.5rem)] sm:px-6 sm:py-6 md:px-8 md:py-8">
                  {tab === 'qr' && <QrPanel />}
                  {tab === 'analytics' && <AnalyticsDashboard />}
                  {tab === 'categories' && <CategoryLabelsPanel />}

                  {tab === 'add' && (
                    <>
                      {isEditing && (
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-bronze-500/30 bg-bronze-400/10 p-3 text-sm">
                          <span className="flex items-center gap-2 text-bronze-600 dark:text-bronze-400">
                            <Pencil size={14} /> Editing <strong className="break-all">{name || '(untitled)'}</strong>
                          </span>
                          <button
                            type="button"
                            onClick={resetForm}
                            className="rounded-full border border-ink-800/15 px-3 py-1 text-[10px] uppercase tracking-[0.18em] hover:border-bronze-500 dark:border-cream-100/20"
                          >
                            New design instead
                          </button>
                        </div>
                      )}

                      <form onSubmit={submit} className="grid gap-4 md:grid-cols-2 md:gap-5">
                        {/* Featured image with always-visible Replace / Remove */}
                        <div className="md:col-span-2">
                          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.22em] text-ink-800/70 dark:text-cream-100/70">
                            Featured photo
                          </label>
                          {previewSrc ? (
                            <div className="relative overflow-hidden rounded-2xl border border-ink-800/10 dark:border-cream-100/10">
                              <img
                                src={previewSrc}
                                alt="preview"
                                className="aspect-[4/5] w-full object-cover sm:aspect-[16/10]"
                              />
                              {/* ALWAYS-VISIBLE controls (mobile-friendly) */}
                              <div className="absolute right-2 top-2 flex flex-col items-end gap-2 sm:right-3 sm:top-3 sm:flex-row">
                                <button
                                  type="button"
                                  onClick={() => fileRef.current?.click()}
                                  className="inline-flex items-center gap-1.5 rounded-full bg-cream-100/95 px-3.5 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink-800 shadow-soft backdrop-blur-md transition-colors hover:bg-bronze-400 active:scale-95"
                                >
                                  <Camera size={12} />
                                  Replace
                                </button>
                                <button
                                  type="button"
                                  onClick={removeSingleImage}
                                  aria-label="Remove photo"
                                  className="inline-flex items-center gap-1.5 rounded-full bg-wine-500/95 px-3.5 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-cream-100 shadow-soft backdrop-blur-md transition-colors hover:bg-wine-600 active:scale-95"
                                >
                                  <Trash2 size={12} />
                                  Remove
                                </button>
                              </div>
                              {pendingFile && (
                                <span className="absolute bottom-2 left-2 rounded-full bg-cream-100/90 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.2em] text-ink-800 shadow-sm dark:bg-ink-900/90 dark:text-cream-100">
                                  New photo
                                </span>
                              )}
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => fileRef.current?.click()}
                              className="grid w-full place-items-center gap-2 rounded-2xl border-2 border-dashed border-ink-800/20 px-6 py-10 text-sm text-ink-800/70 transition-colors hover:border-bronze-500 hover:text-bronze-500 active:scale-[0.99] sm:py-12 dark:border-cream-100/20 dark:text-cream-100/70"
                            >
                              <Upload size={26} />
                              <span className="text-base font-medium">{busy ? 'Resizing photo...' : 'Tap to upload a photo'}</span>
                              <span className="text-[10px] uppercase tracking-[0.2em] text-ink-800/40 dark:text-cream-100/40">
                                JPG, PNG, WebP, HEIC. Auto-resized.
                              </span>
                              <span className="mt-2 text-[10px] text-bronze-500">
                                Tip: pick more than one photo to batch-upload many designs at once.
                              </span>
                            </button>
                          )}
                          <input
                            ref={fileRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                            multiple
                            className="hidden"
                            onChange={(e) => onSingleFileChosen(e.target.files)}
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.22em] text-ink-800/70 dark:text-cream-100/70">
                            Design name
                          </label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Sapphire Aso-Ebi"
                            enterKeyHint="next"
                            autoComplete="off"
                            autoCapitalize="words"
                            className="w-full rounded-2xl border border-ink-800/15 bg-cream-50 px-4 py-3.5 text-base focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.22em] text-ink-800/70 dark:text-cream-100/70">
                            Category
                          </label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value as DesignCategory)}
                            className="w-full appearance-none rounded-2xl border border-ink-800/15 bg-cream-50 px-4 py-3.5 text-base focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900"
                          >
                            {categories.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                          <p className="mt-1 text-[11px] text-ink-800/55 dark:text-cream-100/55">
                            Which section to put this in.
                          </p>
                        </div>

                        <div className="md:col-span-2">
                          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.22em] text-ink-800/70 dark:text-cream-100/70">
                            Description (optional)
                          </label>
                          <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tell clients what makes this piece special..."
                            enterKeyHint="enter"
                            className="w-full rounded-2xl border border-ink-800/15 bg-cream-50 px-4 py-3 text-base focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.22em] text-ink-800/70 dark:text-cream-100/70">
                            Tags (comma-separated, optional)
                          </label>
                          <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="lace, embroidered, beaded"
                            enterKeyHint="done"
                            autoCapitalize="none"
                            autoCorrect="off"
                            className="w-full rounded-2xl border border-ink-800/15 bg-cream-50 px-4 py-3.5 text-base focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900"
                          />
                        </div>

                        {/* Featured toggle */}
                        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-ink-800/15 bg-cream-50 px-4 py-3.5 text-sm transition-colors hover:border-bronze-500 md:col-span-2 dark:border-cream-100/20 dark:bg-ink-900">
                          <span className="flex items-center gap-3">
                            <Star size={18} className={featured ? 'text-bronze-500' : 'text-ink-800/40 dark:text-cream-100/40'} fill={featured ? 'currentColor' : 'none'} />
                            <span>
                              <span className="block font-medium">Mark as featured</span>
                              <span className="block text-[11px] text-ink-800/55 dark:text-cream-100/55">
                                Featured pieces get a gold ribbon on the homepage.
                              </span>
                            </span>
                          </span>
                          <span
                            className={`relative inline-block h-6 w-11 shrink-0 rounded-full transition-colors ${
                              featured ? 'bg-bronze-500' : 'bg-ink-800/20 dark:bg-cream-100/20'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={featured}
                              onChange={(e) => setFeatured(e.target.checked)}
                              className="absolute inset-0 cursor-pointer opacity-0"
                              aria-label="Mark as featured"
                            />
                            <span
                              className={`absolute top-0.5 h-5 w-5 rounded-full bg-cream-100 shadow transition-transform ${
                                featured ? 'translate-x-[22px]' : 'translate-x-0.5'
                              }`}
                            />
                          </span>
                        </label>

                        {error && (
                          <p className="rounded-2xl border border-wine-500/30 bg-wine-500/10 p-3 text-sm text-wine-500 md:col-span-2">
                            {error}
                          </p>
                        )}
                        {info && (
                          <p className="rounded-2xl border border-[#25D366]/30 bg-[#25D366]/10 p-3 text-sm text-[#1da851] md:col-span-2">
                            {info}
                          </p>
                        )}

                        <div className="sticky bottom-0 z-10 flex flex-col gap-2 bg-gradient-to-t from-cream-100 via-cream-100 to-cream-100/0 pb-1 pt-3 sm:relative sm:flex-row sm:bg-none sm:pt-0 md:col-span-2 dark:from-ink-800 dark:via-ink-800 dark:to-ink-800/0">
                          <button
                            type="submit"
                            disabled={busy}
                            className="btn-primary w-full disabled:opacity-50 sm:w-auto"
                          >
                            {isEditing ? <Pencil size={16} /> : <Plus size={16} />}
                            {busy
                              ? 'Saving...'
                              : isEditing
                              ? 'Save changes'
                              : cloudEnabled
                              ? 'Publish to site'
                              : 'Save design'}
                          </button>
                          <button
                            type="button"
                            onClick={resetForm}
                            className="btn-ghost w-full sm:w-auto"
                          >
                            {isEditing ? 'Cancel edit' : 'Reset form'}
                          </button>
                        </div>
                      </form>

                      {customDesigns.length > 0 && (
                        <div className="mt-10">
                          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                            <p className="eyebrow">
                              {cloudEnabled ? 'Live on the site' : 'Saved on this device'} ({customDesigns.length})
                            </p>
                            <button
                              type="button"
                              onClick={() => setTab('batch')}
                              className="inline-flex items-center gap-1.5 rounded-full border border-bronze-500/30 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-bronze-500 hover:bg-bronze-500/10"
                            >
                              <Layers size={12} /> Batch upload
                            </button>
                          </div>
                          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                            {customDesigns.map((d) => (
                              <CustomDesignCard
                                key={d.id}
                                design={d}
                                onEdit={() => startEdit(d)}
                                onDelete={() => handleRemove(d.id, d.name)}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {tab === 'batch' && (
                    <BatchPanel
                      batch={batch}
                      cloudEnabled={cloudEnabled}
                      defaultCategory={category}
                      publishing={batchPublishing}
                      progress={batchProgress}
                      fileInputRef={batchFileRef}
                      onPickFiles={onBatchFilesChosen}
                      onUpdate={updateBatchItem}
                      onRemove={removeBatchItem}
                      onClear={clearBatch}
                      onPublish={publishBatch}
                      info={info}
                      error={error}
                    />
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

/* =========================================================================
 * BatchPanel - quick multi-photo upload to the Lookbook.
 *
 * Designed for phone use: each photo gets a single big card with name +
 * category. Tap "Publish all" once and Happiness can add 5-20 designs in
 * a single session without re-opening the file picker.
 * ======================================================================= */

interface BatchPanelProps {
  batch: BatchItem[];
  cloudEnabled: boolean;
  defaultCategory: DesignCategory;
  publishing: boolean;
  progress: { done: number; total: number };
  fileInputRef: React.RefObject<HTMLInputElement>;
  onPickFiles: (files: FileList | null) => void;
  onUpdate: (id: string, patch: Partial<BatchItem>) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onPublish: () => void;
  info: string | null;
  error: string | null;
}

function BatchPanel({
  batch,
  cloudEnabled,
  defaultCategory,
  publishing,
  progress,
  fileInputRef,
  onPickFiles,
  onUpdate,
  onRemove,
  onClear,
  onPublish,
  info,
  error,
}: BatchPanelProps) {
  const pendingCount = batch.filter((b) => b.status === 'pending' || b.status === 'error').length;

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-bronze-500/30 bg-bronze-400/10 p-4">
        <div className="flex items-center gap-2 text-bronze-600 dark:text-bronze-400">
          <Sparkles size={16} className="shrink-0" />
          <span className="font-medium">Add many designs at once</span>
        </div>
        <p className="mt-2 text-sm text-ink-800/70 dark:text-cream-100/70">
          Pick several photos from your phone in one go. Each photo becomes its
          own design in the Lookbook. Give them quick names below, then tap
          <strong className="font-semibold"> Publish all</strong>.
        </p>
      </div>

      {/* Picker button */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={publishing}
        className="grid w-full place-items-center gap-2 rounded-2xl border-2 border-dashed border-bronze-500/40 bg-bronze-400/5 px-6 py-7 text-sm text-bronze-600 transition-colors hover:border-bronze-500 hover:bg-bronze-400/10 disabled:opacity-50 active:scale-[0.99] dark:text-bronze-400"
      >
        <ImagePlus size={26} />
        <span className="text-base font-medium">
          {batch.length === 0 ? 'Pick photos from your phone' : 'Add more photos'}
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] opacity-70">
          You can pick many at once
        </span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        multiple
        className="hidden"
        onChange={(e) => onPickFiles(e.target.files)}
      />

      {info && (
        <p className="rounded-2xl border border-[#25D366]/30 bg-[#25D366]/10 p-3 text-sm text-[#1da851]">
          {info}
        </p>
      )}
      {error && (
        <p className="rounded-2xl border border-wine-500/30 bg-wine-500/10 p-3 text-sm text-wine-500">
          {error}
        </p>
      )}

      {publishing && (
        <div className="rounded-2xl border border-bronze-500/30 bg-cream-50 p-4 dark:bg-ink-900">
          <p className="text-sm font-medium">
            Publishing {progress.done} of {progress.total}...
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-800/10 dark:bg-cream-100/10">
            <div
              className="h-full rounded-full bg-bronze-500 transition-all"
              style={{ width: `${progress.total > 0 ? (progress.done / progress.total) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {batch.length > 0 && (
        <>
          <div className="grid gap-3">
            {batch.map((item) => (
              <BatchItemCard
                key={item.localId}
                item={item}
                onUpdate={(patch) => onUpdate(item.localId, patch)}
                onRemove={() => onRemove(item.localId)}
                disabled={publishing}
              />
            ))}
          </div>

          {/* Sticky action bar at the bottom of the scroll area */}
          <div className="sticky bottom-0 z-10 -mx-4 flex flex-col gap-2 border-t border-ink-800/10 bg-cream-100/95 p-4 backdrop-blur-md sm:-mx-6 sm:flex-row sm:items-center sm:justify-between md:-mx-8 dark:border-cream-100/10 dark:bg-ink-800/95">
            <p className="text-sm text-ink-800/70 dark:text-cream-100/70">
              {pendingCount} of {batch.length} ready{' '}
              {defaultCategory && (
                <span className="text-[11px] text-ink-800/50 dark:text-cream-100/50">
                  (default: {defaultCategory})
                </span>
              )}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClear}
                disabled={publishing}
                className="rounded-full border border-ink-800/15 px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-ink-800/70 hover:border-wine-500 hover:text-wine-500 disabled:opacity-50 dark:border-cream-100/20 dark:text-cream-100/70"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={onPublish}
                disabled={publishing || pendingCount === 0}
                className="btn-primary flex-1 disabled:opacity-50 sm:flex-none"
              >
                <Plus size={14} />
                {publishing
                  ? 'Publishing...'
                  : cloudEnabled
                  ? `Publish all ${pendingCount}`
                  : `Save all ${pendingCount}`}
              </button>
            </div>
          </div>
        </>
      )}

      {batch.length === 0 && !publishing && (
        <div className="rounded-2xl border border-dashed border-ink-800/15 p-8 text-center text-sm text-ink-800/55 dark:border-cream-100/15 dark:text-cream-100/55">
          No photos in the queue yet. Tap the button above to pick some.
        </div>
      )}
    </div>
  );
}

interface BatchItemCardProps {
  item: BatchItem;
  onUpdate: (patch: Partial<BatchItem>) => void;
  onRemove: () => void;
  disabled: boolean;
}

function BatchItemCard({ item, onUpdate, onRemove, disabled }: BatchItemCardProps) {
  const statusBadge = (() => {
    if (item.status === 'done') {
      return (
        <span className="rounded-full bg-[#25D366]/15 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.2em] text-[#1da851]">
          Published
        </span>
      );
    }
    if (item.status === 'error') {
      return (
        <span className="rounded-full bg-wine-500/15 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.2em] text-wine-500">
          Failed
        </span>
      );
    }
    if (item.status === 'uploading') {
      return (
        <span className="rounded-full bg-bronze-500/15 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.2em] text-bronze-500">
          Uploading...
        </span>
      );
    }
    return null;
  })();

  return (
    <div
      className={`flex gap-3 rounded-2xl border p-3 transition-opacity sm:gap-4 ${
        item.status === 'done'
          ? 'border-[#25D366]/30 bg-[#25D366]/5 opacity-70'
          : 'border-ink-800/10 bg-cream-50 dark:border-cream-100/10 dark:bg-ink-900'
      }`}
    >
      <img
        src={item.preview}
        alt={item.name || 'pending'}
        className="h-24 w-20 shrink-0 rounded-xl object-cover sm:h-28 sm:w-24"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          {statusBadge}
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            aria-label="Remove from batch"
            className="ml-auto grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-800/50 transition-colors hover:bg-wine-500/10 hover:text-wine-500 disabled:opacity-50 dark:text-cream-100/50"
          >
            <X size={14} />
          </button>
        </div>
        <input
          type="text"
          value={item.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="Design name"
          enterKeyHint="next"
          autoCapitalize="words"
          disabled={disabled || item.status === 'done'}
          className="w-full min-w-0 rounded-xl border border-ink-800/10 bg-cream-100 px-3 py-2.5 text-sm focus:border-bronze-500 focus:outline-none disabled:opacity-50 dark:border-cream-100/10 dark:bg-ink-800"
        />
        <select
          value={item.category}
          onChange={(e) => onUpdate({ category: e.target.value as DesignCategory })}
          disabled={disabled || item.status === 'done'}
          className="w-full min-w-0 appearance-none rounded-xl border border-ink-800/10 bg-cream-100 px-3 py-2.5 text-sm focus:border-bronze-500 focus:outline-none disabled:opacity-50 dark:border-cream-100/10 dark:bg-ink-800"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {item.errorMessage && (
          <p className="text-[11px] text-wine-500">{item.errorMessage}</p>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
 * CustomDesignCard - thumbnail in the "live on site" grid.
 * Mobile-first: action buttons are ALWAYS visible (no hover-only).
 * ======================================================================= */

function CustomDesignCard({
  design,
  onEdit,
  onDelete,
}: {
  design: Design;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-ink-900 shadow-soft">
      <img
        src={design.image}
        alt={design.name}
        className="aspect-[3/4] w-full object-cover transition-transform group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-ink-900/0" />

      {/* Always-visible action chips - top-right */}
      <div className="absolute right-2 top-2 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${design.name}`}
          className="grid h-9 w-9 place-items-center rounded-full bg-bronze-500/95 text-cream-100 shadow-soft backdrop-blur-md transition-transform hover:bg-bronze-600 active:scale-90"
        >
          <Pencil size={13} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Delete ${design.name}`}
          className="grid h-9 w-9 place-items-center rounded-full bg-wine-500/95 text-cream-100 shadow-soft backdrop-blur-md transition-transform hover:bg-wine-600 active:scale-90"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {design.featured && (
        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-bronze-500/95 px-2 py-0.5 text-[8px] font-medium uppercase tracking-[0.2em] text-cream-100 shadow-sm">
          <Star size={9} fill="currentColor" /> Featured
        </span>
      )}

      <div className="absolute inset-x-2 bottom-2">
        <div className="line-clamp-1 text-xs font-medium text-cream-100">{design.name}</div>
        <div className="line-clamp-1 text-[9px] uppercase tracking-[0.2em] text-cream-100/70">
          {design.category}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
 * CategoryLabelsPanel - rename the displayed labels of the 6 categories.
 * Saved via SiteContentContext under `category.label.<canonical>` keys.
 * ======================================================================= */

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
      <h4 className="mt-2 font-display text-2xl">Rename the categories</h4>
      <p className="mt-2 text-sm text-ink-800/65 dark:text-cream-100/65">
        These labels appear on the filter chips in the Collection and the
        Lookbook, and in the dropdown when you add a new design. Renaming here
        does not move existing pieces - it just changes the label visitors see.
      </p>

      <div className="mt-6 space-y-3">
        {categories.map((c) => {
          const overridden = hasOverride(`category.label.${c}`);
          const draft = drafts[c] ?? c;
          return (
            <div
              key={c}
              className="flex flex-col gap-3 rounded-2xl border border-ink-800/10 p-4 sm:flex-row sm:items-center dark:border-cream-100/10"
            >
              <div className="min-w-0 sm:flex-1">
                <div className="text-[10px] uppercase tracking-[0.22em] text-ink-800/55 dark:text-cream-100/55">
                  Default name
                </div>
                <div className="break-words font-display text-base">{c}</div>
              </div>
              <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDrafts((p) => ({ ...p, [c]: e.target.value }))}
                  placeholder={c}
                  enterKeyHint="done"
                  className="w-full min-w-0 rounded-2xl border border-ink-800/15 bg-cream-50 px-4 py-3 text-base focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onSave(c)}
                    disabled={savingKey === c}
                    className="flex-1 rounded-full bg-bronze-500 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-cream-100 disabled:opacity-50 sm:flex-none"
                  >
                    {savingKey === c ? '...' : 'Save'}
                  </button>
                  {overridden && (
                    <button
                      type="button"
                      onClick={async () => {
                        await reset(`category.label.${c}`);
                        setDrafts((p) => ({ ...p, [c]: c }));
                      }}
                      className="rounded-full border border-ink-800/15 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-ink-800/70 hover:border-bronze-500 dark:border-cream-100/20 dark:text-cream-100/70"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================================
 * UnlockScreen - sign in / passcode entry.
 * ======================================================================= */

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
  onResetPassword: (email: string) => Promise<void>;
  onSwitchMode: (m: 'signin' | 'signup') => void;
  passcodeInput: string;
  onChangePasscode: (s: string) => void;
  onPasscodeSubmit: (e: React.FormEvent) => void;
  error: string | null;
  info: string | null;
  lockoutRemaining: number;
}

function UnlockScreen(p: UnlockScreenProps) {
  // Local UI state - only relevant inside the unlock screen.
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  const [showPasscode, setShowPasscode] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetMsg, setResetMsg] = useState<string | null>(null);
  const [resetErr, setResetErr] = useState<string | null>(null);

  const handleForgotPassword = async () => {
    setResetMsg(null);
    setResetErr(null);
    if (!p.authEmail.trim()) {
      setResetErr('Type your admin email above first, then tap "Forgot password" again.');
      return;
    }
    setResetting(true);
    try {
      await p.onResetPassword(p.authEmail);
      setResetMsg(
        `A password-reset link is on its way to ${p.authEmail.trim()}. Open it on this phone, then come back and sign in with the new password.`
      );
    } catch (err) {
      setResetErr((err as Error).message ?? 'Could not send the reset email. Try again in a moment.');
    } finally {
      setResetting(false);
    }
  };

  if (p.cloudReady) {
    return (
      <div className="flex h-full flex-col overflow-y-auto p-6 pt-[max(env(safe-area-inset-top,0),2rem)] sm:p-10 md:p-12">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-bronze-400/20 text-bronze-500">
          <ShieldCheck size={20} />
        </div>
        <h3 className="mt-5 font-display text-2xl leading-tight sm:text-4xl">
          {p.authMode === 'signin' ? 'Atelier sign in' : 'Create your atelier account'}
        </h3>
        <p className="mt-2 text-sm text-ink-800/65 dark:text-cream-100/65">
          {p.authMode === 'signin'
            ? 'Sign in with the atelier admin email to manage your collection.'
            : 'First time? Create the atelier account using your registered admin email.'}
        </p>

        <form onSubmit={p.onAuthSubmit} className="mt-6 space-y-3">
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-[0.22em] text-ink-800/70 dark:text-cream-100/70">
              Email
            </label>
            <input
              type="email"
              autoFocus
              value={p.authEmail}
              onChange={(e) => p.onChangeEmail(e.target.value)}
              placeholder="chukwufaithhappiness1@gmail.com"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              className="w-full rounded-2xl border border-ink-800/15 bg-cream-50 px-4 py-3.5 text-base focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-[0.22em] text-ink-800/70 dark:text-cream-100/70">
              Password
            </label>
            <div className="relative">
              <input
                type={showAuthPassword ? 'text' : 'password'}
                value={p.authPassword}
                onChange={(e) => p.onChangePassword(e.target.value)}
                placeholder={showAuthPassword ? 'Your password' : '*********'}
                autoComplete={p.authMode === 'signin' ? 'current-password' : 'new-password'}
                className="w-full rounded-2xl border border-ink-800/15 bg-cream-50 px-4 py-3.5 pr-12 text-base focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowAuthPassword((s) => !s)}
                aria-label={showAuthPassword ? 'Hide password' : 'Show password'}
                title={showAuthPassword ? 'Hide password' : 'Show password'}
                className="absolute right-1.5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-ink-800/55 transition-colors hover:bg-bronze-500/10 hover:text-bronze-500 active:scale-95 dark:text-cream-100/55"
              >
                {showAuthPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {p.authMode === 'signin' && (
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={resetting}
                className="mt-2 text-xs font-medium text-bronze-500 transition-colors hover:underline disabled:opacity-50"
              >
                {resetting ? 'Sending reset link...' : 'Forgot password?'}
              </button>
            )}
          </div>

          {resetMsg && (
            <p className="rounded-2xl border border-[#25D366]/30 bg-[#25D366]/10 p-3 text-sm text-[#1da851]">
              {resetMsg}
            </p>
          )}
          {resetErr && (
            <p className="rounded-2xl border border-wine-500/30 bg-wine-500/10 p-3 text-sm text-wine-500">
              {resetErr}
            </p>
          )}
          {p.error && (
            <p className="rounded-2xl border border-wine-500/30 bg-wine-500/10 p-3 text-sm text-wine-500">
              {p.error}
            </p>
          )}
          {p.info && (
            <p className="rounded-2xl border border-[#25D366]/30 bg-[#25D366]/10 p-3 text-sm text-[#1da851]">
              {p.info}
            </p>
          )}

          <button
            type="submit"
            disabled={p.authBusy || p.authLoading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {p.authBusy
              ? 'Working...'
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
    <div className="flex h-full flex-col overflow-y-auto p-6 pt-[max(env(safe-area-inset-top,0),2rem)] sm:p-10 md:p-12">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-bronze-400/20 text-bronze-500">
        <Lock size={20} />
      </div>
      <h3 className="mt-5 font-display text-2xl leading-tight sm:text-4xl">Atelier access</h3>
      <p className="mt-2 text-sm text-ink-800/65 dark:text-cream-100/65">
        Enter the studio passcode to manage your collection.
      </p>
      <form onSubmit={p.onPasscodeSubmit} className="mt-6 flex flex-col gap-3">
        <div className="relative">
          <input
            type={showPasscode ? 'text' : 'password'}
            autoFocus
            value={p.passcodeInput}
            onChange={(e) => p.onChangePasscode(e.target.value)}
            placeholder="Passcode"
            autoComplete="current-password"
            className="w-full rounded-2xl border border-ink-800/15 bg-cream-50 px-4 py-3.5 pr-12 text-base focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900"
            disabled={p.lockoutRemaining > 0}
          />
          <button
            type="button"
            onClick={() => setShowPasscode((s) => !s)}
            aria-label={showPasscode ? 'Hide passcode' : 'Show passcode'}
            title={showPasscode ? 'Hide passcode' : 'Show passcode'}
            className="absolute right-1.5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-ink-800/55 transition-colors hover:bg-bronze-500/10 hover:text-bronze-500 active:scale-95 dark:text-cream-100/55"
          >
            {showPasscode ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <button type="submit" className="btn-primary w-full" disabled={p.lockoutRemaining > 0}>
          Unlock
        </button>
      </form>
      {p.error && (
        <p className="mt-3 rounded-2xl border border-wine-500/30 bg-wine-500/10 p-3 text-sm text-wine-500">
          {p.error}
        </p>
      )}
      <p className="mt-6 rounded-2xl bg-bronze-400/10 p-4 text-xs text-ink-800/70 dark:text-cream-100/70">
        <span className="font-medium text-bronze-500">Local-only mode.</span> Designs you add
        live on this device only. To make them sync to every visitor in real time, set up
        cloud sync - see <code>SUPABASE_SETUP.md</code>.
      </p>
    </div>
  );
}

/* =========================================================================
 * Tab button + cloud status pill.
 * ======================================================================= */

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
      className={`-mb-px flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-3 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors sm:gap-2 sm:px-4 sm:text-xs ${
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
      <div className="flex items-center gap-1.5 rounded-full border border-[#25D366]/30 bg-[#25D366]/10 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-[#1da851]">
        <Cloud size={11} />
        <span className="hidden sm:inline">{loading ? 'Syncing...' : 'Live sync'}</span>
        <span className="sm:hidden">{loading ? 'Sync' : 'Live'}</span>
      </div>
    );
  }
  return (
    <div
      className="flex items-center gap-1.5 rounded-full border border-ink-800/20 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-ink-800/60 dark:border-cream-100/20 dark:text-cream-100/60"
      title="Designs are saved on this device only. Set up Supabase to sync everywhere."
    >
      <CloudOff size={11} />
      <span className="hidden sm:inline">Local only</span>
      <span className="sm:hidden">Local</span>
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
