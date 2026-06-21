import React, { useEffect, useState } from 'react'
import { useEditorStore } from '@/store/editorStore'

interface Guide {
  orientation: 'horizontal' | 'vertical'
  position: number
  start: number
  end: number
}

interface AlignmentGuidesProps {
  containerRef: React.RefObject<HTMLDivElement | null>
}

export function AlignmentGuides({ containerRef }: AlignmentGuidesProps) {
  const { nodes, rootIds, selectedNodeId } = useEditorStore()
  const [guides, setGuides] = useState<Guide[]>([])

  useEffect(() => {
    if (!selectedNodeId || !containerRef.current) {
      setGuides([])
      return
    }

    const container = containerRef.current
    const selectedEl = container.querySelector(`[data-node-id="${selectedNodeId}"]`) as HTMLElement
    if (!selectedEl) {
      setGuides([])
      return
    }

    const selRect = selectedEl.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const newGuides: Guide[] = []
    const threshold = 8

    const allNodeEls = container.querySelectorAll('[data-node-id]')
    allNodeEls.forEach(el => {
      const id = el.getAttribute('data-node-id')
      if (id === selectedNodeId) return
      const rect = el.getBoundingClientRect()

      const relLeft = rect.left - containerRect.left
      const relRight = rect.right - containerRect.left
      const relTop = rect.top - containerRect.top
      const relBottom = rect.bottom - containerRect.top

      const selRelLeft = selRect.left - containerRect.left
      const selRelRight = selRect.right - containerRect.left
      const selRelTop = selRect.top - containerRect.top
      const selRelBottom = selRect.bottom - containerRect.top

      // Vertical alignment (left edges)
      if (Math.abs(selRelLeft - relLeft) < threshold) {
        newGuides.push({ orientation: 'vertical', position: selRelLeft, start: Math.min(selRelTop, relTop), end: Math.max(selRelBottom, relBottom) })
      }
      // Vertical alignment (right edges)
      if (Math.abs(selRelRight - relRight) < threshold) {
        newGuides.push({ orientation: 'vertical', position: selRelRight, start: Math.min(selRelTop, relTop), end: Math.max(selRelBottom, relBottom) })
      }
      // Horizontal alignment (top edges)
      if (Math.abs(selRelTop - relTop) < threshold) {
        newGuides.push({ orientation: 'horizontal', position: selRelTop, start: Math.min(selRelLeft, relLeft), end: Math.max(selRelRight, relRight) })
      }
      // Horizontal alignment (bottom edges)
      if (Math.abs(selRelBottom - relBottom) < threshold) {
        newGuides.push({ orientation: 'horizontal', position: selRelBottom, start: Math.min(selRelLeft, relLeft), end: Math.max(selRelRight, relRight) })
      }
      // Center vertical alignment
      const selCenterX = (selRelLeft + selRelRight) / 2
      const otherCenterX = (relLeft + relRight) / 2
      if (Math.abs(selCenterX - otherCenterX) < threshold) {
        newGuides.push({ orientation: 'vertical', position: selCenterX, start: Math.min(selRelTop, relTop), end: Math.max(selRelBottom, relBottom) })
      }
      // Center horizontal alignment
      const selCenterY = (selRelTop + selRelBottom) / 2
      const otherCenterY = (relTop + relBottom) / 2
      if (Math.abs(selCenterY - otherCenterY) < threshold) {
        newGuides.push({ orientation: 'horizontal', position: selCenterY, start: Math.min(selRelLeft, relLeft), end: Math.max(selRelRight, relRight) })
      }
    })

    setGuides(newGuides)
  }, [nodes, rootIds, selectedNodeId, containerRef])

  if (guides.length === 0) return null

  return (
    <>
      {guides.map((guide, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            backgroundColor: '#3b82f6',
            zIndex: 999,
            pointerEvents: 'none',
            ...(guide.orientation === 'vertical'
              ? {
                  left: `${guide.position}px`,
                  top: `${guide.start}px`,
                  width: '1px',
                  height: `${Math.max(guide.end - guide.start, 20)}px`,
                }
              : {
                  top: `${guide.position}px`,
                  left: `${guide.start}px`,
                  height: '1px',
                  width: `${Math.max(guide.end - guide.start, 20)}px`,
                }),
          }}
        />
      ))}
    </>
  )
}
