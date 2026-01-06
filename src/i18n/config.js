import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enTranslations from './locales/en.json'
import ruTranslations from './locales/ru.json'
import uzTranslations from './locales/uz.json'
import uzCyrlTranslations from './locales/uz-cyrl.json'

i18n.use(initReactI18next).init({
	resources: {
		en: { translation: enTranslations },
		ru: { translation: ruTranslations },
		uz: { translation: uzTranslations },
		'uz-cyrl': { translation: uzCyrlTranslations }
	},
	lng: localStorage.getItem('language') || 'uz',
	fallbackLng: 'uz',
	interpolation: {
		escapeValue: false
	}
})

export default i18n

