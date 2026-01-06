import { createContext, useContext, useState, useEffect } from 'react'
import i18n from '../i18n/config'

const LanguageContext = createContext()

export const useLanguage = () => {
	const context = useContext(LanguageContext)
	if (!context) {
		throw new Error('useLanguage must be used within LanguageProvider')
	}
	return context
}

const LANGUAGES = [
	{ code: 'en', name: 'English', nativeName: 'English' },
	{ code: 'ru', name: 'Russian', nativeName: 'Русский' },
	{ code: 'uz', name: 'Uzbek', nativeName: 'O\'zbek' },
	{ code: 'uz-cyrl', name: 'Uzbek Cyrillic', nativeName: 'Ўзбек' }
]

export const LanguageProvider = ({ children }) => {
	const [language, setLanguage] = useState(() => {
		const stored = localStorage.getItem('language')
		return stored || 'uz'
	})

	useEffect(() => {
		i18n.changeLanguage(language)
		localStorage.setItem('language', language)
	}, [language])

	const changeLanguage = (lang) => {
		setLanguage(lang)
		i18n.changeLanguage(lang)
	}

	return (
		<LanguageContext.Provider
			value={{
				language,
				languages: LANGUAGES,
				changeLanguage,
				t: (key) => i18n.t(key)
			}}
		>
			{children}
		</LanguageContext.Provider>
	)
}

