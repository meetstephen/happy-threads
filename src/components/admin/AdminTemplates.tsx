import { useState } from 'react';
import { Check, Copy, Plus, Trash2 } from 'lucide-react';

interface Template { id: string; name: string; message: string; category: string; }

const LS_KEY = 'happy-threads-wa-templates';
const DEFAULT_TEMPLATES: Template[] = [
  { id: 'def-1', name: 'Greeting', message: 'Hello! Thank you for reaching out to Happiness Fashion World. How can I help you today? Are you looking for something special?', category: 'greeting' },
  { id: 'def-2', name: 'Booking Confirm', message: 'Your fitting appointment is confirmed for [DATE] at [TIME]. Please come with your preferred fabric if you have one. Looking forward to seeing you!', category: 'booking-confirm' },
  { id: 'def-3', name: 'Measurement Request', message: 'To get started on your piece, I will need your measurements: Bust, Waist, Hips, Shoulder width, Arm length, and your desired length. You can send a voice note or type them out!', category: 'followup' },
  { id: 'def-4', name: 'Order Ready', message: 'Great news! Your [ITEM] is ready for pickup/delivery. It came out beautifully! When would you like to collect it, or shall I arrange delivery?', category: 'custom' },
];

function loadTemplates(): Template[] {
  try { const raw = localStorage.getItem(LS_KEY); return raw ? JSON.parse(raw) : DEFAULT_TEMPLATES; } catch { return DEFAULT_TEMPLATES; }
}
function saveTemplates(list: Template[]) { try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch {} }

export default function AdminTemplates() {
  const [templates, setTemplates] = useState<Template[]>(loadTemplates);
  const [copied, setCopied] = useState<string | null>(null);
  const [newT, setNewT] = useState({ name: '', message: '', category: 'custom' });
  const [info, setInfo] = useState<string | null>(null);

  const copyMsg = async (id: string, msg: string) => {
    try { await navigator.clipboard.writeText(msg); setCopied(id); setTimeout(() => setCopied(null), 1500); } catch {}
  };

  const add = () => {
    if (!newT.name.trim() || !newT.message.trim()) return;
    const t: Template = { id: Date.now().toString(36), ...newT };
    const updated = [...templates, t]; setTemplates(updated); saveTemplates(updated);
    setNewT({ name: '', message: '', category: 'custom' });
    setInfo('Template added.'); setTimeout(() => setInfo(null), 2000);
  };

  const remove = (id: string) => {
    const updated = templates.filter(t => t.id !== id); setTemplates(updated); saveTemplates(updated);
  };

  return (
    <div>
      <p className="eyebrow">WhatsApp</p>
      <h3 className="mt-2 font-display text-2xl">Message Templates</h3>
      <p className="mt-2 text-sm text-ink-800/65 dark:text-cream-100/65">Quick-copy templates for WhatsApp replies.</p>

      {info && <p className="mt-4 rounded-2xl border border-[#25D366]/30 bg-[#25D366]/10 p-3 text-sm text-[#1da851]">{info}</p>}

      <div className="mt-6 space-y-3">
        {templates.map(t => (
          <div key={t.id} className="rounded-2xl border border-ink-800/10 p-4 dark:border-cream-100/10">
            <div className="flex items-start justify-between gap-2">
              <div><div className="font-medium">{t.name}</div><div className="text-[10px] uppercase tracking-[0.2em] text-ink-800/50 dark:text-cream-100/50">{t.category}</div></div>
              <div className="flex gap-1.5">
                <button type="button" onClick={() => copyMsg(t.id, t.message)} className={`grid h-9 w-9 place-items-center rounded-full transition-colors ${copied === t.id ? 'bg-[#25D366] text-cream-100' : 'border border-ink-800/15 text-ink-800/60 hover:border-bronze-500 hover:text-bronze-500 dark:border-cream-100/20 dark:text-cream-100/60'}`}>{copied === t.id ? <Check size={14} /> : <Copy size={14} />}</button>
                <button type="button" onClick={() => remove(t.id)} className="grid h-9 w-9 place-items-center rounded-full text-wine-500/60 hover:bg-wine-500/10 hover:text-wine-500"><Trash2 size={14} /></button>
              </div>
            </div>
            <p className="mt-2 text-sm text-ink-800/70 dark:text-cream-100/70">{t.message}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-2 rounded-2xl border border-dashed border-ink-800/20 p-4 dark:border-cream-100/20">
        <input type="text" value={newT.name} onChange={e => setNewT(p => ({...p, name: e.target.value}))} placeholder="Template name" className="w-full rounded-xl border border-ink-800/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" />
        <select value={newT.category} onChange={e => setNewT(p => ({...p, category: e.target.value}))} className="w-full rounded-xl border border-ink-800/15 bg-cream-50 px-3 py-2.5 text-sm dark:border-cream-100/20 dark:bg-ink-900"><option value="greeting">Greeting</option><option value="followup">Follow-up</option><option value="booking-confirm">Booking confirm</option><option value="custom">Custom</option></select>
        <textarea rows={3} value={newT.message} onChange={e => setNewT(p => ({...p, message: e.target.value}))} placeholder="Message text..." className="w-full rounded-xl border border-ink-800/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" />
        <button type="button" onClick={add} className="btn-primary"><Plus size={14} /> Add template</button>
      </div>
    </div>
  );
}
