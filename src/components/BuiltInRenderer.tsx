import React from 'react'
import type { ComponentInstance } from '@/types'

const buttonVariants: Record<string, React.CSSProperties> = {
  primary: { backgroundColor: '#3b82f6', color: 'white', border: 'none' },
  secondary: { backgroundColor: '#6b7280', color: 'white', border: 'none' },
  outline: { backgroundColor: 'transparent', color: '#3b82f6', border: '2px solid #3b82f6' },
  ghost: { backgroundColor: 'transparent', color: '#3b82f6', border: 'none' },
}

const buttonSizes: Record<string, React.CSSProperties> = {
  sm: { padding: '6px 12px', fontSize: '14px' },
  md: { padding: '10px 20px', fontSize: '16px' },
  lg: { padding: '14px 28px', fontSize: '18px' },
}

const shadowMap: Record<string, string> = {
  none: 'none',
  sm: '0 1px 2px rgba(0,0,0,0.05)',
  md: '0 4px 6px rgba(0,0,0,0.07)',
  lg: '0 10px 15px rgba(0,0,0,0.1)',
}

export function getStyles(node: ComponentInstance): React.CSSProperties {
  return node.styles || {}
}

export function renderBuiltInComponent(node: ComponentInstance, children?: React.ReactNode): React.ReactNode {
  const p = node.props
  const s = getStyles(node)

  switch (node.type) {
    case 'Container':
      return (
        <div style={{
          width: p.width,
          maxWidth: p.maxWidth,
          padding: p.padding,
          margin: p.margin,
          backgroundColor: p.backgroundColor,
          borderRadius: p.borderRadius,
          boxShadow: shadowMap[p.shadow] || 'none',
          display: 'flex',
          flexDirection: p.flexDirection,
          justifyContent: p.justifyContent,
          alignItems: p.alignItems,
          minHeight: '40px',
          ...s,
        }}>
          {children}
        </div>
      )

    case 'Section':
      return (
        <section style={{
          backgroundColor: p.backgroundColor,
          padding: `${p.paddingY} ${p.paddingX}`,
          width: '100%',
          ...s,
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {children}
          </div>
        </section>
      )

    case 'Grid':
      return (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${p.columns}, 1fr)`,
          gap: p.gap,
          ...s,
        }}>
          {children}
        </div>
      )

    case 'Column':
      return (
        <div style={{
          gridColumn: `span ${p.span}`,
          ...s,
        }}>
          {children}
        </div>
      )

    case 'Heading': {
      const Tag = p.level as keyof JSX.IntrinsicElements
      return React.createElement(Tag, {
        style: {
          textAlign: p.align,
          color: p.color,
          fontSize: p.fontSize,
          fontWeight: p.fontWeight,
          margin: 0,
          ...s,
        },
      }, p.text)
    }

    case 'Text':
      return (
        <p style={{
          textAlign: p.align,
          color: p.color,
          fontSize: p.fontSize,
          lineHeight: p.lineHeight,
          margin: 0,
          ...s,
        }}>
          {p.content}
        </p>
      )

    case 'Button':
      return (
        <button style={{
          ...buttonVariants[p.variant] || buttonVariants.primary,
          ...buttonSizes[p.size] || buttonSizes.md,
          borderRadius: p.borderRadius,
          width: p.fullWidth ? '100%' : 'auto',
          cursor: 'pointer',
          fontWeight: 500,
          transition: 'all 0.2s',
          ...(p.variant !== 'primary' ? {} : {}),
          backgroundColor: p.variant === 'outline' || p.variant === 'ghost' ? 'transparent' : p.backgroundColor,
          color: p.variant === 'outline' || p.variant === 'ghost' ? p.backgroundColor : p.textColor,
          borderColor: p.variant === 'outline' ? p.backgroundColor : undefined,
          ...s,
        }}>
          {p.text}
        </button>
      )

    case 'Image':
      return (
        <img
          src={p.src}
          alt={p.alt}
          style={{
            width: p.width,
            height: p.height,
            objectFit: p.objectFit,
            borderRadius: p.borderRadius,
            display: 'block',
            ...s,
          }}
        />
      )

    case 'Input':
      return (
        <div style={{ marginBottom: '12px', ...s }}>
          {p.label && <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>{p.label}</label>}
          <input
            type={p.type}
            placeholder={p.placeholder}
            required={p.required}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      )

    case 'Textarea':
      return (
        <div style={{ marginBottom: '12px', ...s }}>
          {p.label && <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>{p.label}</label>}
          <textarea
            placeholder={p.placeholder}
            rows={p.rows}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px',
              outline: 'none',
              resize: 'vertical',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
          />
        </div>
      )

    case 'Video':
      if (!p.src) return <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f3f4f6', borderRadius: '8px', color: '#9ca3af', ...s }}>Video URL einfügen</div>
      return (
        <div style={{ width: p.width, position: 'relative', paddingBottom: p.aspectRatio, overflow: 'hidden', borderRadius: '8px', ...s }}>
          <iframe
            src={p.embedType === 'youtube' ? `https://www.youtube.com/embed/${extractYoutubeId(p.src)}` : p.src}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            allowFullScreen
          />
        </div>
      )

    case 'Divider':
      return <hr style={{ border: 'none', borderTop: `${p.thickness} solid ${p.color}`, margin: p.margin, ...s }} />

    case 'Spacer':
      return <div style={{ height: p.height, ...s }} />

    case 'Link':
      return (
        <a
          href={p.href}
          target={p.openInNewTab ? '_blank' : undefined}
          rel={p.openInNewTab ? 'noopener noreferrer' : undefined}
          style={{ color: p.color, textDecoration: 'underline', cursor: 'pointer', ...s }}
        >
          {p.text}
        </a>
      )

    case 'NavBar':
      return (
        <nav style={{
          backgroundColor: p.backgroundColor,
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          position: p.sticky ? 'sticky' : 'relative',
          top: 0,
          zIndex: 50,
          ...s,
        }}>
          <div style={{ fontWeight: 700, fontSize: '20px' }}>{p.brand}</div>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            {children}
          </div>
        </nav>
      )

    case 'Header':
      return (
        <header style={{
          backgroundColor: p.backgroundColor,
          height: p.height,
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          ...s,
        }}>
          {children}
        </header>
      )

    case 'Footer':
      return (
        <footer style={{
          backgroundColor: p.backgroundColor,
          color: p.textColor,
          padding: '48px 24px',
          ...s,
        }}>
          {children}
        </footer>
      )

    case 'Card':
      return (
        <div style={{
          backgroundColor: p.backgroundColor,
          borderRadius: p.borderRadius,
          boxShadow: shadowMap[p.shadow] || '0 4px 6px rgba(0,0,0,0.07)',
          padding: p.padding,
          ...s,
        }}>
          {children}
        </div>
      )

    case 'Form':
      return (
        <form style={{
          backgroundColor: p.backgroundColor,
          padding: p.padding,
          borderRadius: p.borderRadius,
          ...s,
        }} onSubmit={e => e.preventDefault()}>
          {children}
          <button type="submit" style={{
            marginTop: '16px',
            padding: '10px 24px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
          }}>
            {p.submitLabel}
          </button>
        </form>
      )

    case 'RawHTML':
      return <div dangerouslySetInnerHTML={{ __html: p.html }} style={s} />

    default:
      return <div style={{ padding: '16px', border: '1px dashed #ccc', color: '#999', ...s }}>{node.type}</div>
  }
}

function extractYoutubeId(url: string): string {
  const match = url.match(/(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  return match ? match[1] : url
}
