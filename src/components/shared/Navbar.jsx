import { motion } from 'framer-motion'
import { Menu, Bell, Moon, Sun, Globe } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'

const Navbar = ({ role, onMenuClick }) => {
	const { user, logout } = useAuth()
	const { darkMode, toggleDarkMode, currentTheme, themes, changeTheme } = useTheme()
	const { language, languages, changeLanguage } = useLanguage()
	const navigate = useNavigate()
	const languageRef = useRef(null)
	const themeRef = useRef(null)

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (languageRef.current && !languageRef.current.contains(event.target)) {
				const dropdown = languageRef.current.querySelector('.language-dropdown')
				if (dropdown) dropdown.classList.add('hidden')
			}
			if (themeRef.current && !themeRef.current.contains(event.target)) {
				const dropdown = themeRef.current.querySelector('.theme-dropdown')
				if (dropdown) dropdown.classList.add('hidden')
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const handleLogout = () => {
		logout()
		navigate('/')
	}

	const getLogoutButtonStyle = () => {
		if (currentTheme && currentTheme.primary) {
			return {
				backgroundColor: currentTheme.primary,
				transition: 'all 0.3s ease'
			}
		}
		return {
			backgroundColor: '#EF4444',
			transition: 'all 0.3s ease'
		}
	}

	const getLogoutButtonHoverStyle = () => {
		if (currentTheme && currentTheme.primaryHover) {
			return currentTheme.primaryHover
		}
		return '#DC2626'
	}

	return (
		<motion.nav
			initial={{ y: -20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.3 }}
			className={`${
				darkMode 
					? 'bg-[#020617] border-[#334155] text-white' 
					: 'bg-[#FFFFFF] border-[#E5E7EB] text-gray-900'
			} border-b shadow-sm px-4 py-3 flex items-center justify-between fixed top-0 left-0 md:left-64 right-0 z-30 transition-colors duration-300`}
		>
			<button
				onClick={onMenuClick}
				className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
					darkMode 
						? 'hover:bg-[#334155] text-white' 
						: 'hover:bg-gray-100 text-gray-900'
				}`}
			>
				<Menu className='w-6 h-6' />
			</button>

			<div className='flex items-center gap-4 ml-auto'>
				{/* Notifications */}
				<button className={`p-2 rounded-lg transition-colors duration-300 relative ${
					darkMode 
						? 'hover:bg-[#334155] text-white' 
						: 'hover:bg-gray-100 text-gray-900'
				}`}>
					<Bell className='w-5 h-5' />
					<span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
				</button>

				{/* Language Switcher */}
				<div className='relative' ref={languageRef}>
					<button
						onClick={(e) => {
							e.stopPropagation()
							const dropdown = e.currentTarget.nextElementSibling
							document.querySelectorAll('.language-dropdown').forEach(d => {
								if (d !== dropdown) d.classList.add('hidden')
							})
							dropdown?.classList.toggle('hidden')
						}}
						className={`p-2 rounded-lg transition-colors duration-300 ${
							darkMode 
								? 'hover:bg-[#334155] text-white' 
								: 'hover:bg-gray-100 text-gray-900'
						}`}
					>
						<Globe className='w-5 h-5' />
					</button>
					<div className={`language-dropdown absolute right-0 mt-2 w-40 rounded-lg shadow-lg z-50 hidden transition-colors duration-300 ${
						darkMode 
							? 'bg-[#1E293B] border-[#334155]' 
							: 'bg-white border-gray-200'
					} border`}>
						{languages.map((lang) => (
							<button
								key={lang.code}
								onClick={() => {
									changeLanguage(lang.code)
									document.querySelectorAll('.language-dropdown').forEach(d => d.classList.add('hidden'))
								}}
								className={`w-full text-left px-4 py-2 first:rounded-t-lg last:rounded-b-lg transition-colors duration-300 ${
									darkMode 
										? `hover:bg-[#334155] ${language === lang.code ? 'bg-[#334155]' : ''} text-white`
										: `hover:bg-gray-100 ${language === lang.code ? 'bg-purple-50' : ''} text-gray-900`
								}`}
							>
								{lang.nativeName}
							</button>
						))}
					</div>
				</div>

				{/* Theme Switcher */}
				<div className='relative' ref={themeRef}>
					<button
						onClick={(e) => {
							e.stopPropagation()
							const dropdown = e.currentTarget.nextElementSibling
							document.querySelectorAll('.theme-dropdown').forEach(d => {
								if (d !== dropdown) d.classList.add('hidden')
							})
							dropdown?.classList.toggle('hidden')
						}}
						className={`p-2 rounded-lg transition-colors duration-300 ${
							darkMode 
								? 'hover:bg-[#334155] text-white' 
								: 'hover:bg-gray-100 text-gray-900'
						}`}
					>
						{darkMode ? (
							<Sun className='w-5 h-5' />
						) : (
							<Moon className='w-5 h-5' />
						)}
					</button>
					<div className={`theme-dropdown absolute right-0 mt-2 w-40 rounded-[14px] shadow-xl border z-50 hidden transition-colors duration-300 ${
						darkMode 
							? 'bg-[#1E293B] border-[#334155]' 
							: 'bg-white border-gray-200'
					}`}>
						{Object.keys(themes || {}).map((themeKey) => {
							const theme = themes[themeKey]
							if (!theme) return null
							return (
								<button
									key={themeKey}
									onClick={() => {
										changeTheme(themeKey)
										document.querySelectorAll('.theme-dropdown').forEach(d => d.classList.add('hidden'))
									}}
									className={`w-full text-left px-4 py-2 first:rounded-t-[14px] last:rounded-b-[14px] flex items-center gap-2 transition-colors duration-200 ${
										darkMode 
											? `hover:bg-[#334155] ${currentTheme && currentTheme.name === theme.name ? 'bg-[#334155]' : ''} text-white`
											: `hover:bg-gray-100 ${currentTheme && currentTheme.name === theme.name ? 'bg-gray-50' : ''} text-gray-900`
									}`}
								>
									<div
										className='w-4 h-4 rounded-full'
										style={{ backgroundColor: theme.primary || '#2563EB' }}
									/>
									{theme.name || themeKey}
								</button>
							)
						})}
					</div>
				</div>

				{/* User Info */}
				<div className='flex items-center gap-3'>
					<div className='text-right hidden md:block'>
						<p className={`text-sm font-semibold transition-colors duration-300 ${
							darkMode ? 'text-white' : 'text-gray-900'
						}`}>{user?.name}</p>
						<p className={`text-xs capitalize transition-colors duration-300 ${
							darkMode ? 'text-gray-400' : 'text-gray-500'
						}`}>{user?.role}</p>
					</div>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={handleLogout}
						className='px-4 py-2 text-white rounded-[14px] font-medium transition-all duration-300 shadow-sm'
						style={getLogoutButtonStyle()}
						onMouseEnter={(e) => {
							e.target.style.backgroundColor = getLogoutButtonHoverStyle()
						}}
						onMouseLeave={(e) => {
							const style = getLogoutButtonStyle()
							e.target.style.backgroundColor = style.backgroundColor
						}}
					>
						Chiqish
					</motion.button>
				</div>
			</div>
		</motion.nav>
	)
}

export default Navbar

