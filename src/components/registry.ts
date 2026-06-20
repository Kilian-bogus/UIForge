import type { ComponentDefinition } from '@/types'

const componentDefinitions: Record<string, ComponentDefinition> = {
  Container: {
    type: 'Container',
    label: 'Container',
    icon: 'Square',
    category: 'layout',
    canHaveChildren: true,
    props: [
      { name: 'width', label: 'Width', type: 'size', defaultValue: '100%', group: 'Layout' },
      { name: 'maxWidth', label: 'Max Width', type: 'size', defaultValue: '1200px', group: 'Layout' },
      { name: 'padding', label: 'Padding', type: 'size', defaultValue: '16px', group: 'Spacing' },
      { name: 'margin', label: 'Margin', type: 'size', defaultValue: '0', group: 'Spacing' },
      { name: 'backgroundColor', label: 'Background', type: 'color', defaultValue: '#ffffff', group: 'Style' },
      { name: 'borderRadius', label: 'Border Radius', type: 'size', defaultValue: '0', group: 'Style' },
      { name: 'shadow', label: 'Shadow', type: 'select', defaultValue: 'none', options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
      ], group: 'Style' },
      { name: 'flexDirection', label: 'Direction', type: 'select', defaultValue: 'column', options: [
        { label: 'Column', value: 'column' },
        { label: 'Row', value: 'row' },
      ], group: 'Layout' },
      { name: 'justifyContent', label: 'Justify', type: 'select', defaultValue: 'start', options: [
        { label: 'Start', value: 'flex-start' },
        { label: 'Center', value: 'center' },
        { label: 'End', value: 'flex-end' },
        { label: 'Space Between', value: 'space-between' },
      ], group: 'Layout' },
      { name: 'alignItems', label: 'Align', type: 'select', defaultValue: 'start', options: [
        { label: 'Start', value: 'flex-start' },
        { label: 'Center', value: 'center' },
        { label: 'End', value: 'flex-end' },
        { label: 'Stretch', value: 'stretch' },
      ], group: 'Layout' },
    ],
    defaultProps: {
      width: '100%',
      maxWidth: '1200px',
      padding: '16px',
      margin: '0',
      backgroundColor: '#ffffff',
      borderRadius: '0',
      shadow: 'none',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
  },

  Section: {
    type: 'Section',
    label: 'Section',
    icon: 'Layout',
    category: 'layout',
    canHaveChildren: true,
    props: [
      { name: 'backgroundColor', label: 'Background', type: 'color', defaultValue: '#f9fafb', group: 'Style' },
      { name: 'paddingY', label: 'Padding Y', type: 'size', defaultValue: '48px', group: 'Spacing' },
      { name: 'paddingX', label: 'Padding X', type: 'size', defaultValue: '24px', group: 'Spacing' },
      { name: 'fullWidth', label: 'Full Width', type: 'boolean', defaultValue: true, group: 'Layout' },
    ],
    defaultProps: {
      backgroundColor: '#f9fafb',
      paddingY: '48px',
      paddingX: '24px',
      fullWidth: true,
    },
  },

  Grid: {
    type: 'Grid',
    label: 'Grid',
    icon: 'Grid',
    category: 'layout',
    canHaveChildren: true,
    props: [
      { name: 'columns', label: 'Columns', type: 'slider', defaultValue: 3, min: 1, max: 12, group: 'Layout' },
      { name: 'gap', label: 'Gap', type: 'size', defaultValue: '16px', group: 'Spacing' },
    ],
    defaultProps: { columns: 3, gap: '16px' },
  },

  Column: {
    type: 'Column',
    label: 'Spalte',
    icon: 'Columns2',
    category: 'layout',
    canHaveChildren: true,
    props: [
      { name: 'span', label: 'Span', type: 'slider', defaultValue: 1, min: 1, max: 12, group: 'Layout' },
    ],
    defaultProps: { span: 1 },
  },

  Heading: {
    type: 'Heading',
    label: 'Überschrift',
    icon: 'Heading',
    category: 'basic',
    canHaveChildren: false,
    props: [
      { name: 'text', label: 'Text', type: 'text', defaultValue: 'Überschrift', group: 'Content' },
      { name: 'level', label: 'Level', type: 'select', defaultValue: 'h2', options: [
        { label: 'H1', value: 'h1' },
        { label: 'H2', value: 'h2' },
        { label: 'H3', value: 'h3' },
        { label: 'H4', value: 'h4' },
      ], group: 'Content' },
      { name: 'align', label: 'Align', type: 'select', defaultValue: 'left', options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ], group: 'Style' },
      { name: 'color', label: 'Color', type: 'color', defaultValue: '#111827', group: 'Style' },
      { name: 'fontSize', label: 'Font Size', type: 'size', defaultValue: '24px', group: 'Style' },
      { name: 'fontWeight', label: 'Weight', type: 'select', defaultValue: 'bold', options: [
        { label: 'Normal', value: 'normal' },
        { label: 'Medium', value: '500' },
        { label: 'Semi Bold', value: '600' },
        { label: 'Bold', value: 'bold' },
      ], group: 'Style' },
    ],
    defaultProps: { text: 'Überschrift', level: 'h2', align: 'left', color: '#111827', fontSize: '24px', fontWeight: 'bold' },
  },

  Text: {
    type: 'Text',
    label: 'Text',
    icon: 'Type',
    category: 'basic',
    canHaveChildren: false,
    props: [
      { name: 'content', label: 'Inhalt', type: 'text', defaultValue: 'Text hier eingeben...', group: 'Content' },
      { name: 'align', label: 'Align', type: 'select', defaultValue: 'left', options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ], group: 'Style' },
      { name: 'color', label: 'Color', type: 'color', defaultValue: '#374151', group: 'Style' },
      { name: 'fontSize', label: 'Font Size', type: 'size', defaultValue: '16px', group: 'Style' },
      { name: 'lineHeight', label: 'Line Height', type: 'slider', defaultValue: 1.6, min: 1, max: 3, step: 0.1, group: 'Style' },
    ],
    defaultProps: { content: 'Text hier eingeben...', align: 'left', color: '#374151', fontSize: '16px', lineHeight: 1.6 },
  },

  Button: {
    type: 'Button',
    label: 'Button',
    icon: 'MousePointerClick',
    category: 'basic',
    canHaveChildren: false,
    props: [
      { name: 'text', label: 'Text', type: 'text', defaultValue: 'Button', group: 'Content' },
      { name: 'variant', label: 'Variante', type: 'select', defaultValue: 'primary', options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Outline', value: 'outline' },
        { label: 'Ghost', value: 'ghost' },
      ], group: 'Style' },
      { name: 'size', label: 'Size', type: 'select', defaultValue: 'md', options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
      ], group: 'Style' },
      { name: 'fullWidth', label: 'Full Width', type: 'boolean', defaultValue: false, group: 'Layout' },
      { name: 'backgroundColor', label: 'Background', type: 'color', defaultValue: '#3b82f6', group: 'Style' },
      { name: 'textColor', label: 'Text Color', type: 'color', defaultValue: '#ffffff', group: 'Style' },
      { name: 'borderRadius', label: 'Border Radius', type: 'size', defaultValue: '6px', group: 'Style' },
      { name: 'linkTo', label: 'Link URL', type: 'url', defaultValue: '', group: 'Behavior' },
    ],
    defaultProps: {
      text: 'Button', variant: 'primary', size: 'md', fullWidth: false,
      backgroundColor: '#3b82f6', textColor: '#ffffff', borderRadius: '6px', linkTo: '',
    },
  },

  Image: {
    type: 'Image',
    label: 'Bild',
    icon: 'Image',
    category: 'media',
    canHaveChildren: false,
    props: [
      { name: 'src', label: 'Bildquelle', type: 'image', defaultValue: 'https://placehold.co/600x400/eee/999?text=Bild', group: 'Content' },
      { name: 'alt', label: 'Alt-Text', type: 'string', defaultValue: 'Bildbeschreibung', group: 'SEO' },
      { name: 'width', label: 'Width', type: 'size', defaultValue: '100%', group: 'Layout' },
      { name: 'height', label: 'Height', type: 'size', defaultValue: 'auto', group: 'Layout' },
      { name: 'objectFit', label: 'Object Fit', type: 'select', defaultValue: 'cover', options: [
        { label: 'Cover', value: 'cover' },
        { label: 'Contain', value: 'contain' },
        { label: 'Fill', value: 'fill' },
      ], group: 'Style' },
      { name: 'borderRadius', label: 'Border Radius', type: 'size', defaultValue: '0', group: 'Style' },
    ],
    defaultProps: {
      src: 'https://placehold.co/600x400/eee/999?text=Bild', alt: 'Bildbeschreibung',
      width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '0',
    },
  },

  Input: {
    type: 'Input',
    label: 'Eingabefeld',
    icon: 'Square',
    category: 'form',
    canHaveChildren: false,
    props: [
      { name: 'label', label: 'Label', type: 'string', defaultValue: 'Name', group: 'Content' },
      { name: 'placeholder', label: 'Placeholder', type: 'string', defaultValue: 'Geben Sie Text ein...', group: 'Content' },
      { name: 'type', label: 'Input Type', type: 'select', defaultValue: 'text', options: [
        { label: 'Text', value: 'text' },
        { label: 'Email', value: 'email' },
        { label: 'Password', value: 'password' },
        { label: 'Number', value: 'number' },
      ], group: 'Content' },
      { name: 'required', label: 'Required', type: 'boolean', defaultValue: false, group: 'Validation' },
    ],
    defaultProps: { label: 'Name', placeholder: 'Geben Sie Text ein...', type: 'text', required: false },
  },

  Textarea: {
    type: 'Textarea',
    label: 'Textarea',
    icon: 'AlignLeft',
    category: 'form',
    canHaveChildren: false,
    props: [
      { name: 'label', label: 'Label', type: 'string', defaultValue: 'Nachricht', group: 'Content' },
      { name: 'placeholder', label: 'Placeholder', type: 'string', defaultValue: 'Ihre Nachricht...', group: 'Content' },
      { name: 'rows', label: 'Rows', type: 'slider', defaultValue: 4, min: 2, max: 20, group: 'Layout' },
    ],
    defaultProps: { label: 'Nachricht', placeholder: 'Ihre Nachricht...', rows: 4 },
  },

  Video: {
    type: 'Video',
    label: 'Video',
    icon: 'Video',
    category: 'media',
    canHaveChildren: false,
    props: [
      { name: 'src', label: 'Video URL', type: 'url', defaultValue: '', group: 'Content' },
      { name: 'embedType', label: 'Typ', type: 'select', defaultValue: 'youtube', options: [
        { label: 'YouTube', value: 'youtube' },
        { label: 'Vimeo', value: 'vimeo' },
        { label: 'Direct', value: 'direct' },
      ], group: 'Content' },
      { name: 'width', label: 'Width', type: 'size', defaultValue: '100%', group: 'Layout' },
      { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', defaultValue: '16:9', options: [
        { label: '16:9', value: '56.25%' },
        { label: '4:3', value: '75%' },
        { label: '1:1', value: '100%' },
      ], group: 'Layout' },
    ],
    defaultProps: { src: '', embedType: 'youtube', width: '100%', aspectRatio: '56.25%' },
  },

  Divider: {
    type: 'Divider',
    label: 'Trennlinie',
    icon: 'Minus',
    category: 'basic',
    canHaveChildren: false,
    props: [
      { name: 'color', label: 'Color', type: 'color', defaultValue: '#e5e7eb', group: 'Style' },
      { name: 'thickness', label: 'Thickness', type: 'size', defaultValue: '1px', group: 'Style' },
      { name: 'margin', label: 'Margin', type: 'size', defaultValue: '16px 0', group: 'Spacing' },
    ],
    defaultProps: { color: '#e5e7eb', thickness: '1px', margin: '16px 0' },
  },

  Spacer: {
    type: 'Spacer',
    label: 'Abstand',
    icon: 'ArrowUpDown',
    category: 'layout',
    canHaveChildren: false,
    props: [
      { name: 'height', label: 'Height', type: 'size', defaultValue: '32px', group: 'Spacing' },
    ],
    defaultProps: { height: '32px' },
  },

  Link: {
    type: 'Link',
    label: 'Link',
    icon: 'Link',
    category: 'basic',
    canHaveChildren: false,
    props: [
      { name: 'text', label: 'Text', type: 'string', defaultValue: 'Link', group: 'Content' },
      { name: 'href', label: 'URL', type: 'url', defaultValue: '#', group: 'Behavior' },
      { name: 'openInNewTab', label: 'New Tab', type: 'boolean', defaultValue: false, group: 'Behavior' },
      { name: 'color', label: 'Color', type: 'color', defaultValue: '#3b82f6', group: 'Style' },
    ],
    defaultProps: { text: 'Link', href: '#', openInNewTab: false, color: '#3b82f6' },
  },

  NavBar: {
    type: 'NavBar',
    label: 'Navigation',
    icon: 'Menu',
    category: 'navigation',
    canHaveChildren: true,
    props: [
      { name: 'brand', label: 'Brand Name', type: 'string', defaultValue: 'Logo', group: 'Content' },
      { name: 'backgroundColor', label: 'Background', type: 'color', defaultValue: '#ffffff', group: 'Style' },
      { name: 'sticky', label: 'Sticky', type: 'boolean', defaultValue: false, group: 'Behavior' },
    ],
    defaultProps: { brand: 'Logo', backgroundColor: '#ffffff', sticky: false },
  },

  Header: {
    type: 'Header',
    label: 'Header',
    icon: 'PanelTop',
    category: 'layout',
    canHaveChildren: true,
    props: [
      { name: 'backgroundColor', label: 'Background', type: 'color', defaultValue: '#ffffff', group: 'Style' },
      { name: 'height', label: 'Height', type: 'size', defaultValue: '80px', group: 'Layout' },
    ],
    defaultProps: { backgroundColor: '#ffffff', height: '80px' },
  },

  Footer: {
    type: 'Footer',
    label: 'Footer',
    icon: 'PanelBottom',
    category: 'layout',
    canHaveChildren: true,
    props: [
      { name: 'backgroundColor', label: 'Background', type: 'color', defaultValue: '#1f2937', group: 'Style' },
      { name: 'textColor', label: 'Text Color', type: 'color', defaultValue: '#ffffff', group: 'Style' },
    ],
    defaultProps: { backgroundColor: '#1f2937', textColor: '#ffffff' },
  },

  Card: {
    type: 'Card',
    label: 'Karte',
    icon: 'CreditCard',
    category: 'content',
    canHaveChildren: true,
    props: [
      { name: 'backgroundColor', label: 'Background', type: 'color', defaultValue: '#ffffff', group: 'Style' },
      { name: 'borderRadius', label: 'Border Radius', type: 'size', defaultValue: '8px', group: 'Style' },
      { name: 'shadow', label: 'Shadow', type: 'select', defaultValue: 'md', options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
      ], group: 'Style' },
      { name: 'padding', label: 'Padding', type: 'size', defaultValue: '24px', group: 'Spacing' },
    ],
    defaultProps: { backgroundColor: '#ffffff', borderRadius: '8px', shadow: 'md', padding: '24px' },
  },

  Form: {
    type: 'Form',
    label: 'Formular',
    icon: 'FileText',
    category: 'form',
    canHaveChildren: true,
    props: [
      { name: 'submitLabel', label: 'Button Text', type: 'string', defaultValue: 'Absenden', group: 'Content' },
      { name: 'backgroundColor', label: 'Background', type: 'color', defaultValue: '#f9fafb', group: 'Style' },
      { name: 'padding', label: 'Padding', type: 'size', defaultValue: '24px', group: 'Spacing' },
      { name: 'borderRadius', label: 'Border Radius', type: 'size', defaultValue: '8px', group: 'Style' },
    ],
    defaultProps: { submitLabel: 'Absenden', backgroundColor: '#f9fafb', padding: '24px', borderRadius: '8px' },
  },

  RawHTML: {
    type: 'RawHTML',
    label: 'HTML Block',
    icon: 'Code',
    category: 'custom',
    canHaveChildren: false,
    props: [
      { name: 'html', label: 'HTML', type: 'text', defaultValue: '<div>Custom HTML</div>', group: 'Content' },
    ],
    defaultProps: { html: '<div>Custom HTML</div>' },
  },
}

export function getComponentDefinition(type: string): ComponentDefinition | undefined {
  return componentDefinitions[type]
}

export function getAllComponentDefinitions(): ComponentDefinition[] {
  return Object.values(componentDefinitions)
}

export function getComponentsByCategory(category: string): ComponentDefinition[] {
  return Object.values(componentDefinitions).filter(c => c.category === category)
}

export function getCategories(): { key: string; label: string }[] {
  return [
    { key: 'layout', label: 'Layout' },
    { key: 'basic', label: 'Basic' },
    { key: 'form', label: 'Formulare' },
    { key: 'media', label: 'Medien' },
    { key: 'content', label: 'Inhalte' },
    { key: 'navigation', label: 'Navigation' },
    { key: 'custom', label: 'Benutzerdefiniert' },
  ]
}

export { componentDefinitions }
