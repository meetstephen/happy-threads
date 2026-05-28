import { useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';

interface CustomTestimonial { id: string; name: string; role: string; quote: string; }

const HARDCODED_IDS = ['t1', 't2', 't3', 't4'];
const LS_KEY = 'happy-threads-custom-testimonials';

function loadCustom(): CustomTestimonial[] {
  try { const raw = localStorage.getItem(LS_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}
function saveCustom(list: CustomTestimonial[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch {}
}

export default function AdminTestimonials() {
  const { get, set } = useSiteContent();
  const [customs, setCustoms] = useState<CustomTestimonial[]>(loadCustom);
  const [info, setInfo] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, {name:string;role:string;quote:string}>>(() => {
    const m: Record<string, {name:string;role:string;quote:string}> = {};
    HARDCODED_IDS.forEach(id => { m[id] = { name: get(`testimonial.${id}.name`, ''), role: get(`testimonial.${id}.role`, ''), quote: get(`testimonial.${id}.quote`, '') }; });
    return m;
  });
  const [newT, setNewT] = useState({ name: '', role: '', quote: '' });

  const saveHardcoded = async (id: string) => {
    const d = drafts[id]; if (!d) return;
    if (d.name.trim()) await set(`testimonial.${id}.name`, d.name.trim());
    if (d.role.trim()) await set(`testimonial.${id}.role`, d.role.trim());
    if (d.quote.trim()) await set(`testimonial.${id}.quote`, d.quote.trim());
    setInfo('Saved.'); setTimeout(() => setInfo(null), 2000);
  };

  const addCustom = () => {
    if (!newT.name.trim() || !newT.quote.trim()) return;
    const next: CustomTestimonial = { id: Date.now().toString(36), name: newT.name.trim(), role: newT.role.trim(), quote: newT.quote.trim() };
    const updated = [...customs, next]; setCustoms(updated); saveCustom(updated);
    setNewT({ name: '', role: '', quote: '' });
    setInfo('Testimonial added.'); setTimeout(() => setInfo(null), 2000);
  };

  const removeCustom = (id: string) => {
    const updated = customs.filter(c => c.id !== id); setCustoms(updated); saveCustom(updated);
  };

  return (
    <div>
      <p className="eyebrow">Testimonials</p>
      <h3 className="mt-2 font-display text-2xl">Client Reviews</h3>
      <p className="mt-2 text-sm text-ink-800/65 dark:text-cream-100/65">Edit existing testimonials or add new ones.</p>

      {info && <p className="mt-4 rounded-2xl border border-[#25D366]/30 bg-[#25D366]/10 p-3 text-sm text-[#1da851]">{info}</p>}

      {/* Existing 4 */}
      <div className="mt-6 space-y-4">
        <h4 className="font-display text-lg">Default Testimonials</h4>
        {HARDCODED_IDS.map(id => (
          <div key={id} className="space-y-2 rounded-2xl border border-ink-800/10 p-4 dark:border-cream-100/10">
            <input type="text" value={drafts[id]?.name ?? ''} onChange={e => setDrafts(prev => ({...prev, [id]: {...prev[id], name: e.target.value}}))} placeholder="Name" className="w-full rounded-xl border border-ink-800/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" />
            <input type="text" value={drafts[id]?.role ?? ''} onChange={e => setDrafts(prev => ({...prev, [id]: {...prev[id], role: e.target.value}}))} placeholder="Role" className="w-full rounded-xl border border-ink-800/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" />
            <textarea rows={2} value={drafts[id]?.quote ?? ''} onChange={e => setDrafts(prev => ({...prev, [id]: {...prev[id], quote: e.target.value}}))} placeholder="Quote" className="w-full rounded-xl border border-ink-800/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" />
            <button type="button" onClick={() => saveHardcoded(id)} className="inline-flex items-center gap-1.5 rounded-full bg-bronze-500 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-cream-100"><Save size={11} /> Save</button>
          </div>
        ))}
      </div>

      {/* Custom */}
      <div className="mt-8 space-y-4">
        <h4 className="font-display text-lg">Custom Testimonials</h4>
        {customs.map(c => (
          <div key={c.id} className="flex items-start gap-3 rounded-2xl border border-ink-800/10 p-4 dark:border-cream-100/10">
            <div className="min-w-0 flex-1">
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-ink-800/55 dark:text-cream-100/55">{c.role}</div>
              <div className="mt-1 text-sm">{c.quote}</div>
            </div>
            <button type="button" onClick={() => removeCustom(c.id)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-wine-500 hover:bg-wine-500/10"><Trash2 size={14} /></button>
          </div>
        ))}

        <div className="space-y-2 rounded-2xl border border-dashed border-ink-800/20 p-4 dark:border-cream-100/20">
          <input type="text" value={newT.name} onChange={e => setNewT(prev => ({...prev, name: e.target.value}))} placeholder="Client name" className="w-full rounded-xl border border-ink-800/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" />
          <input type="text" value={newT.role} onChange={e => setNewT(prev => ({...prev, role: e.target.value}))} placeholder="Role (e.g. Bride, Fashion lover)" className="w-full rounded-xl border border-ink-800/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" />
          <textarea rows={2} value={newT.quote} onChange={e => setNewT(prev => ({...prev, quote: e.target.value}))} placeholder="Their words..." className="w-full rounded-xl border border-ink-800/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" />
          <button type="button" onClick={addCustom} className="btn-primary"><Plus size={14} /> Add testimonial</button>
        </div>
      </div>
    </div>
  );
}
