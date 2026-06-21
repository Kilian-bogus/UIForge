import React from 'react'
import { useProjectStore } from '@/store/projectStore'
import { useUIStore } from '@/store/uiStore'
import { useTranslation } from '@/store/i18nStore'

export function SettingsPage() {
  const { settingsDialogOpen, setSettingsDialog } = useUIStore()
  const { getCurrentProject, updateProjectSettings } = useProjectStore()
  const { t } = useTranslation()
  const project = getCurrentProject()

  if (!settingsDialogOpen) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    }} onClick={() => setSettingsDialog(false)}>
      <div style={{
        backgroundColor: 'white', borderRadius: '12px', width: '90%', maxWidth: '500px',
        padding: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      }} onClick={e => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{t('editor.settings.title')}</h2>
          <button onClick={() => setSettingsDialog(false)} style={{ padding: '4px 8px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px', color: '#6b7280' }}>✕</button>
        </div>

        {project && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 }}>{t('editor.settings.name')}</label>
              <input type="text" value={project.name} readOnly
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', backgroundColor: '#f9fafb' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 }}>{t('editor.settings.framework')}</label>
              <select value={project.settings.framework}
                onChange={e => updateProjectSettings({ framework: e.target.value as any })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}>
                <option value="react">{t('settings.framework.react')}</option>
                <option value="vue">{t('settings.framework.vue')}</option>
                <option value="svelte">{t('settings.framework.svelte')}</option>
                <option value="html">HTML + CSS</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 }}>{t('editor.settings.styling')}</label>
              <select value={project.settings.styling}
                onChange={e => updateProjectSettings({ styling: e.target.value as any })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}>
                <option value="inline">{t('settings.styling.inline')}</option>
                <option value="tailwind">{t('settings.styling.tailwind')}</option>
                <option value="css">{t('settings.styling.css')}</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 }}>{t('editor.settings.theme')} - Primärfarbe</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="color" value={project.settings.theme.primaryColor}
                  onChange={e => updateProjectSettings({ theme: { ...project.settings.theme, primaryColor: e.target.value } })}
                  style={{ width: '40px', height: '40px', padding: 0, border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }} />
                <input type="text" value={project.settings.theme.primaryColor}
                  onChange={e => updateProjectSettings({ theme: { ...project.settings.theme, primaryColor: e.target.value } })}
                  style={{ flex: 1, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', fontFamily: 'monospace' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 }}>Schriftart</label>
              <input type="text" value={project.settings.theme.fontFamily}
                onChange={e => updateProjectSettings({ theme: { ...project.settings.theme, fontFamily: e.target.value } })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
            </div>
          </div>
        )}

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => setSettingsDialog(false)}
            style={{ padding: '8px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>
            Schließen
          </button>
        </div>
      </div>
    </div>
  )
}
