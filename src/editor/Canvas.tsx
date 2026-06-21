import React, { useCallback, useRef } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { useEditorStore } from '@/store/editorStore'
import { renderBuiltInComponent } from '@/components/BuiltInRenderer'
import { getComponentDefinition } from '@/components/registry'
import { ResizeHandle } from './ResizeHandle'
import { AlignmentGuides } from './AlignmentGuides'
import { useTranslation } from '@/store/i18nStore'

function DroppableCanvasInner({ children, viewMode, isOver }: { children: React.ReactNode; viewMode: string; isOver: boolean }) {
  return (
    <div
      style={{
        flex: 1,
        overflow: 'auto',
        backgroundColor: isOver ? '#e0f2fe' : (viewMode === 'editor' ? '#f3f4f6' : '#e5e7eb'),
        display: 'flex',
        justifyContent: 'center',
        padding: viewMode !== 'editor' ? '40px 0' : 0,
        transition: 'background-color 0.15s',
      }}
    >
      {children}
    </div>
  )
}

function DroppableNode({ nodeId, children, canHaveChildren }: { nodeId: string; children: React.ReactNode; canHaveChildren?: boolean }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `node-${nodeId}`,
    data: { parentId: nodeId },
    disabled: !canHaveChildren,
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        minHeight: canHaveChildren ? '30px' : undefined,
        outline: isOver ? '2px dashed #3b82f6' : undefined,
        outlineOffset: isOver ? '-1px' : undefined,
        borderRadius: isOver ? '4px' : undefined,
        transition: 'outline 0.1s, background-color 0.15s',
      }}
    >
      {children}
    </div>
  )
}

export function Canvas() {
  const { t } = useTranslation()
  const { nodes, rootIds, selectedNodeId, hoveredNodeId, selectNode, hoverNode, removeComponent, viewMode, zoom } = useEditorStore()
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
    data: { parentId: null },
  })
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleCanvasClick = useCallback(() => {
    selectNode(null)
  }, [selectNode])

  const viewModeStyles: React.CSSProperties = {
    width: viewMode === 'mobile' ? '375px' : viewMode === 'tablet' ? '768px' : '100%',
    minHeight: viewMode === 'mobile' || viewMode === 'tablet' ? '812px' : '100%',
    margin: viewMode !== 'editor' ? '24px auto' : 0,
    borderRadius: viewMode !== 'editor' ? '12px' : 0,
    boxShadow: viewMode !== 'editor' ? '0 0 0 1px #e5e7eb, 0 20px 60px rgba(0,0,0,0.1)' : 'none',
    transition: 'all 0.3s ease',
  }

  const handleResize = useCallback((nodeId: string, width: string, height: string) => {
    useEditorStore.getState().updateComponentStyles(nodeId, { width, height })
  }, [])

  const renderNode = (nodeId: string): React.ReactNode => {
    const node = nodes[nodeId]
    if (!node) return null

    const def = getComponentDefinition(node.type)
    const isSelected = selectedNodeId === nodeId
    const isHovered = hoveredNodeId === nodeId

    const childElements = node.children?.map(childId => renderNode(childId))

    const rendered = renderBuiltInComponent(node, childElements)

    const inner = (
      <div
        data-node-id={nodeId}
        onClick={e => {
          e.stopPropagation()
          selectNode(nodeId)
        }}
        onMouseEnter={() => hoverNode(nodeId)}
        onMouseLeave={() => hoverNode(null)}
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
          <>
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
                title={t('editor.duplicate')}
              >
                ⧉
              </button>
              <button
                onClick={e => { e.stopPropagation(); removeComponent(nodeId) }}
                style={{ padding: '2px 6px', fontSize: '10px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                title={t('editor.delete')}
              >
                ✕
              </button>
            </div>
            <ResizeHandle nodeId={nodeId} direction="se" onResize={handleResize} />
            <ResizeHandle nodeId={nodeId} direction="sw" onResize={handleResize} />
            <ResizeHandle nodeId={nodeId} direction="ne" onResize={handleResize} />
            <ResizeHandle nodeId={nodeId} direction="nw" onResize={handleResize} />
            <ResizeHandle nodeId={nodeId} direction="e" onResize={handleResize} />
            <ResizeHandle nodeId={nodeId} direction="w" onResize={handleResize} />
            <ResizeHandle nodeId={nodeId} direction="n" onResize={handleResize} />
            <ResizeHandle nodeId={nodeId} direction="s" onResize={handleResize} />
          </>
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

    if (def?.canHaveChildren) {
      return (
        <DroppableNode key={nodeId} nodeId={nodeId} canHaveChildren={def.canHaveChildren}>
          {inner}
        </DroppableNode>
      )
    }

    return <div key={nodeId}>{inner}</div>
  }

  return (
    <DroppableCanvasInner viewMode={viewMode} isOver={isOver}>
      <div
        ref={(el) => {
          setNodeRef(el)
          ;(canvasRef as any).current = el
        }}
        onClick={handleCanvasClick}
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
            <p style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>{t('editor.canvas.empty')}</p>
            <p style={{ margin: 0, fontSize: '13px', maxWidth: '300px' }}>
              {t('editor.canvas.emptyHint')}
            </p>
          </div>
        ) : (
          rootIds.map(id => renderNode(id))
        )}

        <AlignmentGuides containerRef={canvasRef} />
      </div>
    </DroppableCanvasInner>
  )
}
