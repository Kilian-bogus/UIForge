import React, { useState } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { useUIStore } from '@/store/uiStore'
import { exportProject, type ExportFormat } from '@/export'
import { cn } from '@/lib/cn'

export function ExportDialog() {
  const { nodes, rootIds } = useEditorStore()
  const { exportDialogOpen, setExportDialog, addToast } = useUIStore()
  const [format, setFormat] = useState<ExportFormat>('react')
  const [copied, setCopied] = useState(false)

  if (!exportDialogOpen) return null

  const result = exportProject(nodes, rootIds, format)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      addToast('Code in Zwischenablage kopiert', 'success')
    } catch {
      addToast('Konnte nicht kopiert werden', 'error')
    }
  }

  const handleDownload = () => {
    const blob = new Blob([result.code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = result.files[0]?.name || 'export.txt'
    a.click()
    URL.revokeObjectURL(url)
    addToast('Datei heruntergeladen', 'success')
  }

  const formats: { key: ExportFormat; label: string; desc: string }[] = [
    { key: 'react', label: 'React (JSX)', desc: 'React-Komponente mit Inline-Styles' },
    { key: 'react-ts', label: 'React (TypeScript)', desc: 'React-Komponente mit TypeScript' },
    { key: 'html', label: 'HTML + CSS', desc: 'Reines HTML mit Inline-Styles' },
  ]

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    }} onClick={() => setExportDialog(false)}>
      <div style={{
        backgroundColor: 'white', borderRadius: '12px', width: '90%', maxWidth: '900px',
        maxHeight: '85vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      }} onClick={e => e.stopPropagation()}>
        
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Code exportieren</h2>
          <button onClick={() => setExportDialog(false)} style={{ padding: '4px 8px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px', color: '#6b7280' }}>✕</button>
        </div>

        <div style={{ display: 'flex', gap: '8px', padding: '12px 24px', borderBottom: '1px solid #f3f4f6' }}>
          {formats.map(f => (
            <button
              key={f.key}
              onClick={() => setFormat(f.key)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: `1px solid ${format === f.key ? '#3b82f6' : '#e5e7eb'}`,
                backgroundColor: format === f.key ? '#eff6ff' : 'white',
                color: format === f.key ? '#3b82f6' : '#374151',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: format === f.key ? 600 : 400,
                textAlign: 'left',
              }}
            >
              <div style={{ fontWeight: 600 }}>{f.label}</div>
              <div style={{ fontSize: '11px', color: format === f.key ? '#93c5fd' : '#9ca3af', marginTop: '2px' }}>{f.desc}</div>
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px', backgroundColor: '#1f2937', minHeight: '300px' }}>
          <pre style={{
            margin: 0, padding: '16px',
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: '13px', lineHeight: 1.5,
            color: '#e5e7eb',
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            <code>{result.code}</code>
          </pre>
        </div>

        <div style={{ padding: '12px 24px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>
            {result.files.length} Datei{result.files.length !== 1 ? 'en' : ''} · ~{Math.ceil(result.code.length / 1000)} KB
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleCopy} style={btnStyle}>
              {copied ? '✓ Kopiert!' : 'In Zwischenablage'}
            </button>
            <button onClick={handleDownload} style={{ ...btnStyle, backgroundColor: '#3b82f6', color: 'white' }}>
              Herunterladen
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const btnStyle: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  backgroundColor: 'white',
  color: '#374151',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: 500,
}
