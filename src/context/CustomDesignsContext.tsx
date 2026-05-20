import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import type { Design } from '../data/designs';

interface CustomDesignsContextValue {
  customDesigns: Design[];
  addDesign: (d: Omit<Design, 'id' | 'custom' | 'addedOn'> & { id?: string }) => Design;
  removeDesign: (id: string) => void;
  clearAll: () => void;
}

const CustomDesignsContext = createContext<CustomDesignsContextValue | undefined>(undefined);
const STORAGE_KEY = 'happy-threads-custom-designs';

export function CustomDesignsProvider({ children }: { children: ReactNode }) {
  const [customDesigns, setCustomDesigns] = useState<Design[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Design[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(customDesigns));
    } catch (e) {
      // localStorage quota exceeded — likely from too many large base64 images
      console.warn('Could not save custom designs:', e);
    }
  }, [customDesigns]);

  const addDesign: CustomDesignsContextValue['addDesign'] = useCallback((d) => {
    const id = d.id ?? `HF-CUSTOM-${Date.now().toString(36).toUpperCase()}`;
    const next: Design = {
      ...d,
      id,
      custom: true,
      isNew: true,
      addedOn: new Date().toISOString(),
    };
    setCustomDesigns((prev) => [next, ...prev]);
    return next;
  }, []);

  const removeDesign = useCallback((id: string) => {
    setCustomDesigns((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const clearAll = useCallback(() => setCustomDesigns([]), []);

  return (
    <CustomDesignsContext.Provider value={{ customDesigns, addDesign, removeDesign, clearAll }}>
      {children}
    </CustomDesignsContext.Provider>
  );
}

export function useCustomDesigns() {
  const ctx = useContext(CustomDesignsContext);
  if (!ctx) throw new Error('useCustomDesigns must be used inside CustomDesignsProvider');
  return ctx;
}
