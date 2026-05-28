import { useState } from 'react';
import { Megaphone, Save } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';

export default function AdminAnnouncements() {
  const { get, set } = useSiteContent();
  const [enabled, setEnabled] = useState(get('announcement.enabled', 'false') === 'true');
  const [text, setText] = useState(get('announcement.text', ''));
  const [linkUrl, setLinkUrl] = useState(get('announcement.linkUrl', ''));
  const [linkText, setLinkText] = useState(get('announcement.linkText', ''));
  const [saving, setSaving] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    try {
      await set('announcement.enabled', enabled ? 'true' : 'false');
      await set('announcement.text', text.trim());
      await set('announcement.linkUrl', linkUrl.trim());
      await set('announcement.linkText', linkText.trim());
      setInfo('Announcement saved.'); setTimeout(() => setInfo(null), 2000);
    } finally { setSaving(false); }
  };

  return (
    <div>
      <p className="eyebrow">Announcements</p>
      <h3 className="mt-2 font-display text-2xl">Announcement Bar</h3>
      <p className="mt-2 text-sm text-ink-800/65 dark:text-cream-100/65">Show a banner above the navigation. Visitors can dismiss it per session.</p>

      {info && <p className="mt-4 rounded-2xl border border-[#25D366]/30 bg-[#25D366]/10 p-3 text-sm text-[#1da851]">{info}</p>}

      <div className="mt-6 space-y-4">
        {/* Enable toggle */}
        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-ink-800/15 bg-cream-50 px-4 py-3.5 dark:border-cream-100/20 dark:bg-ink-900">
          <span className="flex items-center gap-3"><Megaphone size={18} className={enabled ? 'text-bronze-500' : 'text-ink-800/40 dark:text-cream-100/40'} /><span className="font-medium">Show announcement bar</span></span>
          <span className={`relative inline-block h-6 w-11 rounded-full transition-colors ${enabled ? 'bg-bronze-500' : 'bg-ink-800/20 dark:bg-cream-100/20'}`}><input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} className="absolute inset-0 cursor-pointer opacity-0" /><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-cream-100 shadow transition-transform ${enabled ? 'translate-x-[22px]' : 'translate-x-0.5'}`} /></span>
        </label>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.22em] text-ink-800/70 dark:text-cream-100/70">Announcement text</label>
          <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder="e.g. Free delivery on orders above 50k this week!" className="w-full rounded-2xl border border-ink-800/15 bg-cream-50 px-4 py-3.5 text-base focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.22em] text-ink-800/70 dark:text-cream-100/70">Link URL (optional)</label>
          <input type="url" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://..." className="w-full rounded-2xl border border-ink-800/15 bg-cream-50 px-4 py-3.5 text-base focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.22em] text-ink-800/70 dark:text-cream-100/70">Link text (optional)</label>
          <input type="text" value={linkText} onChange={e => setLinkText(e.target.value)} placeholder="Learn more" className="w-full rounded-2xl border border-ink-800/15 bg-cream-50 px-4 py-3.5 text-base focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" />
        </div>

        <button type="button" onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50"><Save size={16} /> {saving ? 'Saving...' : 'Save announcement'}</button>
      </div>

      {/* Preview */}
      {enabled && text.trim() && (
        <div className="mt-6">
          <p className="eyebrow mb-2">Preview</p>
          <div className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-bronze-600 via-bronze-500 to-bronze-600 px-4 py-3 text-sm font-medium text-cream-100">
            <span>{text}</span>
            {linkUrl && linkText && <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{linkText}</a>}
          </div>
        </div>
      )}
    </div>
  );
}
