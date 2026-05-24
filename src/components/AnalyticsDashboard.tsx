import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Eye, Heart, Clock } from 'lucide-react';
import { getAnalytics, type AnalyticsData } from '../services/analytics';

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await getAnalytics();
        if (!cancelled) setData(result);
      } catch {
        // silently fail
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-bronze-500 border-t-transparent" />
      </div>
    );
  }

  if (!data) {
    return (
      <p className="py-8 text-center text-sm text-ink-800/60 dark:text-cream-100/60">
        Could not load analytics data.
      </p>
    );
  }

  const maxVisitors = Math.max(...data.dailyVisitors.map((d) => d.count), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Daily Visitors Chart */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={16} className="text-bronze-500" />
          <h4 className="font-display text-lg text-ink-800 dark:text-cream-100">
            Daily Visitors
          </h4>
          <span className="ml-auto text-[10px] uppercase tracking-[0.2em] text-ink-800/50 dark:text-cream-100/50">
            Last 14 days
          </span>
        </div>

        {data.dailyVisitors.length === 0 ? (
          <p className="rounded-2xl bg-cream-200/50 p-6 text-center text-sm text-ink-800/60 dark:bg-ink-700/50 dark:text-cream-100/60">
            No visitor data yet. Check back after some traffic.
          </p>
        ) : (
          <div className="rounded-2xl border border-ink-800/10 bg-cream-50 p-4 dark:border-cream-100/10 dark:bg-ink-700/30">
            <div className="flex items-end gap-1 h-32">
              {data.dailyVisitors.map((day) => {
                const height = Math.max((day.count / maxVisitors) * 100, 4);
                return (
                  <div
                    key={day.date}
                    className="group relative flex-1 flex flex-col items-center justify-end h-full"
                  >
                    <div
                      className="w-full min-w-[6px] max-w-[28px] rounded-t-md bg-bronze-500/80 transition-colors group-hover:bg-bronze-500"
                      style={{ height: `${height}%` }}
                    />
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block whitespace-nowrap rounded bg-ink-800 px-2 py-0.5 text-[9px] text-cream-100 dark:bg-cream-100 dark:text-ink-800">
                      {day.date.slice(5)}: {day.count}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 flex justify-between text-[9px] text-ink-800/40 dark:text-cream-100/40">
              <span>{data.dailyVisitors[0]?.date.slice(5)}</span>
              <span>{data.dailyVisitors[data.dailyVisitors.length - 1]?.date.slice(5)}</span>
            </div>
          </div>
        )}
      </section>

      {/* Top Designs */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Eye size={16} className="text-bronze-500" />
          <h4 className="font-display text-lg text-ink-800 dark:text-cream-100">
            Top Designs
          </h4>
        </div>

        {data.topDesigns.length === 0 ? (
          <p className="rounded-2xl bg-cream-200/50 p-6 text-center text-sm text-ink-800/60 dark:bg-ink-700/50 dark:text-cream-100/60">
            No design interactions recorded yet.
          </p>
        ) : (
          <div className="space-y-2">
            {data.topDesigns.map((design, i) => (
              <div
                key={design.id}
                className="flex items-center gap-3 rounded-xl border border-ink-800/10 bg-cream-50 p-3 dark:border-cream-100/10 dark:bg-ink-700/30"
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-bronze-500/15 text-xs font-medium text-bronze-600 dark:text-bronze-400">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink-800 dark:text-cream-100">
                    {design.id}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-ink-800/60 dark:text-cream-100/60">
                  <span className="flex items-center gap-1">
                    <Eye size={12} /> {design.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart size={12} /> {design.likes}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section Engagement */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} className="text-bronze-500" />
          <h4 className="font-display text-lg text-ink-800 dark:text-cream-100">
            Section Engagement
          </h4>
        </div>

        {data.sectionEngagement.length === 0 ? (
          <p className="rounded-2xl bg-cream-200/50 p-6 text-center text-sm text-ink-800/60 dark:bg-ink-700/50 dark:text-cream-100/60">
            No section engagement data yet.
          </p>
        ) : (
          <div className="space-y-2">
            {data.sectionEngagement.map((section) => {
              const maxSec = Math.max(...data.sectionEngagement.map((s) => s.avgSeconds), 1);
              const width = Math.max((section.avgSeconds / maxSec) * 100, 5);
              return (
                <div
                  key={section.section}
                  className="rounded-xl border border-ink-800/10 bg-cream-50 p-3 dark:border-cream-100/10 dark:bg-ink-700/30"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium capitalize text-ink-800 dark:text-cream-100">
                      {section.section.replace(/-/g, ' ')}
                    </span>
                    <span className="text-xs text-ink-800/60 dark:text-cream-100/60">
                      ~{section.avgSeconds}s avg
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-ink-800/5 dark:bg-cream-100/10">
                    <div
                      className="h-full rounded-full bg-bronze-500/70"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </motion.div>
  );
}
