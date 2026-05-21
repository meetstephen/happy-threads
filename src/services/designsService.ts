import { DESIGNS_TABLE, STORAGE_BUCKET, isSupabaseEnabled, supabase } from '../lib/supabase';
import type { ColorMood, Design, DesignCategory, Occasion, Vibe } from '../data/designs';

interface DesignRow {
  id: string;
  name: string;
  category: DesignCategory;
  description: string | null;
  image: string;
  tags: string[] | null;
  occasions: Occasion[] | null;
  vibes: Vibe[] | null;
  color_mood: ColorMood | null;
  is_new: boolean | null;
  added_on: string | null;
}

function rowToDesign(r: DesignRow): Design {
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    description: r.description ?? '',
    image: r.image,
    tags: r.tags ?? [],
    occasions: r.occasions ?? ['party'],
    vibes: r.vibes ?? ['classic'],
    colorMood: r.color_mood ?? 'neutral',
    isNew: Boolean(r.is_new),
    addedOn: r.added_on ?? undefined,
    custom: true,
  };
}

function designToRow(d: Design) {
  return {
    id: d.id,
    name: d.name,
    category: d.category,
    description: d.description,
    image: d.image,
    tags: d.tags,
    occasions: d.occasions,
    vibes: d.vibes,
    color_mood: d.colorMood,
    is_new: d.isNew ?? true,
    added_on: d.addedOn ?? new Date().toISOString(),
  };
}

export async function fetchRemoteDesigns(): Promise<Design[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from(DESIGNS_TABLE)
    .select('*')
    .order('added_on', { ascending: false });
  if (error) {
    console.warn('[supabase] fetchRemoteDesigns:', error.message);
    return [];
  }
  return (data as DesignRow[]).map(rowToDesign);
}

export async function uploadDesignImage(file: File): Promise<string> {
  if (!supabase) throw new Error('Cloud sync is not configured.');
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const filename = `design-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filename, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(`Image upload failed: ${error.message}`);
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filename);
  return data.publicUrl;
}

export async function insertRemoteDesign(d: Design): Promise<Design> {
  if (!supabase) throw new Error('Cloud sync is not configured.');
  const { data, error } = await supabase
    .from(DESIGNS_TABLE)
    .insert(designToRow(d))
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return rowToDesign(data as DesignRow);
}

export async function updateRemoteDesign(d: Design): Promise<Design> {
  if (!supabase) throw new Error('Cloud sync is not configured.');
  const { id, ...rest } = designToRow(d);
  const { data, error } = await supabase
    .from(DESIGNS_TABLE)
    .update(rest)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return rowToDesign(data as DesignRow);
}

export async function deleteRemoteDesign(id: string): Promise<void> {
  if (!supabase) throw new Error('Cloud sync is not configured.');
  const { error } = await supabase.from(DESIGNS_TABLE).delete().eq('id', id);
  if (error) throw new Error(error.message);
}

/**
 * Subscribe to live design changes. Returns an unsubscribe function.
 */
export function subscribeToDesigns(onChange: () => void): () => void {
  const client = supabase;
  if (!client) return () => {};
  const channel = client
    .channel('designs-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: DESIGNS_TABLE }, onChange)
    .subscribe();
  return () => {
    client.removeChannel(channel);
  };
}

export { isSupabaseEnabled };
