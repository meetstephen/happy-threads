import { useState } from 'react';
import { Pencil, Plus, Search, Trash2, Users, X } from 'lucide-react';

interface Customer { id: string; name: string; phone: string; email: string; measurements: string; notes: string; createdAt: string; }

const LS_KEY = 'happy-threads-customers';
function load(): Customer[] { try { const r = localStorage.getItem(LS_KEY); return r ? JSON.parse(r) : []; } catch { return []; } }
function save(list: Customer[]) { try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch {} }

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>(load);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState<Omit<Customer, 'id' | 'createdAt'>>({ name: '', phone: '', email: '', measurements: '', notes: '' });

  const filtered = search ? customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase())) : customers;

  const resetForm = () => { setForm({ name: '', phone: '', email: '', measurements: '', notes: '' }); setEditing(null); };

  const handleSave = () => {
    if (!form.name.trim()) return;
    let updated: Customer[];
    if (editing) { updated = customers.map(c => c.id === editing.id ? { ...c, ...form } : c); }
    else { updated = [{ id: Date.now().toString(36), createdAt: new Date().toISOString(), ...form }, ...customers]; }
    setCustomers(updated); save(updated); resetForm();
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this customer?')) return;
    const updated = customers.filter(c => c.id !== id); setCustomers(updated); save(updated);
  };

  const startEdit = (c: Customer) => { setEditing(c); setForm({ name: c.name, phone: c.phone, email: c.email, measurements: c.measurements, notes: c.notes }); };

  return (
    <div>
      <p className="eyebrow">Operations</p>
      <h3 className="mt-2 font-display text-2xl">Customers</h3>
      <p className="mt-2 text-sm text-ink-800/65 dark:text-cream-100/65">Client directory with measurements and notes.</p>

      {/* Form */}
      <div className="mt-6 space-y-3 rounded-2xl border border-ink-800/10 p-4 dark:border-cream-100/10">
        <div className="flex items-center justify-between"><span className="text-sm font-medium">{editing ? 'Edit customer' : 'New customer'}</span>{editing && <button type="button" onClick={resetForm} className="text-xs text-ink-800/50 hover:text-wine-500 dark:text-cream-100/50"><X size={14} /></button>}</div>
        <input type="text" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="Full name" className="w-full rounded-xl border border-ink-800/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" />
        <div className="flex gap-2">
          <input type="tel" value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} placeholder="Phone" className="flex-1 rounded-xl border border-ink-800/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" />
          <input type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} placeholder="Email (optional)" className="flex-1 rounded-xl border border-ink-800/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" />
        </div>
        <textarea rows={2} value={form.measurements} onChange={e => setForm(p => ({...p, measurements: e.target.value}))} placeholder="Measurements (bust, waist, hips, shoulder, arm length...)" className="w-full rounded-xl border border-ink-800/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" />
        <textarea rows={2} value={form.notes} onChange={e => setForm(p => ({...p, notes: e.target.value}))} placeholder="Notes..." className="w-full rounded-xl border border-ink-800/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" />
        <button type="button" onClick={handleSave} className="btn-primary">{editing ? <Pencil size={14} /> : <Plus size={14} />} {editing ? 'Update' : 'Add customer'}</button>
      </div>

      {/* Search */}
      <div className="relative mt-6">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-800/40 dark:text-cream-100/40" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name..." className="w-full rounded-xl border border-ink-800/15 bg-cream-50 py-2.5 pl-9 pr-3 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" />
      </div>

      {/* List */}
      <div className="mt-4 space-y-2">
        {filtered.map(c => (
          <div key={c.id} className="rounded-2xl border border-ink-800/10 p-3 dark:border-cream-100/10">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2"><Users size={13} className="shrink-0 text-bronze-500" /><span className="font-medium text-sm">{c.name}</span></div>
                <div className="mt-1 text-[11px] text-ink-800/55 dark:text-cream-100/55">{[c.phone, c.email].filter(Boolean).join(' | ')}</div>
                {c.measurements && <div className="mt-1 text-xs text-ink-800/60 dark:text-cream-100/60">Measurements: {c.measurements}</div>}
                {c.notes && <div className="mt-1 text-xs text-ink-800/50 dark:text-cream-100/50">{c.notes}</div>}
              </div>
              <div className="flex gap-1">
                <button type="button" onClick={() => startEdit(c)} className="grid h-8 w-8 place-items-center rounded-full text-ink-800/50 hover:text-bronze-500 dark:text-cream-100/50"><Pencil size={13} /></button>
                <button type="button" onClick={() => handleDelete(c.id)} className="grid h-8 w-8 place-items-center rounded-full text-ink-800/50 hover:text-wine-500 dark:text-cream-100/50"><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="py-8 text-center text-sm text-ink-800/50 dark:text-cream-100/50">No customers yet.</p>}
      </div>
    </div>
  );
}
