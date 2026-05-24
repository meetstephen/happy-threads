import { useEffect, useState } from 'react';
import { Download, Link2 } from 'lucide-react';
import QRCode from 'qrcode';

export default function QrPanel() {
  const [siteUrl, setSiteUrl] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}`
        : '';
    setSiteUrl(url);
  }, []);

  useEffect(() => {
    if (!siteUrl) return;
    QRCode.toDataURL(siteUrl, {
      width: 600,
      margin: 2,
      color: { dark: '#14110E', light: '#FAF6F1' },
      errorCorrectionLevel: 'H',
    }).then(setQrDataUrl);
  }, [siteUrl]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="grid items-center gap-8 md:grid-cols-2">
      <div>
        <p className="eyebrow">Print on a card</p>
        <h4 className="display-3 mt-2">Your shop QR</h4>
        <p className="mt-3 text-sm text-ink-800/70 dark:text-cream-100/70">
          Print this QR code on business cards, invoice receipts, your shop sign or your
          shop window. Customers point a phone camera at it and they land straight on
          your collection. No typing, no errors.
        </p>

        <div className="mt-6 flex items-center gap-2 rounded-2xl border border-ink-800/10 bg-cream-50 px-4 py-3 text-sm dark:border-cream-100/10 dark:bg-ink-900">
          <Link2 size={14} className="shrink-0 text-bronze-500" />
          <span className="flex-1 truncate">{siteUrl}</span>
          <button
            type="button"
            onClick={copy}
            className="shrink-0 rounded-full bg-ink-800 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-cream-100 dark:bg-cream-100 dark:text-ink-900"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {qrDataUrl && (
          <a
            href={qrDataUrl}
            download="happiness-fashion-qr.png"
            className="btn-primary mt-6 inline-flex"
          >
            <Download size={16} /> Download QR (PNG)
          </a>
        )}
      </div>

      <div className="grid place-items-center">
        {qrDataUrl ? (
          <div className="rounded-3xl border border-bronze-500/30 bg-cream-50 p-5 shadow-soft dark:bg-cream-100">
            <img src={qrDataUrl} alt="Happiness Fashion World QR code" className="h-64 w-64" />
            <div className="mt-3 text-center font-display text-sm italic text-ink-800">
              Happiness Fashion World · Abakaliki
            </div>
          </div>
        ) : (
          <div className="h-64 w-64 animate-pulse rounded-3xl bg-cream-200 dark:bg-ink-900" />
        )}
      </div>
    </div>
  );
}
