import { useRef, useState } from 'react';
import { Download, Save, Upload } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';
import { downloadAdminBackup, restoreAdminBackup } from '../../utils/adminBackup';
import QrPanel from '../QrPanel';

export default function AdminSite() {
  const { get, set } = useSiteContent();
  const [clientsDressed, setClientsDressed] = useState(() => get('brand.clientsDressed', '200+'));
  const [yearsOfCraft, setYearsOfCraft] = useState(() => get('brand.yearsOfCraft', '7+'));
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const restoreRef = useRef<HTMLInputElement>(null);

  const saveStats = async () => {
    setBusy(true); setError(null);
    try {
      await set('brand.clientsDressed', clientsDressed.trim() || '200+');
      await set('brand.yearsOfCraft', yearsOfCraft.trim() || '7+');
      setInfo('Brand stats saved.');
    } catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  };

  const restoreBackup = async (file: File | undefined) => {
    if (!file || !window.confirm('Restore this backup on this device? Matching local records will be replaced.')) return;
    setBusy(true); setError(null);
    try {
      const count = await restoreAdminBackup(file);
      setInfo(`${count} data groups restored. Reloading...`);
      window.setTimeout(() => window.location.reload(), 700);
    } catch (err) { setError((err as Error).message); setBusy(false); }
  };

  return (
    <div className="space-y-8">
      <div><p className="eyebrow">Site</p><h3 className="mt-2 font-display text-2xl">Site Settings</h3><p className="mt-2 text-sm text-ink-800/65 dark:text-cream-100/65">Brand info, device backup and QR code for printing.</p></div>
      {error && <p className="rounded-2xl border border-wine-500/30 bg-wine-500/10 p-3 text-sm text-wine-500">{error}</p>}
      {info && <p className="rounded-2xl border border-[#25D366]/30 bg-[#25D366]/10 p-3 text-sm text-[#1da851]">{info}</p>}

      <div className="space-y-3">
        <h4 className="font-display text-lg">Brand Stats</h4>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1"><label className="mb-2 block text-xs font-medium uppercase tracking-[0.22em] text-ink-800/70 dark:text-cream-100/70">Clients dressed</label><input type="text" value={clientsDressed} onChange={e => setClientsDressed(e.target.value)} className="w-full rounded-xl border border-ink-800/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" /></div>
          <div className="flex-1"><label className="mb-2 block text-xs font-medium uppercase tracking-[0.22em] text-ink-800/70 dark:text-cream-100/70">Years of craft</label><input type="text" value={yearsOfCraft} onChange={e => setYearsOfCraft(e.target.value)} className="w-full rounded-xl border border-ink-800/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" /></div>
        </div>
        <button type="button" disabled={busy} onClick={saveStats} className="btn-primary"><Save size={14} /> Save stats</button>
      </div>

      <div className="space-y-3 rounded-2xl border border-ink-800/10 p-4 dark:border-cream-100/10">
        <h4 className="font-display text-lg">Phone Data Backup</h4>
        <p className="text-sm text-ink-800/65 dark:text-cream-100/65">Bookings, customer measurements and WhatsApp templates are private to this browser. Download a backup before changing or resetting the phone.</p>
        <div className="flex flex-wrap gap-2"><button type="button" onClick={downloadAdminBackup} className="btn-primary"><Download size={14} /> Download backup</button><button type="button" disabled={busy} onClick={() => restoreRef.current?.click()} className="btn-secondary"><Upload size={14} /> Restore backup</button></div>
        <input ref={restoreRef} type="file" accept="application/json,.json" className="hidden" onChange={e => { void restoreBackup(e.target.files?.[0]); e.currentTarget.value = ''; }} />
      </div>

      <div><h4 className="mb-4 font-display text-lg">QR Code & Sharing</h4><QrPanel /></div>
    </div>
  );
}
