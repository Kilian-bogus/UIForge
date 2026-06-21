import React, { useCallback, useRef, useState } from 'react'
import { useEditorStore } from '@/store/editorStore'

interface ResizeHandleProps {
  nodeId: string
  direction: 'se' | 'sw' | 'ne' | 'nw' | 'e' | 'w' | 'n' | 's'
  onResize: (nodeId: string, width: string, height: string) => void
}

export function ResizeHandle({ nodeId, direction, onResize }: ResizeHandleProps) {
  const startPos = useRef({ x: 0, y: 0 })
  const startDims = useRef({ width: 0, height: 0 })
  const [resizing, setResizing] = useState(false)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setResizing(true)
    startPos.current = { x: e.clientX, y: e.clientY }

    const el = (e.currentTarget as HTMLElement).closest('[data-node-id]') as HTMLElement
    if (el) {
      startDims.current = {
        width: el.offsetWidth,
        height: el.offsetHeight,
      }
    }

    const handleMouseMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startPos.current.x
      const dy = ev.clientY - startPos.current.y
      let newW = startDims.current.width
      let newH = startDims.current.height

      if (direction.includes('e')) newW = Math.max(20, newW + dx)
      if (direction.includes('w')) newW = Math.max(20, newW - dx)
      if (direction.includes('s')) newH = Math.max(20, newH + dy)
      if (direction.includes('n')) newH = Math.max(20, newH - dy)

      onResize(nodeId, `${newW}px`, `${newH}px`)
    }

    const handleMouseUp = () => {
      setResizing(false)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }, [nodeId, direction, onResize])

  const cursorMap: Record<string, string> = {
    n: 'ns-resize', s: 'ns-resize',
    e: 'ew-resize', w: 'ew-resize',
    ne: 'nesw-resize', sw: 'nesw-resize',
    nw: 'nwse-resize', se: 'nwse-resize',
  }

  const posMap: Record<string, React.CSSProperties> = {
    n: { top: '-3px', left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' },
    s: { bottom: '-3px', left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' },
    e: { right: '-3px', top: '50%', transform: 'translateY(-50%)', cursor: 'ew-resize' },
    w: { left: '-3px', top: '50%', transform: 'translateY(-50%)', cursor: 'ew-resize' },
    ne: { top: '-3px', right: '-3px', cursor: 'nesw-resize' },
    nw: { top: '-3px', left: '-3px', cursor: 'nwse-resize' },
    se: { bottom: '-3px', right: '-3px', cursor: 'nwse-resize' },
    sw: { bottom: '-3px', left: '-3px', cursor: 'nesw-resize' },
  }

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        width: '8px',
        height: '8px',
        backgroundColor: resizing ? '#3b82f6' : 'white',
        border: '2px solid #3b82f6',
        borderRadius: '2px',
        zIndex: 200,
        opacity: 1,
        ...posMap[direction],
      }}
    />
  )
}
