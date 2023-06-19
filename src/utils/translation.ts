import { initReactI18next } from "react-i18next"
import i18n from "i18next"
import translation from "./translations.json"

i18n.use(initReactI18next).init({
  resources: {
    ru: { translation: translation["ru"] },
    en: { translation: translation["en"] },
    ch: { translation: translation["ch"] },
    ar: { translation: translation["ar"] },
    sp: { translation: translation["sp"] },
    in: { translation: translation["in"] },
    it: { translation: translation["it"] },
    ge: { translation: translation["ge"] },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
})

export default i18n
