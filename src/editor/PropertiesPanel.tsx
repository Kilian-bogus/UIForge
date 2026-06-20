import React from 'react'
import { useEditorStore } from '@/store/editorStore'
import { getComponentDefinition } from '@/components/registry'
import type { PropDefinition } from '@/types'

const propInputs: Record<string, React.FC<{ prop: PropDefinition; value: any; onChange: (v: any) => void }>> = {
  string: ({ prop, value, onChange }) => (
    <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={prop.placeholder}
      style={inputStyle} />
  ),
  text: ({ prop, value, onChange }) => (
    <textarea value={value || ''} onChange={e => onChange(e.target.value)} placeholder={prop.placeholder}
      rows={3} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
  ),
  number: ({ prop, value, onChange }) => (
    <input type="number" value={value ?? 0} onChange={e => onChange(Number(e.target.value))} min={prop.min} max={prop.max}
      style={inputStyle} />
  ),
  boolean: ({ prop, value, onChange }) => (
    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
      <input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)}
        style={{ width: '16px', height: '16px', accentColor: '#3b82f6' }} />
      Aktiviert
    </label>
  ),
  color: ({ prop, value, onChange }) => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <input type="color" value={value || '#000000'} onChange={e => onChange(e.target.value)}
        style={{ width: '36px', height: '36px', padding: 0, border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', background: 'none' }} />
      <input type="text" value={value || ''} onChange={e => onChange(e.target.value)}
        style={{ ...inputStyle, flex: 1, fontFamily: 'monospace', fontSize: '12px' }} />
    </div>
  ),
  select: ({ prop, value, onChange }) => (
    <select value={value || ''} onChange={e => onChange(e.target.value)} style={inputStyle}>
      {prop.options?.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  ),
  slider: ({ prop, value, onChange }) => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <input type="range" min={prop.min ?? 0} max={prop.max ?? 100} step={prop.step ?? 1}
        value={value ?? 0} onChange={e => onChange(Number(e.target.value))}
        style={{ flex: 1, accentColor: '#3b82f6' }} />
      <span style={{ fontSize: '12px', color: '#6b7280', minWidth: '30px', textAlign: 'right' }}>{value}</span>
    </div>
  ),
  size: ({ prop, value, onChange }) => (
    <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder="auto"
      style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '12px' }} />
  ),
  url: ({ prop, value, onChange }) => (
    <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder="https://..."
      style={inputStyle} />
  ),
  image: ({ prop, value, onChange }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {value && <img src={value} alt="" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e5e7eb' }} />}
      <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder="Bild-URL"
        style={inputStyle} />
    </div>
  ),
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '6px 10px',
  border: '1px solid #d1d5db',
  borderRadius: '4px',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box',
  backgroundColor: 'white',
}

export function PropertiesPanel() {
  const selectedNodeId = useEditorStore(s => s.selectedNodeId)
  const nodes = useEditorStore(s => s.nodes)
  const updateProps = useEditorStore(s => s.updateComponentProps)

  const node = selectedNodeId ? nodes[selectedNodeId] : null
  const def = node ? getComponentDefinition(node.type) : null

  if (!node || !def) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
        <p>Keine Komponente ausgewählt</p>
        <p style={{ marginTop: '8px', fontSize: '12px' }}>
          Klicke auf eine Komponente im Canvas, um ihre Eigenschaften zu bearbeiten
        </p>
      </div>
    )
  }

  const groupedProps: Record<string, PropDefinition[]> = {}
  def.props.forEach(prop => {
    const group = prop.group || 'Allgemein'
    if (!groupedProps[group]) groupedProps[group] = []
    groupedProps[group].push(prop)
  })

  const handleChange = (name: string, value: any) => {
    updateProps(node.id, { [name]: value })
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#111827' }}>
          {def.label}
        </h3>
        <span style={{ fontSize: '11px', color: '#9ca3af', fontFamily: 'monospace' }}>{node.id.slice(0, 8)}</span>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '12px' }}>
        {Object.entries(groupedProps).map(([group, props]) => (
          <div key={group} style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {group}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {props.map(prop => {
                const InputComponent = propInputs[prop.type]
                if (!InputComponent) return null
                return (
                  <div key={prop.name}>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 500, color: '#374151' }}>
                      {prop.label}
                    </label>
                    <InputComponent prop={prop} value={node.props[prop.name] ?? prop.defaultValue} onChange={v => handleChange(prop.name, v)} />
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
