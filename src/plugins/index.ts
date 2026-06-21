import type { ComponentDefinition } from '@/types/component'

export interface PluginManifest {
  id: string
  name: string
  version: string
  description: string
  author: string
}

export interface PluginHooks {
  onRegister?: () => void
  onUnregister?: () => void
  onComponentRender?: (type: string, props: Record<string, any>) => Record<string, any> | null
  onEditorInit?: () => void
  onCanvasDrop?: (type: string, parentId: string | null) => boolean
}

export interface Plugin {
  manifest: PluginManifest
  hooks: PluginHooks
  components?: ComponentDefinition[]
}

const plugins = new Map<string, Plugin>()

export function registerPlugin(plugin: Plugin) {
  if (plugins.has(plugin.manifest.id)) {
    console.warn(`Plugin "${plugin.manifest.id}" is already registered`)
    return
  }
  plugins.set(plugin.manifest.id, plugin)
  plugin.hooks.onRegister?.()
}

export function unregisterPlugin(id: string) {
  const plugin = plugins.get(id)
  if (plugin) {
    plugin.hooks.onUnregister?.()
    plugins.delete(id)
  }
}

export function getPlugin(id: string): Plugin | undefined {
  return plugins.get(id)
}

export function getAllPlugins(): Plugin[] {
  return Array.from(plugins.values())
}

export function getPluginComponents(): ComponentDefinition[] {
  const all: ComponentDefinition[] = []
  plugins.forEach(p => {
    if (p.components) all.push(...p.components)
  })
  return all
}

export function runHook<K extends keyof PluginHooks>(
  hook: K,
  ...args: Parameters<Exclude<PluginHooks[K], undefined>>
): any[] {
  const results: any[] = []
  plugins.forEach(p => {
    const fn = p.hooks[hook]
    if (fn) {
      results.push((fn as Function)(...args))
    }
  })
  return results
}
