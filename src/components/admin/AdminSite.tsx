import { useSiteContent } from '../../context/SiteContentContext';
import QrPanel from '../QrPanel';

export default function AdminSite() {
  const { get, set } = useSiteContent();

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Site</p>
        <h3 className="mt-2 font-display text-2xl">Site Settings</h3>
        <p className="mt-2 text-sm text-ink-800/65 dark:text-cream-100/65">Brand info and QR code for printing.</p>
      </div>

      {/* Brand stats */}
      <div className="space-y-3">
        <h4 className="font-display text-lg">Brand Stats</h4>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <label className="mb-2 block text-xs font-medium uppercase tracking-[0.22em] text-ink-800/70 dark:text-cream-100/70">Clients dressed</label>
            <input type="text" value={get('brand.clientsDressed', '200+')} onChange={e => set('brand.clientsDressed', e.target.value)} className="w-full rounded-xl border border-ink-800/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" />
          </div>
          <div className="flex-1">
            <label className="mb-2 block text-xs font-medium uppercase tracking-[0.22em] text-ink-800/70 dark:text-cream-100/70">Years of craft</label>
            <input type="text" value={get('brand.yearsOfCraft', '7+')} onChange={e => set('brand.yearsOfCraft', e.target.value)} className="w-full rounded-xl border border-ink-800/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" />
          </div>
        </div>
      </div>

      {/* QR Panel */}
      <div>
        <h4 className="mb-4 font-display text-lg">QR Code & Sharing</h4>
        <QrPanel />
      </div>
    </div>
  );
}
