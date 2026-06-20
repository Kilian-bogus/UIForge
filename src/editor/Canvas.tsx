import React, { useCallback, useRef, useState } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { renderBuiltInComponent } from '@/components/BuiltInRenderer'
import { getComponentDefinition } from '@/components/registry'

export function Canvas() {
  const { nodes, rootIds, selectedNodeId, hoveredNodeId, selectNode, hoverNode, addComponent, removeComponent, moveComponent, viewMode, zoom } = useEditorStore()
  const setDragging = useEditorStore(s => s.setDragging)
  const [dropIndicator, setDropIndicator] = useState<{ parentId: string | null; index: number } | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    setDragging(true)
  }, [setDragging])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (canvasRef.current && !canvasRef.current.contains(e.relatedTarget as Node)) {
      setDropIndicator(null)
      setDragging(false)
    }
  }, [setDragging])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    setDropIndicator(null)
    const type = e.dataTransfer.getData('text/plain')
    if (type) {
      addComponent(type as any, null)
    }
  }, [addComponent])

  const viewModeStyles: React.CSSProperties = {
    width: viewMode === 'mobile' ? '375px' : viewMode === 'tablet' ? '768px' : '100%',
    minHeight: viewMode === 'mobile' || viewMode === 'tablet' ? '812px' : '100%',
    margin: viewMode !== 'editor' ? '24px auto' : 0,
    borderRadius: viewMode !== 'editor' ? '12px' : 0,
    boxShadow: viewMode !== 'editor' ? '0 0 0 1px #e5e7eb, 0 20px 60px rgba(0,0,0,0.1)' : 'none',
    transition: 'all 0.3s ease',
  }

  const renderNode = (nodeId: string, depth = 0): React.ReactNode => {
    const node = nodes[nodeId]
    if (!node) return null

    const def = getComponentDefinition(node.type)
    const isSelected = selectedNodeId === nodeId
    const isHovered = hoveredNodeId === nodeId

    const childElements = node.children?.map(childId => renderNode(childId, depth + 1))

    const rendered = renderBuiltInComponent(node, childElements)

    return (
      <div
        key={nodeId}
        data-node-id={nodeId}
        onClick={e => {
          e.stopPropagation()
          selectNode(nodeId)
        }}
        onMouseEnter={() => hoverNode(nodeId)}
        onMouseLeave={() => hoverNode(null)}
        onDragOver={e => {
          e.preventDefault()
          e.stopPropagation()
          if (def?.canHaveChildren) {
            e.dataTransfer.dropEffect = 'copy'
            setDropIndicator({ parentId: nodeId, index: node.children.length })
          }
        }}
        onDrop={e => {
          e.preventDefault()
          e.stopPropagation()
          const type = e.dataTransfer.getData('text/plain')
          if (type && def?.canHaveChildren) {
            addComponent(type as any, nodeId)
          }
        }}
        style={{
          position: 'relative',
          outline: isSelected ? '2px solid #3b82f6' : isHovered && !isSelected ? '2px dashed #93c5fd' : '2px solid transparent',
          outlineOffset: '-1px',
          borderRadius: '2px',
          cursor: 'pointer',
          minHeight: def?.canHaveChildren ? '30px' : undefined,
          transition: 'outline 0.1s',
        }}
      >
        {isSelected && (
          <div style={{
            position: 'absolute',
            top: '-24px',
            right: 0,
            display: 'flex',
            gap: '2px',
            zIndex: 100,
          }}>
            <button
              onClick={e => { e.stopPropagation(); useEditorStore.getState().duplicateComponent(nodeId) }}
              style={{ padding: '2px 6px', fontSize: '10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
              title="Duplizieren"
            >
              ⧉
            </button>
            <button
              onClick={e => { e.stopPropagation(); removeComponent(nodeId) }}
              style={{ padding: '2px 6px', fontSize: '10px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
              title="Löschen"
            >
              ✕
            </button>
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            top: '-14px',
            left: '4px',
            fontSize: '9px',
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '1px 5px',
            borderRadius: '3px',
            opacity: isHovered || isSelected ? 1 : 0,
            transition: 'opacity 0.15s',
            zIndex: 100,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          {node.type}
        </div>
        {rendered}
      </div>
    )
  }

  return (
    <div
      style={{
        flex: 1,
        overflow: 'auto',
        backgroundColor: viewMode === 'editor' ? '#f3f4f6' : '#e5e7eb',
        display: 'flex',
        justifyContent: 'center',
        padding: viewMode !== 'editor' ? '40px 0' : 0,
      }}
    >
      <div
        ref={canvasRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => selectNode(null)}
        style={{
          ...viewModeStyles,
          backgroundColor: 'white',
          padding: '24px',
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top center',
          position: 'relative',
          minHeight: viewMode === 'editor' ? '100%' : '812px',
        }}
      >
        {rootIds.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px',
              border: '2px dashed #d1d5db',
              borderRadius: '8px',
              color: '#9ca3af',
              textAlign: 'center',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: '40px' }}>+</div>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>Canvas ist leer</p>
            <p style={{ margin: 0, fontSize: '13px', maxWidth: '300px' }}>
              Ziehe Komponenten aus der Palette hierher oder klicke auf "Hinzufügen"
            </p>
          </div>
        ) : (
          rootIds.map(id => renderNode(id))
        )}

        {dropIndicator && (
          <div style={{
            height: '3px',
            backgroundColor: '#3b82f6',
            margin: '4px 0',
            borderRadius: '2px',
          }} />
        )}
      </div>
    </div>
  )
}
