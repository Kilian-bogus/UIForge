import type { ComponentInstance } from '@/types'
import { getComponentDefinition } from '@/components/registry'

export function generateVueCode(nodes: Record<string, ComponentInstance>, rootIds: string[]): string {
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
        const style = inlineVueStyle({
          width: p.width, maxWidth: p.maxWidth, padding: p.padding, margin: p.margin,
          backgroundColor: p.backgroundColor, borderRadius: p.borderRadius,
          boxShadow: p.shadow !== 'none' ? `var(--shadow-${p.shadow})` : 'none',
          display: 'flex', flexDirection: p.flexDirection,
          justifyContent: p.justifyContent, alignItems: p.alignItems,
        })
        return `${ind}<div :style="${style}">\n${childContent}\n${ind}</div>`
      }
      case 'Section':
        return `${ind}<section :style="{ backgroundColor: '${p.backgroundColor}', padding: '${p.paddingY} ${p.paddingX}' }">\n${ind}  <div class="container">\n${childContent}\n${ind}  </div>\n${ind}</section>`
      case 'Heading': {
        const Tag = p.level
        return `${ind}<${Tag} :style="{ textAlign: '${p.align}', color: '${p.color}', fontSize: '${p.fontSize}', fontWeight: ${p.fontWeight} }">${escapeHtml(p.text)}</${Tag}>`
      }
      case 'Text':
        return `${ind}<p :style="{ textAlign: '${p.align}', color: '${p.color}', fontSize: '${p.fontSize}', lineHeight: ${p.lineHeight} }">${escapeHtml(p.content)}</p>`
      case 'Button':
        return `${ind}<button :style="{ borderRadius: '${p.borderRadius}', background: '${p.backgroundColor}', color: '${p.textColor}', border: 'none', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }">${escapeHtml(p.text)}</button>`
      case 'Image':
        return `${ind}<img src="${escapeAttr(p.src)}" alt="${escapeAttr(p.alt)}" :style="{ width: '${p.width}', height: '${p.height}', objectFit: '${p.objectFit}', borderRadius: '${p.borderRadius}' }" />`
      case 'Input':
        return `${ind}<div class="form-field"><label>${escapeHtml(p.label)}</label><input type="${escapeAttr(p.type)}" placeholder="${escapeAttr(p.placeholder)}" ${p.required ? 'required' : ''} /></div>`
      case 'Textarea':
        return `${ind}<div class="form-field"><label>${escapeHtml(p.label)}</label><textarea placeholder="${escapeAttr(p.placeholder)}" :rows="${p.rows}"></textarea></div>`
      case 'Divider':
        return `${ind}<hr :style="{ border: 'none', borderTop: '${p.thickness} solid ${p.color}', margin: '${p.margin}' }" />`
      case 'Spacer':
        return `${ind}<div :style="{ height: '${p.height}' }"></div>`
      case 'Link': {
        const target = p.openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : ''
        return `${ind}<a href="${escapeAttr(p.href)}" :style="{ color: '${p.color}' }"${target}>${escapeHtml(p.text)}</a>`
      }
      case 'NavBar':
        return `${ind}<nav :style="{ background: '${p.backgroundColor}', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: '64px' }">\n${ind}  <div style="font-weight: 700; font-size: 20px">${escapeHtml(p.brand)}</div>\n${ind}  <div>\n${childContent}\n${ind}  </div>\n${ind}</nav>`
      case 'Header':
        return `${ind}<header :style="{ background: '${p.backgroundColor}', height: '${p.height}' }">\n${childContent}\n${ind}</header>`
      case 'Footer':
        return `${ind}<footer :style="{ background: '${p.backgroundColor}', color: '${p.textColor}' }">\n${childContent}\n${ind}</footer>`
      case 'Card':
        return `${ind}<div class="card" :style="{ background: '${p.backgroundColor}', borderRadius: '${p.borderRadius}', padding: '${p.padding}' }">\n${childContent}\n${ind}</div>`
      case 'Form':
        return `${ind}<form :style="{ background: '${p.backgroundColor}', padding: '${p.padding}', borderRadius: '${p.borderRadius}' }" @submit.prevent>\n${childContent}\n${ind}  <button type="submit" :style="{ padding: '10px 24px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }">${escapeHtml(p.submitLabel)}</button>\n${ind}</form>`
      case 'RawHTML':
        return `${ind}<div v-html="${escapeAttr(p.html)}"></div>`
      case 'Grid':
        return `${ind}<div :style="{ display: 'grid', gridTemplateColumns: 'repeat(${p.columns}, 1fr)', gap: '${p.gap}' }">\n${childContent}\n${ind}</div>`
      case 'Column':
        return `${ind}<div :style="{ gridColumn: 'span ${p.span}' }">\n${childContent}\n${ind}</div>`
      default:
        if (node.type.startsWith('Custom_')) {
          return `${ind}<div v-html="${escapeAttr(p.html)}"></div>`
        }
        return `${ind}<div><!-- ${node.type} --></div>`
    }
  }

  const body = rootIds.map(id => renderNode(id)).join('\n\n')

  return `<template>\n  <div class="page">\n${body}\n  </div>\n</template>\n\n<script setup>\n// Generated by UIForge\n</script>\n\n<style scoped>\n.page {\n  font-family: Inter, system-ui, -apple-system, sans-serif;\n  line-height: 1.6;\n  color: #333;\n}\n.container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 0 16px;\n}\n.form-field {\n  margin-bottom: 12px;\n}\n.form-field label {\n  display: block;\n  margin-bottom: 4px;\n  font-size: 14px;\n  font-weight: 500;\n}\n.form-field input,\n.form-field textarea {\n  width: 100%;\n  padding: 8px 12px;\n  border: 1px solid #d1d5db;\n  border-radius: 6px;\n  font-size: 16px;\n  font-family: inherit;\n  box-sizing: border-box;\n}\n.card {\n  transition: box-shadow 0.2s;\n}\nimg {\n  max-width: 100%;\n}\n</style>`
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function escapeAttr(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function inlineVueStyle(obj: Record<string, any>): string {
  const entries = Object.entries(obj)
    .filter(([_, v]) => v !== undefined && v !== null && v !== '')
    .map(([key, value]) => {
      const cssKey = key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)
      return `'${cssKey}': '${String(value).replace(/'/g, "\\'")}'`
    })
  return `{ ${entries.join(', ')} }`
}
