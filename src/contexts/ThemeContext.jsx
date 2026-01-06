import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
	const context = useContext(ThemeContext)
	if (!context) {
		throw new Error('useTheme must be used within ThemeProvider')
	}
	return context
}

const THEMES = {
	'ocean-blue': {
		name: 'Ocean Blue',
		primary: '#2563EB',
		primaryDark: '#1E40AF', // 12-18% darker
		primaryLight: 'rgba(37, 99, 235, 0.15)', // 15-20% transparent
		primaryBorder: 'rgba(37, 99, 235, 0.35)', // 35% opacity
		primaryBg: 'rgba(37, 99, 235, 0.08)', // 70-85% low opacity
		primaryHover: '#1D4ED8' // 10% darker
	},
	'nature-green': {
		name: 'Nature Green',
		primary: '#16A34A',
		primaryDark: '#15803D',
		primaryLight: 'rgba(22, 163, 74, 0.15)',
		primaryBorder: 'rgba(22, 163, 74, 0.35)',
		primaryBg: 'rgba(22, 163, 74, 0.08)',
		primaryHover: '#15803D'
	},
	'royal-purple': {
		name: 'Royal Purple',
		primary: '#7C3AED',
		primaryDark: '#6D28D9',
		primaryLight: 'rgba(124, 58, 237, 0.15)',
		primaryBorder: 'rgba(124, 58, 237, 0.35)',
		primaryBg: 'rgba(124, 58, 237, 0.08)',
		primaryHover: '#6D28D9'
	},
	'sunset-orange': {
		name: 'Sunset Orange',
		primary: '#F97316',
		primaryDark: '#EA580C',
		primaryLight: 'rgba(249, 115, 22, 0.15)',
		primaryBorder: 'rgba(249, 115, 22, 0.35)',
		primaryBg: 'rgba(249, 115, 22, 0.08)',
		primaryHover: '#EA580C'
	}
}

export const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState(() => {
		const stored = localStorage.getItem('theme')
		return stored || 'ocean-blue'
	})
	const [darkMode, setDarkMode] = useState(() => {
		const stored = localStorage.getItem('darkMode')
		return stored === 'true'
	})

	useEffect(() => {
		localStorage.setItem('theme', theme)
		// Apply theme colors to CSS variables
		const currentTheme = THEMES[theme]
		if (currentTheme) {
			document.documentElement.style.setProperty('--theme-primary', currentTheme.primary)
			document.documentElement.style.setProperty('--theme-primary-dark', currentTheme.primaryDark)
			document.documentElement.style.setProperty('--theme-primary-light', currentTheme.primaryLight)
			document.documentElement.style.setProperty('--theme-primary-border', currentTheme.primaryBorder)
			document.documentElement.style.setProperty('--theme-primary-bg', currentTheme.primaryBg)
			document.documentElement.style.setProperty('--theme-primary-hover', currentTheme.primaryHover)
		}
	}, [theme])

	useEffect(() => {
		localStorage.setItem('darkMode', darkMode.toString())
		document.documentElement.classList.toggle('dark', darkMode)
	}, [darkMode])

	const toggleDarkMode = () => {
		setDarkMode(!darkMode)
	}

	const changeTheme = (newTheme) => {
		setTheme(newTheme)
	}

	return (
		<ThemeContext.Provider
			value={{
				theme,
				themes: THEMES,
				currentTheme: THEMES[theme],
				darkMode,
				toggleDarkMode,
				changeTheme
			}}
		>
			{children}
		</ThemeContext.Provider>
	)
}

