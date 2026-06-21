import type { ComponentInstance } from '@/types'
import { getComponentDefinition } from '@/components/registry'

export function generateSvelteCode(nodes: Record<string, ComponentInstance>, rootIds: string[]): string {
  const renderNode = (id: string, indent = 0): string => {
    const node = nodes[id]
    if (!node) return ''
    const def = getComponentDefinition(node.type)
    if (!def) return `<!-- Unknown: ${node.type} -->`

    const p = node.props
    const childContent = node.children.map(cid => renderNode(cid, indent + 1)).join('\n')
    const ind = '  '.repeat(indent)

    switch (node.type) {
      case 'Container': {
        const style = inlineStyle({
          width: p.width, maxWidth: p.maxWidth, padding: p.padding, margin: p.margin,
          backgroundColor: p.backgroundColor, borderRadius: p.borderRadius,
          boxShadow: p.shadow !== 'none' ? `var(--shadow-${p.shadow})` : 'none',
          display: 'flex', flexDirection: p.flexDirection,
          justifyContent: p.justifyContent, alignItems: p.alignItems,
        })
        return `${ind}<div style="${style}">\n${childContent}\n${ind}</div>`
      }
      case 'Section':
        return `${ind}<section style="background: ${p.backgroundColor}; padding: ${p.paddingY} ${p.paddingX}">\n${ind}  <div class="container">\n${childContent}\n${ind}  </div>\n${ind}</section>`
      case 'Heading': {
        const Tag = p.level
        return `${ind}<${Tag} style="text-align: ${p.align}; color: ${p.color}; font-size: ${p.fontSize}; font-weight: ${p.fontWeight}">${escapeHtml(p.text)}</${Tag}>`
      }
      case 'Text':
        return `${ind}<p style="text-align: ${p.align}; color: ${p.color}; font-size: ${p.fontSize}; line-height: ${p.lineHeight}">${escapeHtml(p.content)}</p>`
      case 'Button':
        return `${ind}<button style="border-radius: ${p.borderRadius}; background: ${p.backgroundColor}; color: ${p.textColor}; border: none; padding: 10px 20px; font-size: 16px; cursor: pointer">${escapeHtml(p.text)}</button>`
      case 'Image':
        return `${ind}<img src="${escapeAttr(p.src)}" alt="${escapeAttr(p.alt)}" style="width: ${p.width}; height: ${p.height}; object-fit: ${p.objectFit}; border-radius: ${p.borderRadius}" />`
      case 'Input':
        return `${ind}<div class="form-field"><label>${escapeHtml(p.label)}</label><input type="${escapeAttr(p.type)}" placeholder="${escapeAttr(p.placeholder)}" {${p.required ? 'required' : ''}} /></div>`
      case 'Textarea':
        return `${ind}<div class="form-field"><label>${escapeHtml(p.label)}</label><textarea placeholder="${escapeAttr(p.placeholder)}" rows="{${p.rows}}"></textarea></div>`
      case 'Divider':
        return `${ind}<hr style="border: none; border-top: ${p.thickness} solid ${p.color}; margin: ${p.margin}" />`
      case 'Spacer':
        return `${ind}<div style="height: ${p.height}"></div>`
      case 'Link': {
        const target = p.openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : ''
        return `${ind}<a href="${escapeAttr(p.href)}" style="color: ${p.color}"${target}>${escapeHtml(p.text)}</a>`
      }
      case 'NavBar':
        return `${ind}<nav style="background: ${p.backgroundColor}; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; height: 64px">\n${ind}  <div style="font-weight: 700; font-size: 20px">${escapeHtml(p.brand)}</div>\n${ind}  <div>\n${childContent}\n${ind}  </div>\n${ind}</nav>`
      case 'Header':
        return `${ind}<header style="background: ${p.backgroundColor}; height: ${p.height}">\n${childContent}\n${ind}</header>`
      case 'Footer':
        return `${ind}<footer style="background: ${p.backgroundColor}; color: ${p.textColor}; padding: 48px 24px">\n${childContent}\n${ind}</footer>`
      case 'Card':
        return `${ind}<div class="card" style="background: ${p.backgroundColor}; border-radius: ${p.borderRadius}; padding: ${p.padding}">\n${childContent}\n${ind}</div>`
      case 'Form':
        return `${ind}<form style="background: ${p.backgroundColor}; padding: ${p.padding}; border-radius: ${p.borderRadius}" on:submit|preventDefault>\n${childContent}\n${ind}  <button type="submit" style="padding: 10px 24px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer">${escapeHtml(p.submitLabel)}</button>\n${ind}</form>`
      case 'RawHTML':
        return `${ind}{@html ${JSON.stringify(p.html)}}`
      case 'Grid':
        return `${ind}<div style="display: grid; grid-template-columns: repeat(${p.columns}, 1fr); gap: ${p.gap}">\n${childContent}\n${ind}</div>`
      case 'Column':
        return `${ind}<div style="grid-column: span ${p.span}">\n${childContent}\n${ind}</div>`
      default:
        if (node.type.startsWith('Custom_')) {
          return `${ind}{@html ${JSON.stringify(p.html)}}`
        }
        return `${ind}<div><!-- ${node.type} --></div>`
    }
  }

  const body = rootIds.map(id => renderNode(id)).join('\n\n')

  return `<script>
  // Generated by UIForge
</script>

<div class="page">
${body}
</div>

<style>
  .page {
    font-family: Inter, system-ui, -apple-system, sans-serif;
    line-height: 1.6;
    color: #333;
  }
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
  }
  .form-field {
    margin-bottom: 12px;
  }
  .form-field label {
    display: block;
    margin-bottom: 4px;
    font-size: 14px;
    font-weight: 500;
  }
  .form-field input,
  .form-field textarea {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 16px;
    font-family: inherit;
    box-sizing: border-box;
  }
  .card {
    transition: box-shadow 0.2s;
  }
  img {
    max-width: 100%;
  }
</style>`
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function escapeAttr(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function inlineStyle(obj: Record<string, any>): string {
  const entries = Object.entries(obj)
    .filter(([_, v]) => v !== undefined && v !== null && v !== '')
    .map(([key, value]) => {
      const cssKey = key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)
      return `${cssKey}: ${String(value).replace(/"/g, '\\"')}`
    })
  return entries.join('; ')
}
