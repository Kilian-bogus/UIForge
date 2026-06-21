import React, { useState, useCallback, useEffect } from 'react'
import { DndContext, DragOverlay, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core'
import { Canvas } from '@/editor/Canvas'
import { ComponentPalette } from '@/editor/ComponentPalette'
import { PropertiesPanel } from '@/editor/PropertiesPanel'
import { Toolbar } from '@/editor/Toolbar'
import { ExportDialog } from '@/editor/ExportDialog'
import { SettingsPage } from './SettingsPage'
import { useUIStore } from '@/store/uiStore'
import { useProjectStore } from '@/store/projectStore'
import { useEditorStore } from '@/store/editorStore'
import { useTranslation } from '@/store/i18nStore'
import * as Icons from 'lucide-react'
import { registerCustomComponent } from '@/components/registry'

interface EditorPageProps {
  onNavigate?: (page: string) => void
}

export function EditorPage({ onNavigate }: EditorPageProps) {
  const { sidebarOpen, rightPanelOpen, activeTab, rightTab, setActiveTab, setRightTab } = useUIStore()
  const { t } = useTranslation()
  const [activeDragId, setActiveDragId] = useState<string | null>(null)
  const setDragging = useEditorStore(s => s.setDragging)
  const addComponent = useEditorStore(s => s.addComponent)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('uiforge-custom-components') || '[]')
      saved.forEach((cc: { name: string; html: string }) => {
        registerCustomComponent(cc.name, cc.html)
      })
    } catch {}
  }, [])

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setDragging(true)
    setActiveDragId(String(event.active.id))
  }, [setDragging])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setDragging(false)
    setActiveDragId(null)
    const { active, over } = event
    if (!over) return

    const data = active.data.current as any
    if (data?.type === 'new-component') {
      const componentType = data.componentType
      const overData = over.data.current as any
      const parentId = overData?.parentId || null
      addComponent(componentType, parentId)
    }
  }, [addComponent])

  const handleDragCancel = useCallback(() => {
    setDragging(false)
    setActiveDragId(null)
  }, [setDragging])

  const activeDragComponentType = activeDragId?.startsWith('new-') ? activeDragId.replace('new-', '') : null

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#ffffff',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}>
        <Toolbar onNavigate={onNavigate} />

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {sidebarOpen && (
            <div style={{
              width: '280px',
              borderRight: '1px solid #e5e7eb',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#fafafa',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
                {[
                  { key: 'palette' as const, label: t('editor.palette.title') },
                  { key: 'pages' as const, label: t('editor.pages.title') },
                  { key: 'media' as const, label: t('editor.media.title') },
                  { key: 'custom' as const, label: t('editor.custom.title') },
                  { key: 'plugins' as const, label: t('editor.plugins.title') },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      flex: 1,
                      padding: '10px 4px',
                      border: 'none',
                      backgroundColor: activeTab === tab.key ? 'white' : 'transparent',
                      color: activeTab === tab.key ? '#3b82f6' : '#6b7280',
                      fontWeight: activeTab === tab.key ? 600 : 400,
                      fontSize: '11px',
                      cursor: 'pointer',
                      borderBottom: activeTab === tab.key ? '2px solid #3b82f6' : '2px solid transparent',
                      transition: 'all 0.15s',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                {activeTab === 'palette' && <ComponentPalette />}
                {activeTab === 'pages' && <PagesPanel />}
                {activeTab === 'media' && <MediaPanel />}
                {activeTab === 'custom' && <CustomComponentsPanel />}
                {activeTab === 'plugins' && <PluginsPanel />}
              </div>
            </div>
          )}

          <Canvas />

          {rightPanelOpen && (
            <div style={{
              width: '300px',
              borderLeft: '1px solid #e5e7eb',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#fafafa',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
                {[
                  { key: 'properties' as const, label: t('editor.properties.title') },
                  { key: 'styles' as const, label: t('editor.properties.styles') },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setRightTab(tab.key)}
                    style={{
                      flex: 1,
                      padding: '10px 8px',
                      border: 'none',
                      backgroundColor: rightTab === tab.key ? 'white' : 'transparent',
                      color: rightTab === tab.key ? '#3b82f6' : '#6b7280',
                      fontWeight: rightTab === tab.key ? 600 : 400,
                      fontSize: '12px',
                      cursor: 'pointer',
                      borderBottom: rightTab === tab.key ? '2px solid #3b82f6' : '2px solid transparent',
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <PropertiesPanel />
              </div>
            </div>
          )}
        </div>

        <ExportDialog />
        <SettingsPage />
        <ToastContainer />
      </div>

      <DragOverlay>
        {activeDragComponentType && (
          <div style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
          }}>
            {activeDragComponentType}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

function PagesPanel() {
  const { pages, currentPageId, setCurrentPage, createPage } = useProjectStore()
  const addToast = useUIStore(s => s.addToast)
  const { t } = useTranslation()
  const [newTitle, setNewTitle] = useState('')

  const handleCreate = () => {
    if (!newTitle.trim()) return
    const id = createPage(newTitle.trim())
    setCurrentPage(id)
    setNewTitle('')
    addToast(t('editor.pages.create'), 'success')
  }

  const pageList = Object.values(pages)

  return (
    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }}>
      <div style={{ display: 'flex', gap: '6px' }}>
        <input
          type="text"
          placeholder={t('editor.pages.new')}
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
          style={{
            flex: 1, padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: '4px',
            fontSize: '13px', outline: 'none',
          }}
        />
        <button onClick={handleCreate} style={{
          padding: '6px 10px', backgroundColor: '#3b82f6', color: 'white', border: 'none',
          borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 600,
        }}>+</button>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {pageList.length === 0 ? (
          <p style={{ fontSize: '13px', color: '#9ca3af', textAlign: 'center', marginTop: '24px' }}>
            {t('editor.pages.none')}
          </p>
        ) : (
          pageList.map(page => (
            <div
              key={page.id}
              onClick={() => setCurrentPage(page.id)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 10px', borderRadius: '6px', cursor: 'pointer',
                backgroundColor: currentPageId === page.id ? '#eff6ff' : 'transparent',
                color: currentPageId === page.id ? '#3b82f6' : '#374151',
                fontSize: '13px', fontWeight: currentPageId === page.id ? 600 : 400,
                marginBottom: '2px',
              }}
              onMouseEnter={e => { if (currentPageId !== page.id) e.currentTarget.style.backgroundColor = '#f3f4f6' }}
              onMouseLeave={e => { if (currentPageId !== page.id) e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <span>{page.title}</span>
              <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                {page.status === 'published' ? '✓' : '○'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function MediaPanel() {
  const { t } = useTranslation()
  return (
    <div style={{ padding: '24px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
      <p>{t('editor.media.title')}</p>
      <p style={{ fontSize: '12px', marginTop: '8px' }}>
        {t('editor.media.desc')}
      </p>
      <div style={{
        margin: '16px auto', padding: '32px', border: '2px dashed #d1d5db', borderRadius: '8px',
        cursor: 'pointer', maxWidth: '200px',
      }}>
        +
      </div>
    </div>
  )
}

function CustomComponentsPanel() {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [html, setHtml] = useState('')
  const addToast = useUIStore(s => s.addToast)
  const bumpVersion = useUIStore(s => s.bumpCustomComponentVersion)
  const [customComponents, setCustomComponents] = useState<{ name: string; html: string }[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('uiforge-custom-components') || '[]')
    } catch { return [] }
  })

  const handleSave = () => {
    if (!name.trim() || !html.trim()) return
    const updated = [...customComponents, { name: name.trim(), html: html.trim() }]
    setCustomComponents(updated)
    localStorage.setItem('uiforge-custom-components', JSON.stringify(updated))
    registerCustomComponent(name.trim(), html.trim())
    setName('')
    setHtml('')
    bumpVersion()
    addToast(t('editor.custom.saved'), 'success')
  }

  return (
    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <input
          type="text"
          placeholder={t('editor.custom.name')}
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px', outline: 'none' }}
        />
        <textarea
          placeholder="<div>HTML...</div>"
          value={html}
          onChange={e => setHtml(e.target.value)}
          rows={4}
          style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace', outline: 'none', resize: 'vertical' }}
        />
        <button
          onClick={handleSave}
          style={{
            padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none',
            borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '13px',
          }}
        >
          {t('editor.custom.save')}
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {customComponents.length === 0 ? (
          <p style={{ fontSize: '13px', color: '#9ca3af', textAlign: 'center', marginTop: '24px' }}>
            {t('editor.custom.title')}
          </p>
        ) : (
          customComponents.map((cc, i) => (
            <div key={i} style={{
              padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: '6px',
              marginBottom: '6px', fontSize: '13px',
            }}>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>{cc.name}</div>
              <div style={{ fontSize: '11px', color: '#6b7280', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cc.html}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function PluginsPanel() {
  const { t } = useTranslation()
  const [plugins, setPlugins] = useState<{ name: string; description: string }[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('uiforge-plugins') || '[]')
    } catch { return [] }
  })

  return (
    <div style={{ padding: '16px' }}>
      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
        {t('editor.plugins.none')}
      </p>
      {plugins.length === 0 ? (
        <div style={{
          padding: '24px', textAlign: 'center', border: '1px dashed #d1d5db', borderRadius: '8px',
        }}>
          <Icons.Puzzle size={24} color="#d1d5db" />
          <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
            {t('editor.plugins.none')}
          </p>
        </div>
      ) : (
        plugins.map((p, i) => (
          <div key={i} style={{ padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px', marginBottom: '8px' }}>
            <div style={{ fontWeight: 600, fontSize: '13px' }}>{p.name}</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>{p.description}</div>
          </div>
        ))
      )}
    </div>
  )
}

function ToastContainer() {
  const { toasts, removeToast } = useUIStore()

  return (
    <div style={{
      position: 'fixed', bottom: '20px', right: '20px', zIndex: 2000,
      display: 'flex', flexDirection: 'column', gap: '8px',
    }}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          onClick={() => removeToast(toast.id)}
          style={{
            padding: '12px 20px',
            borderRadius: '8px',
            backgroundColor: toast.type === 'success' ? '#059669' : toast.type === 'error' ? '#dc2626' : '#3b82f6',
            color: 'white',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            animation: 'slideIn 0.3s ease',
          }}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}
