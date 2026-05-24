import { supabase, isSupabaseEnabled } from '../lib/supabase';

// ---------- Types ----------

export interface AnalyticsData {
  dailyVisitors: { date: string; count: number }[];
  topDesigns: { id: string; name: string; views: number; likes: number }[];
  sectionEngagement: { section: string; avgSeconds: number }[];
}

interface AnalyticsEvent {
  event_type: 'page_view' | 'section_time' | 'design_view' | 'design_like';
  event_data: Record<string, unknown>;
}

// ---------- Local storage helpers ----------

const LS_KEY = 'happy-threads-analytics';

function getLocalEvents(): AnalyticsEvent[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as AnalyticsEvent[]) : [];
  } catch {
    return [];
  }
}

function pushLocalEvent(event: AnalyticsEvent) {
  const events = getLocalEvents();
  events.push(event);
  // Keep max 2000 events locally to avoid bloating storage
  if (events.length > 2000) events.splice(0, events.length - 2000);
  localStorage.setItem(LS_KEY, JSON.stringify(events));
}

// ---------- Event queue (batched flush) ----------

let eventQueue: AnalyticsEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flush();
  }, 5000);
}

async function flush() {
  if (eventQueue.length === 0) return;
  const batch = [...eventQueue];
  eventQueue = [];

  if (isSupabaseEnabled && supabase) {
    try {
      const rows = batch.map((e) => ({
        event_type: e.event_type,
        event_data: e.event_data,
      }));
      await supabase.from('site_analytics').insert(rows);
    } catch {
      // If Supabase insert fails, store locally as fallback
      batch.forEach(pushLocalEvent);
    }
  } else {
    batch.forEach(pushLocalEvent);
  }
}

function queueEvent(event: AnalyticsEvent) {
  eventQueue.push(event);
  scheduleFlush();
}

// ---------- Public API ----------

export function initAnalytics() {
  // Flush any remaining events when the page unloads
  window.addEventListener('beforeunload', () => {
    flush();
  });
}

export function trackPageView() {
  const today = new Date().toISOString().slice(0, 10);
  queueEvent({
    event_type: 'page_view',
    event_data: { date: today },
  });
}

export function trackSectionTime(sectionId: string, seconds: number) {
  if (seconds < 1) return;
  queueEvent({
    event_type: 'section_time',
    event_data: { section: sectionId, seconds: Math.round(seconds) },
  });
}

export function trackDesignView(designId: string) {
  queueEvent({
    event_type: 'design_view',
    event_data: { designId },
  });
}

export function trackDesignLike(designId: string) {
  queueEvent({
    event_type: 'design_like',
    event_data: { designId },
  });
}

// ---------- Dashboard data retrieval ----------

export async function getAnalytics(): Promise<AnalyticsData> {
  if (isSupabaseEnabled && supabase) {
    return getAnalyticsFromSupabase();
  }
  return getAnalyticsFromLocal();
}

async function getAnalyticsFromSupabase(): Promise<AnalyticsData> {
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  const since = fourteenDaysAgo.toISOString();

  const { data: events } = await supabase!
    .from('site_analytics')
    .select('event_type, event_data, created_at')
    .gte('created_at', since)
    .order('created_at', { ascending: true });

  if (!events || events.length === 0) {
    return { dailyVisitors: [], topDesigns: [], sectionEngagement: [] };
  }

  return aggregateEvents(events as { event_type: string; event_data: Record<string, unknown>; created_at: string }[]);
}

function getAnalyticsFromLocal(): AnalyticsData {
  const events = getLocalEvents();
  // Transform local events (no created_at, use event_data.date for page_view)
  const mapped = events.map((e) => ({
    event_type: e.event_type,
    event_data: e.event_data,
    created_at: (e.event_data.date as string) || new Date().toISOString().slice(0, 10),
  }));
  return aggregateEvents(mapped);
}

function aggregateEvents(
  events: { event_type: string; event_data: Record<string, unknown>; created_at: string }[]
): AnalyticsData {
  // Daily visitors
  const dailyMap = new Map<string, number>();
  for (const e of events) {
    if (e.event_type === 'page_view') {
      const date =
        (e.event_data.date as string) || e.created_at.slice(0, 10);
      dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
    }
  }
  const dailyVisitors = Array.from(dailyMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14);

  // Top designs
  const designViews = new Map<string, number>();
  const designLikes = new Map<string, number>();
  for (const e of events) {
    const id = e.event_data.designId as string | undefined;
    if (!id) continue;
    if (e.event_type === 'design_view') {
      designViews.set(id, (designViews.get(id) || 0) + 1);
    }
    if (e.event_type === 'design_like') {
      designLikes.set(id, (designLikes.get(id) || 0) + 1);
    }
  }
  const allDesignIds = new Set([...designViews.keys(), ...designLikes.keys()]);
  const topDesigns = Array.from(allDesignIds)
    .map((id) => ({
      id,
      name: id, // Name resolved in the dashboard component
      views: designViews.get(id) || 0,
      likes: designLikes.get(id) || 0,
    }))
    .sort((a, b) => b.views + b.likes - (a.views + a.likes))
    .slice(0, 5);

  // Section engagement
  const sectionTotals = new Map<string, { total: number; count: number }>();
  for (const e of events) {
    if (e.event_type === 'section_time') {
      const section = e.event_data.section as string;
      const seconds = e.event_data.seconds as number;
      if (!section) continue;
      const existing = sectionTotals.get(section) || { total: 0, count: 0 };
      existing.total += seconds;
      existing.count += 1;
      sectionTotals.set(section, existing);
    }
  }
  const sectionEngagement = Array.from(sectionTotals.entries())
    .map(([section, { total, count }]) => ({
      section,
      avgSeconds: Math.round(total / count),
    }))
    .sort((a, b) => b.avgSeconds - a.avgSeconds);

  return { dailyVisitors, topDesigns, sectionEngagement };
}
