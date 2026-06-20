const STORAGE_KEY = 'uiforge-save'

export interface UIForgeSave {
  projects: any[]
  pages: Record<string, any>
  editorNodes: Record<string, any>
  editorRootIds: string[]
  version: number
}

export function saveToDisk(data: Partial<UIForgeSave>) {
  try {
    const existing = loadFromDisk() || {}
    const merged = { ...existing, ...data, version: 2, savedAt: new Date().toISOString() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
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

export function clearDisk() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {}
}
