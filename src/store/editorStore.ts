import { create } from 'zustand'
import { nanoid } from 'nanoid'
import type { ComponentInstance, ComponentType } from '@/types'
import { getComponentDefinition } from '@/components/registry'
import { saveToDisk, loadFromDisk } from '@/lib/storage'

export interface HistoryEntry {
  nodes: Record<string, ComponentInstance>
  rootIds: string[]
  timestamp: number
}

interface EditorState {
  nodes: Record<string, ComponentInstance>
  rootIds: string[]
  selectedNodeId: string | null
  hoveredNodeId: string | null
  clipboard: { nodes: Record<string, ComponentInstance>; rootIds: string[] } | null
  history: HistoryEntry[]
  historyIndex: number
  isDragging: boolean
  showGrid: boolean
  zoom: number
  viewMode: 'editor' | 'preview' | 'mobile' | 'tablet'

  addComponent: (type: ComponentType, parentId?: string | null, index?: number) => string
  updateComponentProps: (id: string, props: Record<string, any>) => void
  updateComponentStyles: (id: string, styles: Record<string, string>) => void
  removeComponent: (id: string) => void
  moveComponent: (id: string, newParentId: string | null, newIndex: number) => void
  duplicateComponent: (id: string) => void
  selectNode: (id: string | null) => void
  hoverNode: (id: string | null) => void
  copySelected: () => void
  pasteClipboard: () => void
  undo: () => void
  redo: () => void
  setDragging: (v: boolean) => void
  setViewMode: (mode: 'editor' | 'preview' | 'mobile' | 'tablet') => void
  setZoom: (z: number) => void
  loadProject: (nodes: Record<string, ComponentInstance>, rootIds: string[]) => void
  saveToStorage: () => void
  loadFromStorage: () => boolean
  getFlatList: () => ComponentInstance[]
  canUndo: () => boolean
  canRedo: () => boolean
}

function pushHistory(state: EditorState): Partial<EditorState> {
  const entry: HistoryEntry = {
    nodes: JSON.parse(JSON.stringify(state.nodes)),
    rootIds: [...state.rootIds],
    timestamp: Date.now(),
  }
  const history = state.history.slice(0, state.historyIndex + 1)
  history.push(entry)
  if (history.length > 50) history.shift()
  return { history, historyIndex: history.length - 1 }
}

export const useEditorStore = create<EditorState>((set, get) => ({
  nodes: {},
  rootIds: [],
  selectedNodeId: null,
  hoveredNodeId: null,
  clipboard: null,
  history: [{ nodes: {}, rootIds: [], timestamp: Date.now() }],
  historyIndex: 0,
  isDragging: false,
  showGrid: true,
  zoom: 100,
  viewMode: 'editor',

  addComponent: (type, parentId = null, index) => {
    const def = getComponentDefinition(type)
    if (!def) return ''

    const id = nanoid()
    const node: ComponentInstance = {
      id,
      type,
      props: { ...def.defaultProps },
      children: [],
      parentId,
      styles: {},
    }

    set(state => {
      const newNodes = { ...state.nodes, [id]: node }
      const newRootIds = parentId ? state.rootIds : [...state.rootIds, id]

      if (parentId && state.nodes[parentId]) {
        const parent = { ...state.nodes[parentId] }
        const children = [...parent.children]
        if (typeof index === 'number') {
          children.splice(index, 0, id)
        } else {
          children.push(id)
        }
        newNodes[parentId] = { ...parent, children }
      }

      return { nodes: newNodes, rootIds: newRootIds, selectedNodeId: id, ...pushHistory({ ...state, nodes: newNodes, rootIds: newRootIds }) }
    })
    return id
  },

  updateComponentProps: (id, props) => {
    set(state => {
      if (!state.nodes[id]) return state
      const node = state.nodes[id]
      const updated = { ...node, props: { ...node.props, ...props } }
      const newNodes = { ...state.nodes, [id]: updated }
      return { nodes: newNodes, ...pushHistory({ ...state, nodes: newNodes }) }
    })
  },

  updateComponentStyles: (id, styles) => {
    set(state => {
      if (!state.nodes[id]) return state
      const node = state.nodes[id]
      const updated = { ...node, styles: { ...node.styles, ...styles } }
      const newNodes = { ...state.nodes, [id]: updated }
      return { nodes: newNodes, ...pushHistory({ ...state, nodes: newNodes }) }
    })
  },

  removeComponent: (id) => {
    set(state => {
      const newNodes = { ...state.nodes }
      const toRemove = new Set<string>()

      const collectChildren = (nodeId: string) => {
        toRemove.add(nodeId)
        const n = newNodes[nodeId]
        if (n) n.children.forEach(collectChildren)
      }
      collectChildren(id)

      toRemove.forEach(nid => delete newNodes[nid])

      let newRootIds = state.rootIds.filter(rid => !toRemove.has(rid))
      Object.keys(newNodes).forEach(nid => {
        const n = newNodes[nid]
        if (n.parentId && toRemove.has(n.parentId)) {
          newNodes[nid] = { ...n, parentId: null }
          if (!newRootIds.includes(nid)) newRootIds.push(nid)
        }
        if (n.children) {
          newNodes[nid] = { ...newNodes[nid], children: n.children.filter(c => !toRemove.has(c)) }
        }
      })

      const newSelected = state.selectedNodeId && toRemove.has(state.selectedNodeId) ? null : state.selectedNodeId
      return { nodes: newNodes, rootIds: newRootIds, selectedNodeId: newSelected, ...pushHistory({ ...state, nodes: newNodes, rootIds: newRootIds }) }
    })
  },

  moveComponent: (id, newParentId, newIndex) => {
    set(state => {
      const newNodes = { ...state.nodes }
      const node = newNodes[id]
      if (!node) return state

      if (node.parentId && newNodes[node.parentId]) {
        const oldParent = { ...newNodes[node.parentId] }
        oldParent.children = oldParent.children.filter(c => c !== id)
        newNodes[node.parentId] = oldParent
      }

      if (newParentId) {
        if (!newNodes[newParentId]) return state
        const newParent = { ...newNodes[newParentId] }
        const children = [...newParent.children]
        children.splice(newIndex, 0, id)
        newParent.children = children
        newNodes[newParentId] = newParent
      }

      newNodes[id] = { ...node, parentId: newParentId }

      let newRootIds = state.rootIds.filter(rid => rid !== id)
      if (!newParentId) {
        newRootIds.splice(newIndex, 0, id)
      }

      return { nodes: newNodes, rootIds: newRootIds, ...pushHistory({ ...state, nodes: newNodes, rootIds: newRootIds }) }
    })
  },

  duplicateComponent: (id) => {
    set(state => {
      if (!state.nodes[id]) return state
      const newNodes = { ...state.nodes }
      const idMap = new Map<string, string>()

      const cloneNode = (nodeId: string, newParent?: string | null): string => {
        const orig = newNodes[nodeId]
        const newId = nanoid()
        idMap.set(nodeId, newId)
        const clone: ComponentInstance = {
          ...JSON.parse(JSON.stringify(orig)),
          id: newId,
          parentId: newParent ?? null,
          children: [],
        }
        newNodes[newId] = clone
        orig.children.forEach(c => {
          const childId = cloneNode(c, newId)
          clone.children.push(childId)
        })
        return newId
      }

      const clonedId = cloneNode(id, state.nodes[id].parentId)

      if (state.nodes[id].parentId && newNodes[state.nodes[id].parentId!]) {
        const parent = newNodes[state.nodes[id].parentId!]
        const idx = parent.children.indexOf(id)
        parent.children.splice(idx + 1, 0, clonedId)
      }

      let newRootIds = state.rootIds
      if (!state.nodes[id].parentId) {
        const idx = state.rootIds.indexOf(id)
        newRootIds = [...state.rootIds]
        newRootIds.splice(idx + 1, 0, clonedId)
      }

      return { nodes: newNodes, rootIds: newRootIds, selectedNodeId: clonedId, ...pushHistory({ ...state, nodes: newNodes, rootIds: newRootIds }) }
    })
  },

  selectNode: (id) => set({ selectedNodeId: id }),
  hoverNode: (id) => set({ hoveredNodeId: id }),

  copySelected: () => {
    const state = get()
    if (!state.selectedNodeId) return
    const nodes: Record<string, ComponentInstance> = {}
    const rootIds: string[] = []
    const collect = (id: string) => {
      nodes[id] = JSON.parse(JSON.stringify(state.nodes[id]))
      rootIds.push(id)
      state.nodes[id]?.children.forEach(collect)
    }
    collect(state.selectedNodeId)
    set({ clipboard: { nodes, rootIds } })
  },

  pasteClipboard: () => {
    const state = get()
    if (!state.clipboard) return
    const newNodes = { ...state.nodes }
    const newRootIds: string[] = []
    const sourceNodes = state.clipboard.nodes

    const cloneTree = (origId: string, attachParent: string | null | undefined): string => {
      const newId = nanoid()
      const orig = sourceNodes[origId]
      newNodes[newId] = { ...JSON.parse(JSON.stringify(orig)), id: newId, parentId: attachParent ?? null, children: [] }
      if (!attachParent) newRootIds.push(newId)
      for (const childId of orig.children || []) {
        const childNewId = cloneTree(childId, newId)
        newNodes[newId].children.push(childNewId)
      }
      return newId
    }

    const targetId = state.selectedNodeId
    const parentId = targetId && state.nodes[targetId]
      ? (state.nodes[targetId].type === 'Container' ? targetId : state.nodes[targetId].parentId)
      : null

    for (const rid of state.clipboard.rootIds) {
      const newId = cloneTree(rid, parentId)
      if (parentId && newNodes[parentId]) {
        newNodes[parentId] = { ...newNodes[parentId], children: [...newNodes[parentId].children, newId] }
      }
    }

    const mergedRootIds = [...state.rootIds.filter((r: string) => !newRootIds.includes(r)), ...newRootIds]
    set({
      nodes: newNodes,
      rootIds: mergedRootIds,
      selectedNodeId: newRootIds[0] || state.selectedNodeId,
      ...pushHistory({ ...state, nodes: newNodes, rootIds: mergedRootIds }),
    })
  },

  undo: () => {
    const state = get()
    if (state.historyIndex <= 0) return
    const entry = state.history[state.historyIndex - 1]
    set({ nodes: JSON.parse(JSON.stringify(entry.nodes)), rootIds: [...entry.rootIds], historyIndex: state.historyIndex - 1 })
  },

  redo: () => {
    const state = get()
    if (state.historyIndex >= state.history.length - 1) return
    const entry = state.history[state.historyIndex + 1]
    if (!entry) return
    set({ nodes: JSON.parse(JSON.stringify(entry.nodes)), rootIds: [...entry.rootIds], historyIndex: state.historyIndex + 1 })
  },

  setDragging: (v) => set({ isDragging: v }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setZoom: (z) => set({ zoom: z }),

  loadProject: (nodes, rootIds) => {
    const entry: HistoryEntry = { nodes: JSON.parse(JSON.stringify(nodes)), rootIds: [...rootIds], timestamp: Date.now() }
    set({ nodes, rootIds, history: [entry], historyIndex: 0, selectedNodeId: null })
  },

  saveToStorage: () => {
    const { nodes, rootIds } = get()
    saveToDisk({ editorNodes: nodes, editorRootIds: rootIds })
  },

  loadFromStorage: () => {
    const saved = loadFromDisk()
    if (!saved || !saved.editorNodes) return false
    set({ nodes: saved.editorNodes, rootIds: saved.editorRootIds || [] })
    return true
  },

  getFlatList: () => {
    const state = get()
    return Object.values(state.nodes)
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,
}))
