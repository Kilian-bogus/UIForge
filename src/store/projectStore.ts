import { create } from 'zustand'
import { nanoid } from 'nanoid'
import type { Page, Project, ProjectSettings, User } from '@/types'
import { saveToDisk, loadFromDisk } from '@/lib/storage'

interface ProjectState {
  projects: Project[]
  currentProjectId: string | null
  pages: Record<string, Page>
  currentPageId: string | null
  user: User | null
  isSaving: boolean
  lastSaved: string | null

  setUser: (user: User | null) => void
  createProject: (name: string, description?: string) => string
  setCurrentProject: (id: string | null) => void
  createPage: (title: string, slug?: string) => string
  updatePage: (id: string, data: Partial<Page>) => void
  deletePage: (id: string) => void
  setCurrentPage: (id: string | null) => void
  updateProjectSettings: (settings: Partial<ProjectSettings>) => void
  getCurrentProject: () => Project | undefined
  getCurrentPage: () => Page | undefined
  saveToStorage: () => void
  loadFromStorage: () => boolean
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProjectId: null,
  pages: {},
  currentPageId: null,
  user: null,
  isSaving: false,
  lastSaved: null,

  setUser: (user) => set({ user }),

  createProject: (name, description) => {
    const id = nanoid()
    const pageId = get().createPage('Startseite', 'home')
    const project: Project = {
      id,
      name,
      description,
      pages: [pageId],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settings: {
        framework: 'react',
        styling: 'tailwind',
        typescript: true,
        theme: { primaryColor: '#3b82f6', fontFamily: 'Inter, sans-serif', borderRadius: '8px' },
      },
    }
    set(state => ({ projects: [...state.projects, project], currentProjectId: id, currentPageId: pageId }))
    return id
  },

  setCurrentProject: (id) => set({ currentProjectId: id }),

  createPage: (title, slug) => {
    const id = nanoid()
    const page: Page = {
      id,
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      rootComponentId: nanoid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
    }
    set(state => ({ pages: { ...state.pages, [id]: page } }))
    return id
  },

  updatePage: (id, data) => {
    set(state => {
      const page = state.pages[id]
      if (!page) return state
      return { pages: { ...state.pages, [id]: { ...page, ...data, updatedAt: new Date().toISOString() } } }
    })
  },

  deletePage: (id) => {
    set(state => {
      const { [id]: _, ...rest } = state.pages
      return {
        pages: rest,
        currentPageId: state.currentPageId === id
          ? (Object.values(rest)[0]?.id || null)
          : state.currentPageId,
      }
    })
  },

  setCurrentPage: (id) => set({ currentPageId: id }),

  updateProjectSettings: (settings) => {
    set(state => {
      const project = state.projects.find(p => p.id === state.currentProjectId)
      if (!project) return state
      return {
        projects: state.projects.map(p =>
          p.id === state.currentProjectId
            ? { ...p, settings: { ...p.settings, ...settings }, updatedAt: new Date().toISOString() }
            : p
        ),
      }
    })
  },

  getCurrentProject: () => {
    const state = get()
    return state.projects.find(p => p.id === state.currentProjectId)
  },

  getCurrentPage: () => {
    const state = get()
    return state.currentPageId ? state.pages[state.currentPageId] : undefined
  },

  saveToStorage: () => {
    const { projects, pages } = get()
    saveToDisk({ projects, pages })
  },

  loadFromStorage: () => {
    const saved = loadFromDisk()
    if (!saved) return false
    const projects = saved.projects || []
    const pages = saved.pages || {}
    const currentProjectId = projects.length > 0 ? projects[0].id : null
    set({ projects, pages, currentProjectId })
    return projects.length > 0
  },
}))
