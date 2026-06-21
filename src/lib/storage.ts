const STORAGE_KEY = 'uiforge-save'
const DB_NAME = 'uiforge-db'
const DB_VERSION = 1

export interface UIForgeSave {
  projects: any[]
  pages: Record<string, any>
  editorNodes: Record<string, any>
  editorRootIds: string[]
  version: number
  savedAt?: string
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains('projects')) {
        db.createObjectStore('projects', { keyPath: 'id' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function saveToIndexedDB(key: string, data: any): Promise<boolean> {
  try {
    const db = await openDB()
    const tx = db.transaction('projects', 'readwrite')
    const store = tx.objectStore('projects')
    store.put({ id: key, data, savedAt: new Date().toISOString() })
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
    db.close()
    return true
  } catch (e) {
    console.error('IndexedDB save failed:', e)
    return false
  }
}

export async function loadFromIndexedDB(key: string): Promise<any | null> {
  try {
    const db = await openDB()
    const tx = db.transaction('projects', 'readonly')
    const store = tx.objectStore('projects')
    const result = await new Promise<any>((resolve, reject) => {
      const req = store.get(key)
      req.onsuccess = () => resolve(req.result?.data || null)
      req.onerror = () => reject(req.error)
    })
    db.close()
    return result
  } catch {
    return null
  }
}

export function saveToDisk(data: Partial<UIForgeSave>) {
  try {
    const existing = loadFromDisk() || {}
    const merged = { ...existing, ...data, version: 2, savedAt: new Date().toISOString() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
    // Also try IndexedDB for larger datasets
    saveToIndexedDB('main', merged).catch(() => {})
    return true
  } catch (e) {
    console.error('Save failed:', e)
    return false
  }
}

export function loadFromDisk(): UIForgeSave | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export async function loadFromDiskWithFallback(): Promise<UIForgeSave | null> {
  const local = loadFromDisk()
  if (local) return local
  try {
    return await loadFromIndexedDB('main')
  } catch {
    return null
  }
}

export function clearDisk() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {}
}
