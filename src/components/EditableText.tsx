import { useRef, useState } from 'react';
import { Check, Pencil, RotateCcw, X } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { useAdminAuth } from '../lib/auth';
import { sanitizeText } from '../utils/sanitize';

interface Props {
  /** Unique key for this editable piece of content. */
  contentKey: string;
  /** Default (hardcoded) text — what shows when no override exists. */
  defaultValue: string;
  /** Render function — receives the current text value and returns JSX. */
  children: (text: string) => React.ReactNode;
  /** If true, the edit field is a textarea (multi-line). Default: false. */
  multiline?: boolean;
}

/**
 * Wraps any text on the site and makes it editable for the admin.
 *
 * For visitors: renders children(text) with no extra markup.
 * For the signed-in admin: adds a subtle pencil icon that opens an
 * inline editor overlay.
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
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  const currentValue = get(contentKey, defaultValue);

  const startEdit = () => {
    setDraft(currentValue);
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const save = async () => {
    const trimmed = sanitizeText(draft.trim());
    if (trimmed && trimmed !== defaultValue) {
      await set(contentKey, trimmed);
    } else if (!trimmed || trimmed === defaultValue) {
      await reset(contentKey);
    }
    setEditing(false);
  };

  const cancel = () => setEditing(false);

  const revert = async () => {
    await reset(contentKey);
    setEditing(false);
  };

  // Visitors — just render the content
  if (!admin) return <>{children(currentValue)}</>;

  // Admin — render content + edit controls
  return (
    <span className="group/editable relative inline">
      {!editing ? (
        <>
          {children(currentValue)}
          <button
            type="button"
            onClick={startEdit}
            className="ml-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-bronze-500/90 text-cream-100 opacity-0 shadow-sm transition-opacity group-hover/editable:opacity-100"
            title="Edit this text"
            aria-label={`Edit ${contentKey}`}
          >
            <Pencil size={11} />
          </button>
        </>
      ) : (
        <span className="inline-flex w-full flex-col gap-2 rounded-xl border border-bronze-500 bg-cream-50 p-3 shadow-soft dark:bg-ink-800">
          {multiline ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={4}
              className="w-full resize-y rounded-lg border border-ink-800/10 bg-cream-100 px-3 py-2 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/10 dark:bg-ink-900"
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="w-full rounded-lg border border-ink-800/10 bg-cream-100 px-3 py-2 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/10 dark:bg-ink-900"
              onKeyDown={(e) => {
                if (e.key === 'Enter') save();
                if (e.key === 'Escape') cancel();
              }}
            />
          )}
          <span className="flex items-center gap-2">
            <button
              type="button"
              onClick={save}
              className="inline-flex items-center gap-1 rounded-full bg-bronze-500 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-cream-100"
            >
              <Check size={10} /> Save
            </button>
            <button
              type="button"
              onClick={cancel}
              className="inline-flex items-center gap-1 rounded-full border border-ink-800/20 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-ink-800/70 dark:border-cream-100/20 dark:text-cream-100/70"
            >
              <X size={10} /> Cancel
            </button>
            {hasOverride(contentKey) && (
              <button
                type="button"
                onClick={revert}
                className="inline-flex items-center gap-1 rounded-full border border-wine-500/30 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-wine-500"
                title="Revert to the original default text"
              >
                <RotateCcw size={10} /> Reset
              </button>
            )}
          </span>
        </span>
      )}
    </span>
  );
}
