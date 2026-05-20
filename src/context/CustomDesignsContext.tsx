import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import type { Design } from '../data/designs';
import {
  deleteRemoteDesign,
  fetchRemoteDesigns,
  insertRemoteDesign,
  isSupabaseEnabled,
  subscribeToDesigns,
} from '../services/designsService';

interface CustomDesignsContextValue {
  customDesigns: Design[];
  /** True while we're loading from the cloud. */
  loading: boolean;
  /** True when the site is connected to Supabase (cloud sync). */
  cloudEnabled: boolean;
  /** Adds a design — to cloud if enabled, else to localStorage. */
  addDesign: (
    d: Omit<Design, 'id' | 'custom' | 'addedOn'> & { id?: string }
  ) => Promise<Design>;
  removeDesign: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const CustomDesignsContext = createContext<CustomDesignsContextValue | undefined>(undefined);
const STORAGE_KEY = 'happy-threads-custom-designs';

function loadLocal(): Design[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Design[]) : [];
  } catch {
    return [];
  }
}

function saveLocal(list: Design[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Could not save custom designs locally:', e);
  }
}

export function CustomDesignsProvider({ children }: { children: ReactNode }) {
  const [customDesigns, setCustomDesigns] = useState<Design[]>(() => loadLocal());
  const [loading, setLoading] = useState<boolean>(isSupabaseEnabled);

  const refresh = useCallback(async () => {
    if (!isSupabaseEnabled) return;
    setLoading(true);
    try {
      const remote = await fetchRemoteDesigns();
      setCustomDesigns(remote);
    } catch (e) {
      console.warn('Failed to refresh designs:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load + realtime subscription when cloud is enabled
  useEffect(() => {
    if (!isSupabaseEnabled) return;
    refresh();
    const unsubscribe = subscribeToDesigns(() => {
      refresh();
    });
    return unsubscribe;
  }, [refresh]);

  // Persist locally as a fallback (and primary store when cloud is disabled)
  useEffect(() => {
    if (!isSupabaseEnabled) saveLocal(customDesigns);
  }, [customDesigns]);

  const addDesign: CustomDesignsContextValue['addDesign'] = useCallback(async (d) => {
    const id = d.id ?? `HF-${Date.now().toString(36).toUpperCase()}`;
    const next: Design = {
      ...d,
      id,
      custom: true,
      isNew: true,
      addedOn: new Date().toISOString(),
    };

    if (isSupabaseEnabled) {
      const saved = await insertRemoteDesign(next);
      // realtime will catch up, but optimistic is nicer
      setCustomDesigns((prev) =>
        prev.find((x) => x.id === saved.id) ? prev : [saved, ...prev]
      );
      return saved;
    }

    setCustomDesigns((prev) => [next, ...prev]);
    return next;
  }, []);

  const removeDesign: CustomDesignsContextValue['removeDesign'] = useCallback(async (id) => {
    if (isSupabaseEnabled) {
      await deleteRemoteDesign(id);
      setCustomDesigns((prev) => prev.filter((d) => d.id !== id));
      return;
    }
    setCustomDesigns((prev) => prev.filter((d) => d.id !== id));
  }, []);

  return (
    <CustomDesignsContext.Provider
      value={{
        customDesigns,
        loading,
        cloudEnabled: isSupabaseEnabled,
        addDesign,
        removeDesign,
        refresh,
      }}
    >
      {children}
    </CustomDesignsContext.Provider>
  );
}

export function useCustomDesigns() {
  const ctx = useContext(CustomDesignsContext);
  if (!ctx) throw new Error('useCustomDesigns must be used inside CustomDesignsProvider');
  return ctx;
}
