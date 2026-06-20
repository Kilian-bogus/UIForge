export type ComponentType =
  | 'Container'
  | 'Text'
  | 'Heading'
  | 'Button'
  | 'Image'
  | 'Input'
  | 'Textarea'
  | 'Select'
  | 'Video'
  | 'Link'
  | 'Divider'
  | 'Spacer'
  | 'Icon'
  | 'Card'
  | 'Grid'
  | 'Column'
  | 'List'
  | 'Form'
  | 'Table'
  | 'Accordion'
  | 'Tabs'
  | 'Section'
  | 'Header'
  | 'Footer'
  | 'NavBar'
  | 'RawHTML'

export interface PropDefinition {
  name: string
  label: string
  type: 'string' | 'number' | 'boolean' | 'color' | 'select' | 'image' | 'url' | 'text' | 'slider' | 'size'
  defaultValue?: any
  options?: { label: string; value: string }[]
  min?: number
  max?: number
  step?: number
  placeholder?: string
  group?: string
}

export interface ComponentDefinition {
  type: ComponentType
  label: string
  icon: string
  category: 'layout' | 'basic' | 'form' | 'media' | 'content' | 'navigation' | 'custom'
  props: PropDefinition[]
  defaultProps: Record<string, any>
  canHaveChildren: boolean
  defaultChildren?: string[]
  description?: string
  preview?: string
}

export interface ComponentNode {
  id: string
  type: ComponentType
  props: Record<string, any>
  children: string[]
  parentId: string | null
  styles: Record<string, string>
}

export interface ComponentInstance {
  id: string
  type: ComponentType
  props: Record<string, any>
  children: string[]
  parentId: string | null
  styles: Record<string, string>
  customClasses?: string[]
  visible?: boolean
  locked?: boolean
}
