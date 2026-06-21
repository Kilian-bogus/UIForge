import React, { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import type { ComponentDefinition } from '@/types'
import { getAllComponentDefinitions, getCategories } from '@/components/registry'
import * as Icons from 'lucide-react'
import { useTranslation } from '@/store/i18nStore'
import { useUIStore } from '@/store/uiStore'

function DraggableCard({ def }: { def: ComponentDefinition }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `new-${def.type}`,
    data: { type: 'new-component', componentType: def.type },
  })

  const IconComponent = (Icons as any)[def.icon] || Icons.Box

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        padding: '10px 6px',
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        cursor: isDragging ? 'grabbing' : 'grab',
        backgroundColor: 'white',
        transition: 'all 0.15s',
        fontSize: '11px',
        color: '#374151',
        userSelect: 'none',
        opacity: isDragging ? 0.4 : 1,
        position: 'relative',
      }}
      onMouseEnter={e => {
        if (!isDragging) {
          e.currentTarget.style.borderColor = '#3b82f6'
          e.currentTarget.style.boxShadow = '0 0 0 2px rgba(59,130,246,0.15)'
        }
      }}
      onMouseLeave={e => {
        if (!isDragging) {
          e.currentTarget.style.borderColor = '#e5e7eb'
          e.currentTarget.style.boxShadow = 'none'
        }
      }}
    >
      <IconComponent size={18} />
      <span style={{ textAlign: 'center', lineHeight: 1.2 }}>{def.label}</span>
    </div>
  )
}

export function ComponentPalette() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const customComponentVersion = useUIStore(s => s.customComponentVersion)
  const categories = getCategories()
  const all = getAllComponentDefinitions()
  void customComponentVersion // force re-render when custom components change

  const filtered = all.filter(c => {
    const matchesSearch = !search || c.label.toLowerCase().includes(search.toLowerCase()) || c.type.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !activeCategory || c.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>
        <input
          type="text"
          placeholder={t('editor.palette.search')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '13px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '4px', padding: '8px 12px', borderBottom: '1px solid #e5e7eb', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveCategory(null)}
          style={{
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '12px',
            border: '1px solid #e5e7eb',
            backgroundColor: activeCategory === null ? '#3b82f6' : 'transparent',
            color: activeCategory === null ? 'white' : '#374151',
            cursor: 'pointer',
          }}
        >
          {t('editor.palette.all')}
        </button>
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(activeCategory === cat.key ? null : cat.key)}
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '12px',
              border: '1px solid #e5e7eb',
              backgroundColor: activeCategory === cat.key ? '#3b82f6' : 'transparent',
              color: activeCategory === cat.key ? 'white' : '#374151',
              cursor: 'pointer',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          {filtered.map(def => (
            <DraggableCard key={def.type} def={def} />
          ))}
        </div>
      </div>
    </div>
  )
}
