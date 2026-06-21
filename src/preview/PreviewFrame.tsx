import React from 'react'
import { useEditorStore } from '@/store/editorStore'
import { renderBuiltInComponent } from '@/components/BuiltInRenderer'

export function PreviewFrame() {
  const { nodes, rootIds } = useEditorStore()

  const renderNode = (id: string): React.ReactNode => {
    const node = nodes[id]
    if (!node) return null
    const children = node.children?.map(renderNode)
    return renderBuiltInComponent(node, children)
  }

  return (
    <div style={{
      maxWidth: '1200px', margin: '0 auto',
      backgroundColor: 'white', minHeight: '100vh',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    }}>
      {rootIds.map(id => renderNode(id))}
    </div>
  )
}
