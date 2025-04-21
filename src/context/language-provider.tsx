// LanguageProvider.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useTranslation } from "react-i18next"

type Language = "en" | "ar"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  dir: "ltr" | "rtl"
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation()
  const [language, setLanguageState] = useState<Language>((i18n.language as Language) || "en")
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr")

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    i18n.changeLanguage(newLanguage)
    const newDir = newLanguage === "ar" ? "rtl" : "ltr"
    setDir(newDir)
    document.documentElement.dir = newDir
    document.documentElement.lang = newLanguage
  }

  // Initialize direction on component mount
  useEffect(() => {
    const currentDir = language === "ar" ? "rtl" : "ltr"
    setDir(currentDir)
    document.documentElement.dir = currentDir
    document.documentElement.lang = language
  }, [language])

  return <LanguageContext.Provider value={{ language, setLanguage, dir }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }

  return context
}
