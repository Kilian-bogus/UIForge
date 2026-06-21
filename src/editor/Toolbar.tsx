import React from 'react'
import { useEditorStore } from '@/store/editorStore'
import { useUIStore } from '@/store/uiStore'
import { useProjectStore } from '@/store/projectStore'
import { useTranslation } from '@/store/i18nStore'
import { useI18nStore } from '@/store/i18nStore'
import * as Icons from 'lucide-react'

interface ToolbarProps {
  onNavigate?: (page: string) => void
}

export function Toolbar({ onNavigate }: ToolbarProps) {
  const { undo, redo, canUndo, canRedo, viewMode, setViewMode, zoom, setZoom, copySelected, pasteClipboard, clipboard, selectedNodeId, duplicateComponent } = useEditorStore()
  const { toggleSidebar, toggleRightPanel, sidebarOpen, rightPanelOpen, setExportDialog, setSettingsDialog, addToast } = useUIStore()
  const { getCurrentProject } = useProjectStore()
  const { t } = useTranslation()
  const { language, setLanguage } = useI18nStore()
  const project = getCurrentProject()

  const handleSave = () => {
    useEditorStore.getState().saveToStorage()
    useProjectStore.getState().saveToStorage()
    addToast(t('toast.saved'), 'success')
  }

  const handleExport = () => {
    setExportDialog(true)
  }

  const toggleLanguage = () => {
    setLanguage(language === 'de' ? 'en' : 'de')
  }

  return (
    <div style={{
      height: '48px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      padding: '0 12px',
      gap: '4px',
      justifyContent: 'space-between',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {onNavigate && (
          <ToolbarButton onClick={() => onNavigate('dashboard')} title={t('editor.toolbar.back')} icon={<Icons.ArrowLeft size={16} />} />
        )}
        <button onClick={toggleSidebar} style={toolBtn(sidebarOpen)} title="Palette ein/aus">
          <Icons.PanelLeft size={16} />
        </button>

        <div style={{ width: '1px', height: '24px', backgroundColor: '#e5e7eb', margin: '0 4px' }} />

        <ToolbarButton onClick={undo} disabled={!canUndo()} title={t('editor.toolbar.undo')} icon={<Icons.Undo2 size={16} />} />
        <ToolbarButton onClick={redo} disabled={!canRedo()} title={t('editor.toolbar.redo')} icon={<Icons.Redo2 size={16} />} />

        <div style={{ width: '1px', height: '24px', backgroundColor: '#e5e7eb', margin: '0 4px' }} />

        <ToolbarButton onClick={copySelected} disabled={!selectedNodeId} title={t('editor.toolbar.copy')} icon={<Icons.Copy size={16} />} />
        <ToolbarButton onClick={pasteClipboard} disabled={!clipboard} title={t('editor.toolbar.paste')} icon={<Icons.ClipboardPaste size={16} />} />
        <ToolbarButton onClick={() => selectedNodeId && duplicateComponent(selectedNodeId)} disabled={!selectedNodeId} title={t('editor.toolbar.duplicate')} icon={<Icons.CopyPlus size={16} />} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>{project?.name || 'Projekt'}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <div style={{ display: 'flex', border: '1px solid #e5e7eb', borderRadius: '6px', overflow: 'hidden' }}>
          <button onClick={() => setViewMode('editor')} style={viewBtn(viewMode === 'editor')} title={t('editor.toolbar.desktop')}>
            <Icons.Monitor size={14} />
          </button>
          <button onClick={() => setViewMode('tablet')} style={viewBtn(viewMode === 'tablet')} title={t('editor.toolbar.tablet')}>
            <Icons.Tablet size={14} />
          </button>
          <button onClick={() => setViewMode('mobile')} style={viewBtn(viewMode === 'mobile')} title={t('editor.toolbar.mobile')}>
            <Icons.Smartphone size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginLeft: '4px' }}>
          <button onClick={() => setZoom(Math.max(25, zoom - 10))} style={toolBtn(false)} title={t('editor.toolbar.zoomOut')}>
            <Icons.ZoomOut size={14} />
          </button>
          <span style={{ fontSize: '12px', color: '#6b7280', minWidth: '40px', textAlign: 'center' }}>{zoom}%</span>
          <button onClick={() => setZoom(Math.min(200, zoom + 10))} style={toolBtn(false)} title={t('editor.toolbar.zoomIn')}>
            <Icons.ZoomIn size={14} />
          </button>
        </div>

        {/* Language Switcher */}
        <ToolbarButton onClick={toggleLanguage} title={t('editor.toolbar.language')} icon={
          <span style={{ fontSize: '13px', fontWeight: 700 }}>{language === 'de' ? 'DE' : 'EN'}</span>
        } />

        <div style={{ width: '1px', height: '24px', backgroundColor: '#e5e7eb', margin: '0 4px' }} />

        <ToolbarButton onClick={handleSave} title={t('editor.toolbar.save')} icon={<Icons.Save size={16} />} />
        <ToolbarButton onClick={handleExport} title={t('editor.toolbar.export')} icon={<Icons.FileDown size={16} />} />
        <ToolbarButton onClick={() => setSettingsDialog(true)} title={t('editor.toolbar.settings')} icon={<Icons.Settings size={16} />} />

        <div style={{ width: '1px', height: '24px', backgroundColor: '#e5e7eb', margin: '0 4px' }} />

        <button onClick={toggleRightPanel} style={toolBtn(rightPanelOpen)} title="Eigenschaften ein/aus">
          <Icons.PanelRight size={16} />
        </button>
      </div>
    </div>
  )
}

function ToolbarButton({ onClick, disabled, title, icon }: { onClick: () => void; disabled?: boolean; title: string; icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        padding: '6px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: 'transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: disabled ? '#d1d5db' : '#374151',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s',
        opacity: disabled ? 0.5 : 1,
      }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.backgroundColor = '#f3f4f6'; e.currentTarget.style.color = '#111827' } }}
      onMouseLeave={e => { if (!disabled) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#374151' } }}
    >
      {icon}
    </button>
  )
}

function toolBtn(active: boolean): React.CSSProperties {
  return {
    padding: '6px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: active ? '#eff6ff' : 'transparent',
    cursor: 'pointer',
    color: active ? '#3b82f6' : '#6b7280',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s',
  }
}

function viewBtn(active: boolean): React.CSSProperties {
  return {
    padding: '5px 10px',
    border: 'none',
    backgroundColor: active ? '#3b82f6' : 'transparent',
    cursor: 'pointer',
    color: active ? 'white' : '#6b7280',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s',
  }
}
