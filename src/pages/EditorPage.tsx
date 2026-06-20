import React, { useState } from 'react'
import { Canvas } from '@/editor/Canvas'
import { ComponentPalette } from '@/editor/ComponentPalette'
import { PropertiesPanel } from '@/editor/PropertiesPanel'
import { Toolbar } from '@/editor/Toolbar'
import { ExportDialog } from '@/editor/ExportDialog'
import { SettingsPage } from './SettingsPage'
import { useUIStore } from '@/store/uiStore'
import { useProjectStore } from '@/store/projectStore'

export function EditorPage() {
  const { sidebarOpen, rightPanelOpen, activeTab, rightTab, setActiveTab, setRightTab } = useUIStore()

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    }}>
      <Toolbar />

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
                { key: 'palette' as const, label: 'Komponenten' },
                { key: 'pages' as const, label: 'Seiten' },
                { key: 'media' as const, label: 'Medien' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    flex: 1,
                    padding: '10px 8px',
                    border: 'none',
                    backgroundColor: activeTab === tab.key ? 'white' : 'transparent',
                    color: activeTab === tab.key ? '#3b82f6' : '#6b7280',
                    fontWeight: activeTab === tab.key ? 600 : 400,
                    fontSize: '12px',
                    cursor: 'pointer',
                    borderBottom: activeTab === tab.key ? '2px solid #3b82f6' : '2px solid transparent',
                    transition: 'all 0.15s',
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
                { key: 'properties' as const, label: 'Eigenschaften' },
                { key: 'styles' as const, label: 'Styles' },
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
  )
}

function PagesPanel() {
  const { pages, currentPageId, setCurrentPage, createPage } = useProjectStore()
  const addToast = useUIStore(s => s.addToast)
  const [newTitle, setNewTitle] = useState('')

  const handleCreate = () => {
    if (!newTitle.trim()) return
    const id = createPage(newTitle.trim())
    setCurrentPage(id)
    setNewTitle('')
    addToast('Seite erstellt', 'success')
  }

  const pageList = Object.values(pages)

  return (
    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }}>
      <div style={{ display: 'flex', gap: '6px' }}>
        <input
          type="text"
          placeholder="Neue Seite..."
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
            Keine Seiten vorhanden
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
  return (
    <div style={{ padding: '24px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
      <p>Medienverwaltung</p>
      <p style={{ fontSize: '12px', marginTop: '8px' }}>
        Bilder und Dateien hier hochladen
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
