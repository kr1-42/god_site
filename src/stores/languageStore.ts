import { useEffect } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { en, it, TranslationKey } from '../i18n/translations'
import { Product } from '../types'

export type Language = 'en' | 'it'

interface LanguageStore {
  language: Language
  setLanguage: (language: Language) => void
}

const browserLanguage: Language =
  typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('it') ? 'it' : 'en'

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: browserLanguage,
      setLanguage: (language) => set({ language }),
    }),
    { name: 'language' },
  ),
)

const dictionaries = { en, it }

// Splits one-per-line text into list items, dropping blank lines and any typed bullet
export function toListItems(text: string | undefined) {
  return (text ?? '')
    .split('\n')
    .map((line) => line.trim().replace(/^[-•*]\s*/, ''))
    .filter(Boolean)
}

export function useTranslation() {
  const language = useLanguageStore((state) => state.language)
  const setLanguage = useLanguageStore((state) => state.setLanguage)

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const t = (key: TranslationKey, params?: Record<string, string | number>) => {
    let text: string = dictionaries[language][key] ?? en[key]
    if (params) {
      for (const [name, value] of Object.entries(params)) {
        text = text.split(`{${name}}`).join(String(value))
      }
    }
    return text
  }

  // Italian text when there is one, otherwise the English one
  const describe = (product: Pick<Product, 'description' | 'descriptionIt'>) =>
    language === 'it' && product.descriptionIt?.trim() ? product.descriptionIt : product.description

  const listItems = (product: Product, field: 'details' | 'dimensions') => {
    const italian = product[field === 'details' ? 'detailsIt' : 'dimensionsIt']
    return toListItems(language === 'it' && italian?.trim() ? italian : product[field])
  }

  // Italian category name when there is one, otherwise the English one
  const categoryName = (category: { name: string; nameIt?: string }) =>
    language === 'it' && category.nameIt?.trim() ? category.nameIt : category.name

  return { t, language, setLanguage, describe, listItems, categoryName }
}
