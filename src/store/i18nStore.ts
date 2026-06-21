import { create } from 'zustand'

export type Language = 'de' | 'en'

const translations: Record<Language, Record<string, string>> = { de: {}, en: {} }

async function loadLanguage(lang: Language) {
  try {
    const module = await import(`@/i18n/${lang}.json`)
    translations[lang] = module.default || module
  } catch {
    const fallback = await import(`@/i18n/de.json`)
    translations[lang] = fallback.default || fallback
  }
}

function interpolate(str: string, vars?: Record<string, string | number>): string {
  if (!vars) return str
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) => String(vars[key] ?? `{{${key}}}`))
}

interface I18nState {
  language: Language
  initialized: boolean
  init: () => Promise<void>
  setLanguage: (lang: Language) => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

export const useI18nStore = create<I18nState>((set, get) => ({
  language: 'de',
  initialized: false,

  init: async () => {
    const saved = localStorage.getItem('uiforge-language') as Language | null
    const lang = saved || 'de'
    await loadLanguage(lang)
    set({ language: lang, initialized: true })
  },

  setLanguage: async (lang: Language) => {
    await loadLanguage(lang)
    localStorage.setItem('uiforge-language', lang)
    set({ language: lang })
  },

  t: (key: string, vars?: Record<string, string | number>) => {
    const { language } = get()
    const dict = translations[language]
    const text = dict?.[key] || key
    return interpolate(text, vars)
  },
}))

export function useTranslation() {
  const t = useI18nStore(s => s.t)
  const language = useI18nStore(s => s.language)
  const setLanguage = useI18nStore(s => s.setLanguage)
  return { t, language, setLanguage }
}
