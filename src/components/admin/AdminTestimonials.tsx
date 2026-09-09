import { useEffect, useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';
import { defaultTestimonials } from '../Testimonials';
import { CUSTOM_TESTIMONIALS_KEY, parseCustomTestimonials } from '../../data/testimonials';

interface CustomTestimonial { id: string; name: string; role: string; quote: string; }
const LEGACY_LOCAL_KEY = 'happy-threads-custom-testimonials';

function customRows(value: string): CustomTestimonial[] {
  return parseCustomTestimonials(value).map(item => ({
    id: item.key.replace(/^custom-/, ''), name: item.name, role: item.role, quote: item.quote,
  }));
}

export default function AdminTestimonials() {
  const { get, set, reset } = useSiteContent();
  const [customs, setCustoms] = useState<CustomTestimonial[]>(() => customRows(get(CUSTOM_TESTIMONIALS_KEY, '[]')));
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [drafts, setDrafts] = useState(() => Object.fromEntries(defaultTestimonials.map(t => [t.key, {
    name: get(`testimonial.${t.key}.name`, t.name),
    role: get(`testimonial.${t.key}.role`, t.role),
    quote: get(`testimonial.${t.key}.quote`, t.quote),
  }])));
  const [newT, setNewT] = useState({ name: '', role: '', quote: '' });

  useEffect(() => {
    if (customs.length) return;
    try {
      const legacy = localStorage.getItem(LEGACY_LOCAL_KEY);
      if (!legacy) return;
      const parsed = JSON.parse(legacy) as CustomTestimonial[];
      if (!Array.isArray(parsed) || !parsed.length) return;
      void set(CUSTOM_TESTIMONIALS_KEY, JSON.stringify(parsed)).then(() => {
        setCustoms(customRows(JSON.stringify(parsed)));
        localStorage.removeItem(LEGACY_LOCAL_KEY);
      });
    } catch { /* Ignore malformed legacy data. */ }
  }, [customs.length, set]);

  const flash = (message: string) => { setInfo(message); setTimeout(() => setInfo(null), 2200); };

  const saveHardcoded = async (id: string) => {
    const draft = drafts[id];
    const defaults = defaultTestimonials.find(t => t.key === id);
    if (!draft || !defaults) return;
    setBusy(true); setError(null);
    try {
      for (const field of ['name', 'role', 'quote'] as const) {
        const value = draft[field].trim();
        if (!value) throw new Error('Name, role and quote cannot be empty.');
        const key = `testimonial.${id}.${field}`;
        if (value === defaults[field]) await reset(key); else await set(key, value);
      }
      flash('Testimonial saved.');
    } catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  };

  const saveCustoms = async (updated: CustomTestimonial[]) => {
    if (updated.length) await set(CUSTOM_TESTIMONIALS_KEY, JSON.stringify(updated));
    else await reset(CUSTOM_TESTIMONIALS_KEY);
    setCustoms(updated);
  };

  const addCustom = async () => {
    if (!newT.name.trim() || !newT.quote.trim()) { setError('Add the client name and their words.'); return; }
    setBusy(true); setError(null);
    try {
      const next = { id: crypto.randomUUID(), name: newT.name.trim(), role: newT.role.trim(), quote: newT.quote.trim() };
      await saveCustoms([...customs, next]);
      setNewT({ name: '', role: '', quote: '' });
      flash('Testimonial published.');
    } catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  };

  const removeCustom = async (id: string) => {
    if (!window.confirm('Remove this testimonial from the website?')) return;
    setBusy(true); setError(null);
    try { await saveCustoms(customs.filter(c => c.id !== id)); flash('Testimonial removed.'); }
    catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  };

  return (
    <div>
      <p className="eyebrow">Testimonials</p>
      <h3 className="mt-2 font-display text-2xl">Client Reviews</h3>
      <p className="mt-2 text-sm text-ink-800/65 dark:text-cream-100/65">Edit every review or publish a new one. Changes sync to the live site.</p>
      {error && <p className="mt-4 rounded-2xl border border-wine-500/30 bg-wine-500/10 p-3 text-sm text-wine-500">{error}</p>}
      {info && <p className="mt-4 rounded-2xl border border-[#25D366]/30 bg-[#25D366]/10 p-3 text-sm text-[#1da851]">{info}</p>}

      <div className="mt-6 space-y-4">
        <h4 className="font-display text-lg">Website Testimonials</h4>
        {defaultTestimonials.map(({ key }) => (
          <div key={key} className="space-y-2 rounded-2xl border border-ink-800/10 p-4 dark:border-cream-100/10">
            <input type="text" value={drafts[key]?.name ?? ''} onChange={e => setDrafts(prev => ({...prev, [key]: {...prev[key], name: e.target.value}}))} placeholder="Name" className="w-full rounded-xl border border-ink-800/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" />
            <input type="text" value={drafts[key]?.role ?? ''} onChange={e => setDrafts(prev => ({...prev, [key]: {...prev[key], role: e.target.value}}))} placeholder="Role" className="w-full rounded-xl border border-ink-800/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" />
            <textarea rows={3} value={drafts[key]?.quote ?? ''} onChange={e => setDrafts(prev => ({...prev, [key]: {...prev[key], quote: e.target.value}}))} placeholder="Quote" className="w-full rounded-xl border border-ink-800/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" />
            <button type="button" disabled={busy} onClick={() => saveHardcoded(key)} className="inline-flex items-center gap-1.5 rounded-full bg-bronze-500 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-cream-100 disabled:opacity-50"><Save size={11} /> Save</button>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        <h4 className="font-display text-lg">Added Testimonials</h4>
        {customs.length === 0 && <p className="text-sm text-ink-800/55 dark:text-cream-100/55">No additional reviews yet.</p>}
        {customs.map(c => (
          <div key={c.id} className="flex items-start gap-3 rounded-2xl border border-ink-800/10 p-4 dark:border-cream-100/10">
            <div className="min-w-0 flex-1"><div className="font-medium">{c.name}</div><div className="text-xs text-ink-800/55 dark:text-cream-100/55">{c.role}</div><div className="mt-1 text-sm">{c.quote}</div></div>
            <button type="button" aria-label={`Remove ${c.name}`} disabled={busy} onClick={() => removeCustom(c.id)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-wine-500 hover:bg-wine-500/10 disabled:opacity-50"><Trash2 size={14} /></button>
          </div>
        ))}
        <div className="space-y-2 rounded-2xl border border-dashed border-ink-800/20 p-4 dark:border-cream-100/20">
          <input type="text" maxLength={100} value={newT.name} onChange={e => setNewT(prev => ({...prev, name: e.target.value}))} placeholder="Client name" className="w-full rounded-xl border border-ink-800/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" />
          <input type="text" maxLength={120} value={newT.role} onChange={e => setNewT(prev => ({...prev, role: e.target.value}))} placeholder="Role (e.g. Bride, Fashion lover)" className="w-full rounded-xl border border-ink-800/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" />
          <textarea rows={3} maxLength={600} value={newT.quote} onChange={e => setNewT(prev => ({...prev, quote: e.target.value}))} placeholder="Their words..." className="w-full rounded-xl border border-ink-800/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" />
          <button type="button" disabled={busy} onClick={addCustom} className="btn-primary disabled:opacity-50"><Plus size={14} /> Add testimonial</button>
        </div>
      </div>
    </div>
  );
}
