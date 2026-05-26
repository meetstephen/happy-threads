import { useEffect, useRef, useState } from 'react';
import { Check, Pencil, RotateCcw, X } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { useAdminAuth } from '../lib/auth';
import { sanitizeText } from '../utils/sanitize';

interface Props {
  /** Unique key for this editable piece of content. */
  contentKey: string;
  /** Default (hardcoded) text - what shows when no override exists. */
  defaultValue: string;
  /** Render function - receives the current text value and returns JSX. */
  children: (text: string) => React.ReactNode;
  /** If true, the edit field is a textarea (multi-line). Default: false. */
  multiline?: boolean;
}

/**
 * Wraps any text on the site and makes it editable for the admin.
 *
 * For visitors: renders children(text) with no extra markup.
 * For the signed-in admin: adds a small ALWAYS-VISIBLE pencil chip that
 * opens an inline editor overlay. Tapping the chip triggers an editor
 * sheet sized for phone use (16px font input/textarea, large tap targets,
 * mobile keyboard hints).
 *
 * Critical mobile fix: the pencil chip is no longer hidden behind a
 * `group-hover` opacity rule (which never reveals on touch devices).
 */
export default function EditableText({
  contentKey,
  defaultValue,
  children,
  multiline = false,
}: Props) {
  const { get, set, reset, hasOverride } = useSiteContent();
  const { admin } = useAdminAuth();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  const currentValue = get(contentKey, defaultValue);

  // Auto-grow textarea height to content (so the admin can see what she's typing)
  useEffect(() => {
    if (!editing || !multiline) return;
    const el = inputRef.current;
    if (el && el instanceof HTMLTextAreaElement) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 360)}px`;
    }
  }, [editing, multiline, draft]);

  const startEdit = () => {
    setDraft(currentValue);
    setErrorMsg(null);
    setEditing(true);
    // Wait for the input to render then focus + select-all so admin can
    // immediately start typing or replace existing text.
    setTimeout(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      try {
        if (el instanceof HTMLInputElement) el.select();
        else if (el instanceof HTMLTextAreaElement) {
          el.selectionStart = 0;
          el.selectionEnd = el.value.length;
        }
      } catch {
        /* ignore */
      }
    }, 60);
  };

  const save = async () => {
    if (saving) return;
    setSaving(true);
    setErrorMsg(null);
    try {
      const trimmed = sanitizeText(draft.trim());
      if (trimmed && trimmed !== defaultValue) {
        await set(contentKey, trimmed);
      } else if (!trimmed || trimmed === defaultValue) {
        await reset(contentKey);
      }
      setEditing(false);
    } catch (err) {
      setErrorMsg((err as Error).message ?? 'Could not save. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    setEditing(false);
    setErrorMsg(null);
  };

  const revert = async () => {
    if (saving) return;
    setSaving(true);
    setErrorMsg(null);
    try {
      await reset(contentKey);
      setEditing(false);
    } catch (err) {
      setErrorMsg((err as Error).message ?? 'Could not reset. Try again.');
    } finally {
      setSaving(false);
    }
  };

  // Visitors - just render the content
  if (!admin) return <>{children(currentValue)}</>;

  // Admin - render content + ALWAYS-VISIBLE edit chip
  return (
    <span className="relative inline align-baseline">
      {!editing ? (
        <>
          {children(currentValue)}
          <button
            type="button"
            onClick={startEdit}
            className="ml-1.5 inline-flex h-10 w-10 shrink-0 translate-y-[-1px] items-center justify-center rounded-full bg-bronze-500/95 text-cream-100 align-middle shadow-soft ring-1 ring-bronze-500/20 transition-all hover:bg-bronze-600 active:scale-90 sm:h-7 sm:w-7"
            title="Edit this text"
            aria-label={`Edit ${contentKey}`}
          >
            <Pencil size={12} />
          </button>
        </>
      ) : (
        <span className="block w-full max-w-full rounded-2xl border border-bronze-500 bg-cream-50 p-3 align-baseline shadow-soft dark:bg-ink-800">
          {multiline ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              enterKeyHint="enter"
              autoCapitalize="sentences"
              autoCorrect="on"
              spellCheck="true"
              className="block w-full resize-y rounded-xl border border-ink-800/10 bg-cream-100 px-3 py-2.5 text-base leading-snug focus:border-bronze-500 focus:outline-none dark:border-cream-100/10 dark:bg-ink-900"
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              enterKeyHint="done"
              autoCapitalize="sentences"
              autoCorrect="on"
              spellCheck="true"
              className="block w-full rounded-xl border border-ink-800/10 bg-cream-100 px-3 py-2.5 text-base focus:border-bronze-500 focus:outline-none dark:border-cream-100/10 dark:bg-ink-900"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  save();
                }
                if (e.key === 'Escape') cancel();
              }}
            />
          )}
          {errorMsg && (
            <span className="mt-2 block rounded-lg bg-wine-500/10 px-3 py-2 text-[11px] text-wine-500">
              {errorMsg}
            </span>
          )}
          <span className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-1 rounded-full bg-bronze-500 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.15em] text-cream-100 disabled:opacity-50 active:scale-95"
            >
              <Check size={12} /> {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={cancel}
              disabled={saving}
              className="inline-flex items-center gap-1 rounded-full border border-ink-800/20 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.15em] text-ink-800/70 disabled:opacity-50 active:scale-95 dark:border-cream-100/20 dark:text-cream-100/70"
            >
              <X size={12} /> Cancel
            </button>
            {hasOverride(contentKey) && (
              <button
                type="button"
                onClick={revert}
                disabled={saving}
                className="inline-flex items-center gap-1 rounded-full border border-wine-500/30 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.15em] text-wine-500 disabled:opacity-50 active:scale-95"
                title="Revert to the original default text"
              >
                <RotateCcw size={12} /> Reset
              </button>
            )}
          </span>
        </span>
      )}
    </span>
  );
}
