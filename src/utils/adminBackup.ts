const BACKUP_KEYS = [
  'happy-threads-bookings',
  'happy-threads-customers',
  'happy-threads-wa-templates',
  'happy-threads-custom-designs',
  'happy-threads-site-content',
] as const;

interface AdminBackup {
  app: 'happiness-fashion-world';
  version: 1;
  exportedAt: string;
  data: Record<string, string>;
}

export function downloadAdminBackup() {
  const data: Record<string, string> = {};
  for (const key of BACKUP_KEYS) {
    const value = localStorage.getItem(key);
    if (value !== null) data[key] = value;
  }
  const backup: AdminBackup = { app: 'happiness-fashion-world', version: 1, exportedAt: new Date().toISOString(), data };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `happiness-fashion-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function restoreAdminBackup(file: File): Promise<number> {
  if (file.size > 5 * 1024 * 1024) throw new Error('Backup file is too large.');
  const parsed = JSON.parse(await file.text()) as Partial<AdminBackup>;
  if (parsed.app !== 'happiness-fashion-world' || parsed.version !== 1 || !parsed.data || typeof parsed.data !== 'object') {
    throw new Error('This is not a valid Happiness Fashion backup.');
  }
  let restored = 0;
  for (const key of BACKUP_KEYS) {
    const value = parsed.data[key];
    if (typeof value !== 'string') continue;
    JSON.parse(value);
    localStorage.setItem(key, value);
    restored += 1;
  }
  if (!restored) throw new Error('This backup does not contain any restorable records.');
  return restored;
}
