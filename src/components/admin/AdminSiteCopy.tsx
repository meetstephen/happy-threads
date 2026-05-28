import { useState } from 'react';
import { RotateCcw, Save } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';

interface CopyField {
  key: string;
  label: string;
  multiline?: boolean;
}

interface CopySection {
  title: string;
  fields: CopyField[];
}

const SECTIONS: CopySection[] = [
  {
    title: 'Hero',
    fields: [
      { key: 'hero.headline', label: 'Headline' },
      { key: 'hero.subtext', label: 'Subtext', multiline: true },
    ],
  },
  {
    title: 'About',
    fields: [
      { key: 'about.heading', label: 'Heading' },
      { key: 'about.body', label: 'Body text', multiline: true },
    ],
  },
  {
    title: 'Services',
    fields: [
      { key: 'services.heading', label: 'Heading' },
      { key: 'services.subtext', label: 'Subtext' },
    ],
  },
  {
    title: 'Craftsmanship',
    fields: [
      { key: 'craftsmanship.heading', label: 'Heading' },
      { key: 'craftsmanship.body', label: 'Body', multiline: true },
    ],
  },
  {
    title: 'Booking CTA',
    fields: [
      { key: 'booking.heading', label: 'Heading' },
      { key: 'booking.subtext', label: 'Subtext' },
    ],
  },
  {
    title: 'Contact',
    fields: [
      { key: 'contact.heading', label: 'Heading' },
      { key: 'contact.phone', label: 'Phone number' },
      { key: 'contact.address', label: 'Address' },
    ],
  },
];

export default function AdminSiteCopy() {
  const { get, set, reset, hasOverride } = useSiteContent();
  const [drafts, setDrafts] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const section of SECTIONS) {
      for (const field of section.fields) {
        initial[field.key] = get(field.key, '');
      }
    }
    return initial;
  });
  const [saving, setSaving] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleSave = async (key: string) => {
    const value = drafts[key]?.trim() ?? '';
    setSaving(key);
    try {
      if (!value) {
        await reset(key);
      } else {
        await set(key, value);
      }
      setInfo(`Saved "${key}"`);
      setTimeout(() => setInfo(null), 2000);
    } finally {
      setSaving(null);
    }
  };

  const handleReset = async (key: string) => {
    await reset(key);
    setDrafts((prev) => ({ ...prev, [key]: '' }));
    setInfo(`Reset "${key}" to default`);
    setTimeout(() => setInfo(null), 2000);
  };

  return (
    <div>
      <p className="eyebrow">Site Copy</p>
      <h3 className="mt-2 font-display text-2xl">Text Content Editor</h3>
      <p className="mt-2 text-sm text-ink-800/65 dark:text-cream-100/65">
        Edit any text on the site. Changes are live instantly. Leave a field blank and save to reset to default.
      </p>

      {info && (
        <p className="mt-4 rounded-2xl border border-[#25D366]/30 bg-[#25D366]/10 p-3 text-sm text-[#1da851]">
          {info}
        </p>
      )}

      <div className="mt-6 space-y-8">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h4 className="mb-3 font-display text-lg">{section.title}</h4>
            <div className="space-y-3">
              {section.fields.map((field) => {
                const overridden = hasOverride(field.key);
                return (
                  <div
                    key={field.key}
                    className="rounded-2xl border border-ink-800/10 p-4 dark:border-cream-100/10"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-xs font-medium uppercase tracking-[0.22em] text-ink-800/70 dark:text-cream-100/70">
                        {field.label}
                      </label>
                      {overridden && (
                        <span className="rounded-full bg-bronze-400/15 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.2em] text-bronze-500">
                          Custom
                        </span>
                      )}
                    </div>
                    {field.multiline ? (
                      <textarea
                        rows={3}
                        value={drafts[field.key] ?? ''}
                        onChange={(e) => setDrafts((prev) => ({ ...prev, [field.key]: e.target.value }))}
                        placeholder="(using default)"
                        className="w-full rounded-xl border border-ink-800/15 bg-cream-50 px-4 py-3 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900"
                      />
                    ) : (
                      <input
                        type="text"
                        value={drafts[field.key] ?? ''}
                        onChange={(e) => setDrafts((prev) => ({ ...prev, [field.key]: e.target.value }))}
                        placeholder="(using default)"
                        className="w-full rounded-xl border border-ink-800/15 bg-cream-50 px-4 py-3 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900"
                      />
                    )}
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleSave(field.key)}
                        disabled={saving === field.key}
                        className="inline-flex items-center gap-1.5 rounded-full bg-bronze-500 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-cream-100 disabled:opacity-50"
                      >
                        <Save size={11} />
                        {saving === field.key ? '...' : 'Save'}
                      </button>
                      {overridden && (
                        <button
                          type="button"
                          onClick={() => handleReset(field.key)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-ink-800/15 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-ink-800/70 hover:border-bronze-500 dark:border-cream-100/20 dark:text-cream-100/70"
                        >
                          <RotateCcw size={11} />
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
