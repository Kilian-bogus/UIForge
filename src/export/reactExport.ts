import type { ComponentInstance } from '@/types'
import { getComponentDefinition } from '@/components/registry'

export function generateReactCode(nodes: Record<string, ComponentInstance>, rootIds: string[]): string {
  const imports = new Set<string>()
  imports.add('import React from \'react\'')
  imports.add('import \'./styles.css\'')

  const renderNode = (id: string, indent = 0): string => {
    const node = nodes[id]
    if (!node) return ''
    const def = getComponentDefinition(node.type)
    if (!def) return `{/* Unknown: ${node.type} */}`

    const p = node.props
    const childContent = node.children.map(cid => renderNode(cid, indent + 1)).join('\n')
    const ind = '  '.repeat(indent)

    switch (node.type) {
      case 'Container': {
        const style = inlineStyle({
          width: p.width,
          maxWidth: p.maxWidth,
          padding: p.padding,
          margin: p.margin,
          backgroundColor: p.backgroundColor,
          borderRadius: p.borderRadius,
          boxShadow: p.shadow !== 'none' ? `var(--shadow-${p.shadow})` : 'none',
          display: 'flex',
          flexDirection: p.flexDirection,
          justifyContent: p.justifyContent,
          alignItems: p.alignItems,
        })
        return `${ind}<div style={${style}}>\n${childContent}\n${ind}</div>`
      }

      case 'Section': {
        const style = inlineStyle({
          backgroundColor: p.backgroundColor,
          padding: `${p.paddingY} ${p.paddingX}`,
        })
        return `${ind}<section style={${style}}>\n${ind}  <div className="container">\n${childContent}\n${ind}  </div>\n${ind}</section>`
      }

      case 'Grid': {
        const style = inlineStyle({
          display: 'grid',
          gridTemplateColumns: `repeat(${p.columns}, 1fr)`,
          gap: p.gap,
        })
        return `${ind}<div style={${style}}>\n${childContent}\n${ind}</div>`
      }

      case 'Heading': {
        const Tag = p.level
        const style = inlineStyle({ textAlign: p.align, color: p.color, fontSize: p.fontSize, fontWeight: p.fontWeight })
        return `${ind}<${Tag} style={${style}}>${escapeHtml(p.text)}</${Tag}>`
      }

      case 'Text': {
        const style = inlineStyle({ textAlign: p.align, color: p.color, fontSize: p.fontSize, lineHeight: p.lineHeight })
        return `${ind}<p style={${style}}>${escapeHtml(p.content)}</p>`
      }

      case 'Button': {
        const style = inlineStyle({
          borderRadius: p.borderRadius,
          width: p.fullWidth ? '100%' : 'auto',
          backgroundColor: p.variant === 'outline' || p.variant === 'ghost' ? 'transparent' : p.backgroundColor,
          color: p.variant === 'outline' || p.variant === 'ghost' ? p.backgroundColor : p.textColor,
          border: p.variant === 'outline' ? `2px solid ${p.backgroundColor}` : 'none',
          padding: sizeMap[p.size]?.padding || '10px 20px',
          fontSize: sizeMap[p.size]?.fontSize || '16px',
          cursor: 'pointer',
          fontWeight: 500,
        })
        return `${ind}<button style={${style}}>${escapeHtml(p.text)}</button>`
      }

      case 'Image': {
        const style = inlineStyle({
          width: p.width,
          height: p.height,
          objectFit: p.objectFit,
          borderRadius: p.borderRadius,
        })
        return `${ind}<img src="${escapeAttr(p.src)}" alt="${escapeAttr(p.alt)}" style={${style}} />`
      }

      case 'Input': {
        return `${ind}<div className="form-field">\n${ind}  <label>${escapeHtml(p.label)}</label>\n${ind}  <input type="${escapeAttr(p.type)}" placeholder="${escapeAttr(p.placeholder)}" ${p.required ? 'required' : ''} />\n${ind}</div>`
      }

      case 'Textarea': {
        return `${ind}<div className="form-field">\n${ind}  <label>${escapeHtml(p.label)}</label>\n${ind}  <textarea placeholder="${escapeAttr(p.placeholder)}" rows={${p.rows}} />\n${ind}</div>`
      }

      case 'Video': {
        if (!p.src) return ''
        if (p.embedType === 'youtube') {
          const youtubeId = extractYoutubeId(p.src)
          return `${ind}<div className="video-wrapper" style={${inlineStyle({ width: p.width, paddingBottom: p.aspectRatio })}}>\n${ind}  <iframe src="https://www.youtube.com/embed/${youtubeId}" allowFullScreen className="video-iframe" />\n${ind}</div>`
        }
        return `${ind}<div className="video-wrapper" style={${inlineStyle({ width: p.width, paddingBottom: p.aspectRatio })}}>\n${ind}  <iframe src="${escapeAttr(p.src)}" allowFullScreen className="video-iframe" />\n${ind}</div>`
      }

      case 'Divider': {
        return `${ind}<hr style={${inlineStyle({ border: 'none', borderTop: `${p.thickness} solid ${p.color}`, margin: p.margin })}} />`
      }

      case 'Spacer': {
        return `${ind}<div style={${inlineStyle({ height: p.height })}} />`
      }

      case 'Link': {
        const target = p.openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : ''
        const style = inlineStyle({ color: p.color })
        return `${ind}<a href="${escapeAttr(p.href)}" style={${style}}${target}>${escapeHtml(p.text)}</a>`
      }

      case 'NavBar': {
        const style = inlineStyle({
          backgroundColor: p.backgroundColor,
          position: p.sticky ? 'sticky' : 'relative',
          top: 0,
        })
        return `${ind}<nav style={${style}} className="navbar">\n${ind}  <div className="navbar-brand">${escapeHtml(p.brand)}</div>\n${ind}  <div className="navbar-links">\n${childContent}\n${ind}  </div>\n${ind}</nav>`
      }

      case 'Header': {
        const style = inlineStyle({ backgroundColor: p.backgroundColor, height: p.height })
        return `${ind}<header style={${style}}>\n${childContent}\n${ind}</header>`
      }

      case 'Footer': {
        const style = inlineStyle({ backgroundColor: p.backgroundColor, color: p.textColor })
        return `${ind}<footer style={${style}}>\n${childContent}\n${ind}</footer>`
      }

      case 'Card': {
        const style = inlineStyle({
          backgroundColor: p.backgroundColor,
          borderRadius: p.borderRadius,
          boxShadow: p.shadow !== 'none' ? `var(--shadow-${p.shadow})` : 'none',
          padding: p.padding,
        })
        return `${ind}<div style={${style}} className="card">\n${childContent}\n${ind}</div>`
      }

      case 'Form': {
        const style = inlineStyle({ backgroundColor: p.backgroundColor, padding: p.padding, borderRadius: p.borderRadius })
        return `${ind}<form style={${style}} onSubmit={(e) => e.preventDefault()}>\n${childContent}\n${ind}  <button type="submit" style={${inlineStyle({ padding: '10px 24px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' })}}>${escapeHtml(p.submitLabel)}</button>\n${ind}</form>`
      }

      case 'RawHTML': {
        return `${ind}<div dangerouslySetInnerHTML={{ __html: ${JSON.stringify(p.html)} }} />`
      }

      case 'Column': {
        const style = inlineStyle({ gridColumn: `span ${p.span}` })
        return `${ind}<div style={${style}}>\n${childContent}\n${ind}</div>`
      }

      default: {
        if (node.type.startsWith('Custom_')) {
          return `${ind}<div dangerouslySetInnerHTML={{ __html: ${JSON.stringify(p.html)} }} />`
        }
        return `${ind}<div>{/* ${node.type} */}</div>`
      }
    }
  }

  const body = rootIds.map(id => renderNode(id)).join('\n\n')
  const cssVars = generateCSSVariables()

  return `// Generated by UIForge
// React Component

${Array.from(imports).join('\n')}

${cssVars}

export default function Page() {
  return (
    <>
${body}
    </>
  )
}
`
}

function inlineStyle(obj: Record<string, any>): string {
  const entries = Object.entries(obj)
    .filter(([_, v]) => v !== undefined && v !== null && v !== '')
    .map(([key, value]) => {
      const cssKey = key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)
      return `"${cssKey}": "${String(value).replace(/"/g, '\\"')}"`
    })
  return `{ ${entries.join(', ')} }`
}

const sizeMap: Record<string, { padding: string; fontSize: string }> = {
  sm: { padding: '6px 12px', fontSize: '14px' },
  md: { padding: '10px 20px', fontSize: '16px' },
  lg: { padding: '14px 28px', fontSize: '18px' },
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function escapeAttr(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function extractYoutubeId(url: string): string {
  const match = url.match(/(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  return match ? match[1] : url
}

function generateCSSVariables(): string {
  return `
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 16px',
  },
  'form-field': {
    marginBottom: '12px',
  },
  'video-wrapper': {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '8px',
  },
  'video-iframe': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
  },
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: '64px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    zIndex: 50,
  },
  card: {
    transition: 'box-shadow 0.2s',
  },
}
`
}

export function generateHTMLCode(nodes: Record<string, ComponentInstance>, rootIds: string[]): string {
  const renderNode = (id: string, indent = 0): string => {
    const node = nodes[id]
    if (!node) return ''
    const def = getComponentDefinition(node.type)
    if (!def) return `<!-- Unknown: ${node.type} -->`
    const p = node.props
    const childContent = node.children.map(cid => renderNode(cid, indent + 1)).join('\n')
    const ind = '  '.repeat(indent)

    switch (node.type) {
      case 'Container':
        return `${ind}<div style="width:${p.width};max-width:${p.maxWidth};padding:${p.padding};margin:${p.margin};background:${p.backgroundColor};border-radius:${p.borderRadius};display:flex;flex-direction:${p.flexDirection};justify-content:${p.justifyContent};align-items:${p.alignItems}">\n${childContent}\n${ind}</div>`
      case 'Section':
        return `${ind}<section style="background:${p.backgroundColor};padding:${p.paddingY} ${p.paddingX}">\n${ind}  <div class="container">\n${childContent}\n${ind}  </div>\n${ind}</section>`
      case 'Heading': {
        const Tag = p.level
        return `${ind}<${Tag} style="text-align:${p.align};color:${p.color};font-size:${p.fontSize};font-weight:${p.fontWeight}">${escapeHtml(p.text)}</${Tag}>`
      }
      case 'Text':
        return `${ind}<p style="text-align:${p.align};color:${p.color};font-size:${p.fontSize};line-height:${p.lineHeight}">${escapeHtml(p.content)}</p>`
      case 'Button':
        return `${ind}<button style="border-radius:${p.borderRadius};width:${p.fullWidth ? '100%' : 'auto'};background:${p.backgroundColor};color:${p.textColor};border:none;padding:10px 20px;font-size:16px;cursor:pointer">${escapeHtml(p.text)}</button>`
      case 'Image':
        return `${ind}<img src="${escapeAttr(p.src)}" alt="${escapeAttr(p.alt)}" style="width:${p.width};height:${p.height};object-fit:${p.objectFit};border-radius:${p.borderRadius}" />`
      case 'Input':
        return `${ind}<div class="form-field"><label>${escapeHtml(p.label)}</label><input type="${escapeAttr(p.type)}" placeholder="${escapeAttr(p.placeholder)}" ${p.required ? 'required' : ''} /></div>`
      case 'Divider':
        return `${ind}<hr style="border:none;border-top:${p.thickness} solid ${p.color};margin:${p.margin}" />`
      case 'Spacer':
        return `${ind}<div style="height:${p.height}"></div>`
      case 'Link': {
        const target = p.openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : ''
        return `${ind}<a href="${escapeAttr(p.href)}" style="color:${p.color}"${target}>${escapeHtml(p.text)}</a>`
      }
      case 'NavBar':
        return `${ind}<nav style="background:${p.backgroundColor};display:flex;align-items:center;justify-content:space-between;padding:0 24px;height:64px">\n${ind}  <div style="font-weight:700;font-size:20px">${escapeHtml(p.brand)}</div>\n${ind}  <div>\n${childContent}\n${ind}  </div>\n${ind}</nav>`
      case 'Header':
        return `${ind}<header style="background:${p.backgroundColor};height:${p.height}">\n${childContent}\n${ind}</header>`
      case 'Footer':
        return `${ind}<footer style="background:${p.backgroundColor};color:${p.textColor};padding:48px 24px">\n${childContent}\n${ind}</footer>`
      case 'Card':
        return `${ind}<div class="card" style="background:${p.backgroundColor};border-radius:${p.borderRadius};padding:${p.padding}">\n${childContent}\n${ind}</div>`
      case 'Form':
        return `${ind}<form style="background:${p.backgroundColor};padding:${p.padding};border-radius:${p.borderRadius}">\n${childContent}\n${ind}  <button type="submit" style="padding:10px 24px;background:#3b82f6;color:white;border:none;border-radius:6px;cursor:pointer">${escapeHtml(p.submitLabel)}</button>\n${ind}</form>`
      case 'RawHTML':
        return `${ind}${p.html}`
      case 'Grid':
        return `${ind}<div style="display:grid;grid-template-columns:repeat(${p.columns},1fr);gap:${p.gap}">\n${childContent}\n${ind}</div>`
      case 'Column':
        return `${ind}<div style="grid-column:span ${p.span}">\n${childContent}\n${ind}</div>`
      default:
        if (node.type.startsWith('Custom_')) {
          return `${ind}${p.html}`
        }
        return `${ind}<div><!-- ${node.type} --></div>`
    }
  }

  const body = rootIds.map(id => renderNode(id)).join('\n\n')

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Generated Page</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Inter, system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 16px; }
    .form-field { margin-bottom: 12px; }
    .form-field label { display: block; margin-bottom: 4px; font-size: 14px; font-weight: 500; }
    .form-field input, .form-field textarea {
      width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 16px; font-family: inherit;
    }
    .card { transition: box-shadow 0.2s; }
    img { max-width: 100%; }
  </style>
</head>
<body>
${body}
</body>
</html>`
}
