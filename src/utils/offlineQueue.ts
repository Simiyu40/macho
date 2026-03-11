/*
 * Offline Queue — IndexedDB-based pending report queue
 * When the user submits a report offline, it's saved here and synced when online.
 */

const DB_NAME = "macho_offline";
const STORE_NAME = "pending_reports";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export interface PendingReport {
  id?: number;
  title: string;
  description: string;
  severity: string;
  county: string;
  constituency: string;
  agency_id: string;
  latitude: number;
  longitude: number;
  address: string;
  imageBlob: Blob | null;
  timestamp: number;
}

export async function queueReport(report: PendingReport): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).add({ ...report, timestamp: Date.now() });
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getPendingReports(): Promise<PendingReport[]> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function removePendingReport(id: number): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).delete(id);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getPendingCount(): Promise<number> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  return new Promise((resolve, reject) => {
    const req = store.count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// Auto-sync when back online
export function startOfflineSync(syncFn: (report: PendingReport) => Promise<boolean>): void {
  const attemptSync = async () => {
    if (!navigator.onLine) return;
    const pending = await getPendingReports();
    for (const report of pending) {
      const success = await syncFn(report);
      if (success && report.id) {
        await removePendingReport(report.id);
      }
    }
  };

  window.addEventListener("online", attemptSync);
  // Also try immediately
  attemptSync();
}
