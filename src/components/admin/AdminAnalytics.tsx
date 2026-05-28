import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import AnalyticsDashboard from '../AnalyticsDashboard';

export default function AdminAnalytics() {
  const [key, setKey] = useState(0);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="eyebrow">Analytics</p>
          <h3 className="mt-2 font-display text-2xl">Visitor Insights</h3>
        </div>
        <button
          type="button"
          onClick={() => setKey(k => k + 1)}
          className="grid h-10 w-10 place-items-center rounded-full border border-ink-800/15 text-ink-800/60 transition-colors hover:border-bronze-500 hover:text-bronze-500 dark:border-cream-100/20 dark:text-cream-100/60"
          title="Refresh"
        >
          <RefreshCw size={16} />
        </button>
      </div>
      <AnalyticsDashboard key={key} />
    </div>
  );
}
