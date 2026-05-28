import { useState } from 'react';
import { CalendarCheck, Plus, Trash2, Pencil, X } from 'lucide-react';

interface Booking { id: string; customerName: string; date: string; type: string; status: string; notes: string; }

const LS_KEY = 'happy-threads-bookings';
const TYPES = ['fitting', 'consultation', 'pickup', 'delivery'] as const;
const STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'] as const;

function load(): Booking[] { try { const r = localStorage.getItem(LS_KEY); return r ? JSON.parse(r) : []; } catch { return []; } }
function save(list: Booking[]) { try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch {} }

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>(load);
  const [filter, setFilter] = useState('all');
  const [editing, setEditing] = useState<Booking | null>(null);
  const [form, setForm] = useState<Omit<Booking, 'id'>>({ customerName: '', date: '', type: 'fitting', status: 'pending', notes: '' });

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const resetForm = () => { setForm({ customerName: '', date: '', type: 'fitting', status: 'pending', notes: '' }); setEditing(null); };

  const handleSave = () => {
    if (!form.customerName.trim()) return;
    let updated: Booking[];
    if (editing) { updated = bookings.map(b => b.id === editing.id ? { ...b, ...form } : b); }
    else { updated = [{ id: Date.now().toString(36), ...form }, ...bookings]; }
    setBookings(updated); save(updated); resetForm();
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this booking?')) return;
    const updated = bookings.filter(b => b.id !== id); setBookings(updated); save(updated);
  };

  const startEdit = (b: Booking) => { setEditing(b); setForm({ customerName: b.customerName, date: b.date, type: b.type, status: b.status, notes: b.notes }); };

  return (
    <div>
      <p className="eyebrow">Operations</p>
      <h3 className="mt-2 font-display text-2xl">Bookings</h3>
      <p className="mt-2 text-sm text-ink-800/65 dark:text-cream-100/65">Track fittings, consultations, and deliveries.</p>

      {/* Form */}
      <div className="mt-6 space-y-3 rounded-2xl border border-ink-800/10 p-4 dark:border-cream-100/10">
        <div className="flex items-center justify-between"><span className="text-sm font-medium">{editing ? 'Edit booking' : 'New booking'}</span>{editing && <button type="button" onClick={resetForm} className="text-xs text-ink-800/50 hover:text-wine-500 dark:text-cream-100/50"><X size={14} /></button>}</div>
        <input type="text" value={form.customerName} onChange={e => setForm(p => ({...p, customerName: e.target.value}))} placeholder="Customer name" className="w-full rounded-xl border border-ink-800/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" />
        <input type="date" value={form.date} onChange={e => setForm(p => ({...p, date: e.target.value}))} className="w-full rounded-xl border border-ink-800/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" />
        <div className="flex gap-2">
          <select value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value}))} className="flex-1 rounded-xl border border-ink-800/15 bg-cream-50 px-3 py-2.5 text-sm dark:border-cream-100/20 dark:bg-ink-900">{TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select>
          <select value={form.status} onChange={e => setForm(p => ({...p, status: e.target.value}))} className="flex-1 rounded-xl border border-ink-800/15 bg-cream-50 px-3 py-2.5 text-sm dark:border-cream-100/20 dark:bg-ink-900">{STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select>
        </div>
        <textarea rows={2} value={form.notes} onChange={e => setForm(p => ({...p, notes: e.target.value}))} placeholder="Notes..." className="w-full rounded-xl border border-ink-800/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" />
        <button type="button" onClick={handleSave} className="btn-primary">{editing ? <Pencil size={14} /> : <Plus size={14} />} {editing ? 'Update' : 'Add booking'}</button>
      </div>

      {/* Filter */}
      <div className="mt-6 flex gap-1.5 overflow-x-auto">
        {['all', ...STATUSES].map(s => <button key={s} type="button" onClick={() => setFilter(s)} className={`rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors ${filter === s ? 'bg-bronze-500 text-cream-100' : 'border border-ink-800/15 text-ink-800/60 hover:border-bronze-500 dark:border-cream-100/20 dark:text-cream-100/60'}`}>{s}</button>)}
      </div>

      {/* List */}
      <div className="mt-4 space-y-2">
        {filtered.sort((a, b) => b.date.localeCompare(a.date)).map(b => (
          <div key={b.id} className="flex items-start justify-between gap-3 rounded-2xl border border-ink-800/10 p-3 dark:border-cream-100/10">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2"><CalendarCheck size={13} className="shrink-0 text-bronze-500" /><span className="font-medium text-sm">{b.customerName}</span></div>
              <div className="mt-1 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-ink-800/55 dark:text-cream-100/55"><span>{b.date || 'No date'}</span><span>{b.type}</span><span className={`rounded-full px-1.5 py-0.5 ${b.status === 'confirmed' ? 'bg-[#25D366]/15 text-[#1da851]' : b.status === 'completed' ? 'bg-bronze-400/15 text-bronze-500' : b.status === 'cancelled' ? 'bg-wine-500/15 text-wine-500' : 'bg-ink-800/10 dark:bg-cream-100/10'}`}>{b.status}</span></div>
              {b.notes && <p className="mt-1 text-xs text-ink-800/60 dark:text-cream-100/60">{b.notes}</p>}
            </div>
            <div className="flex gap-1">
              <button type="button" onClick={() => startEdit(b)} className="grid h-8 w-8 place-items-center rounded-full text-ink-800/50 hover:text-bronze-500 dark:text-cream-100/50"><Pencil size={13} /></button>
              <button type="button" onClick={() => handleDelete(b.id)} className="grid h-8 w-8 place-items-center rounded-full text-ink-800/50 hover:text-wine-500 dark:text-cream-100/50"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="py-8 text-center text-sm text-ink-800/50 dark:text-cream-100/50">No bookings yet.</p>}
      </div>
    </div>
  );
}
