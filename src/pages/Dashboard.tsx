import React, { useState, useEffect } from 'react'
import { useProjectStore } from '@/store/projectStore'
import { useEditorStore } from '@/store/editorStore'
import { loadFromDisk } from '@/lib/storage'
import { useTranslation } from '@/store/i18nStore'
import * as Icons from 'lucide-react'

interface DashboardProps {
  onNavigate: (page: string) => void
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { projects, createProject, setCurrentProject, pages } = useProjectStore()
  const { loadProject } = useEditorStore()
  const { t } = useTranslation()
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')

  useEffect(() => {
    const saved = loadFromDisk()
    if (saved && saved.projects && saved.projects.length > 0) {
      useProjectStore.getState().loadFromStorage()
    }
  }, [])

  const handleCreate = () => {
    if (!name.trim()) return
    const id = createProject(name.trim())
    setShowCreate(false)
    setName('')
    const rootId = useEditorStore.getState().addComponent('Container', null)
    onNavigate('editor')
  }

  const handleOpenProject = (projectId: string) => {
    setCurrentProject(projectId)
    onNavigate('editor')
  }

  const pageCount = Object.keys(pages).length

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Icons.Box size={28} color="#3b82f6" />
          <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>UIForge</h1>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>{t('app.tagline')}</span>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, margin: 0 }}>{t('dashboard.title')}</h2>
          <button
            onClick={() => setShowCreate(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Icons.Plus size={18} />
            {t('dashboard.create')}
          </button>
        </div>

        {showCreate && (
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
          }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: 600 }}>{t('dashboard.createTitle')}</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder={t('dashboard.placeholder')}
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                }}
                autoFocus
              />
              <button onClick={handleCreate} style={{
                padding: '10px 20px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: 'pointer',
              }}>
                {t('dashboard.createBtn')}
              </button>
              <button onClick={() => setShowCreate(false)} style={{
                padding: '10px 20px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: 'white',
                cursor: 'pointer',
              }}>
                {t('dashboard.cancel')}
              </button>
            </div>
          </div>
        )}

        {projects.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 20px',
            border: '2px dashed #d1d5db',
            borderRadius: '12px',
            textAlign: 'center',
          }}>
            <Icons.Box size={48} color="#d1d5db" />
            <h3 style={{ margin: '16px 0 8px', color: '#6b7280' }}>{t('dashboard.empty.title')}</h3>
            <p style={{ color: '#9ca3af', fontSize: '14px', maxWidth: '400px' }}>
              {t('dashboard.empty.desc')}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {projects.map(project => (
              <div
                key={project.id}
                onClick={() => handleOpenProject(project.id)}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(59,130,246,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <Icons.LayoutTemplate size={20} color="#3b82f6" />
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{project.name}</h3>
                </div>
                {project.description && (
                  <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#6b7280' }}>{project.description}</p>
                )}
                <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#9ca3af' }}>
                  <span>{(project.pages?.length || 0)} {t('dashboard.projectPages')}</span>
                  <span>{project.settings?.framework || 'react'}</span>
                  <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '48px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>{t('dashboard.features')}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
            {features.map(f => {
              const Icon = (Icons as any)[f.icon] || Icons.Box
              return (
                <div key={f.title} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                  <Icon size={20} color="#3b82f6" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 600 }}>{f.title}</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>{f.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

const features = [
  { title: 'Drag & Drop Editor', desc: 'Ziehe Komponenten per Drag & Drop auf die Leinwand', icon: 'Move' },
  { title: 'Live Vorschau', desc: 'Siehe Änderungen in Echtzeit auf Desktop, Tablet & Mobile', icon: 'Monitor' },
  { title: 'Code Export', desc: 'Exportiere als React, Vue, Svelte oder HTML+CSS', icon: 'FileDown' },
  { title: 'Eigenschaften-Panel', desc: 'Bearbeite alle Props und Styles visuell', icon: 'SlidersHorizontal' },
  { title: 'Versionierung', desc: 'Undo/Redo für jede Änderung', icon: 'History' },
  { title: 'Responsive Design', desc: 'Optimiere für alle Bildschirmgrößen', icon: 'Smartphone' },
]
