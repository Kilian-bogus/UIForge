import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  rightPanelOpen: boolean
  activeTab: 'palette' | 'pages' | 'media' | 'custom' | 'plugins'
  rightTab: 'properties' | 'styles' | 'code'
  theme: 'light' | 'dark'
  exportDialogOpen: boolean
  settingsDialogOpen: boolean
  toasts: { id: string; message: string; type: 'success' | 'error' | 'info' }[]
  customComponentVersion: number

  toggleSidebar: () => void
  toggleRightPanel: () => void
  setActiveTab: (tab: 'palette' | 'pages' | 'media' | 'custom' | 'plugins') => void
  setRightTab: (tab: 'properties' | 'styles' | 'code') => void
  toggleTheme: () => void
  setExportDialog: (open: boolean) => void
  setSettingsDialog: (open: boolean) => void
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void
  removeToast: (id: string) => void
  bumpCustomComponentVersion: () => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  rightPanelOpen: true,
  activeTab: 'palette',
  rightTab: 'properties',
  theme: 'light',
  exportDialogOpen: false,
  settingsDialogOpen: false,
  toasts: [],
  customComponentVersion: 0,

  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  toggleRightPanel: () => set(s => ({ rightPanelOpen: !s.rightPanelOpen })),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setRightTab: (tab) => set({ rightTab: tab }),
  toggleTheme: () => set(s => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
  setExportDialog: (open) => set({ exportDialogOpen: open }),
  setSettingsDialog: (open) => set({ settingsDialogOpen: open }),

  addToast: (message, type = 'info') => {
    const id = Math.random().toString(36).slice(2)
    set(s => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => {
      set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }))
    }, 3000)
  },

  removeToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
  bumpCustomComponentVersion: () => set(s => ({ customComponentVersion: s.customComponentVersion + 1 })),
}))
