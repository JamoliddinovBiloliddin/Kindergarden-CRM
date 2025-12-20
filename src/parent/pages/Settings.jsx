import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, User, Bell, Palette } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useLanguage } from '../../contexts/LanguageContext'

const TeacherSettings = () => {
	const { user } = useAuth()
	const { theme, themes, changeTheme, darkMode, toggleDarkMode, currentTheme } = useTheme()
	const { language, languages, changeLanguage, t } = useLanguage()
	const [profile, setProfile] = useState({
		name: user?.name || '',
		email: user?.email || '',
		phone: user?.phone || ''
	})

	const handleSave = () => {
		alert('Sozlamalar saqlandi!')
	}

	const themeColor = (currentTheme && currentTheme.primary) || '#2563EB'

	return (
		<div className='space-y-6'>
			<motion.h1 
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				className={`text-3xl font-bold transition-colors duration-300 ${
					darkMode ? 'text-white' : 'text-gray-900'
				}`}
			>
				{t('common.settings')}
			</motion.h1>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* Profile Settings */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className={`relative rounded-2xl p-6 transition-all duration-200 ${
						darkMode 
							? 'bg-[#1E293B] border-[#334155]' 
							: 'bg-white border-[#E5E7EB]'
					} border shadow-[0_6px_20px_rgba(0,0,0,0.05)]`}
					style={{
						borderTop: darkMode ? undefined : `4px solid ${themeColor}`
					}}
				>
					<div className='flex items-center gap-3 mb-6'>
						<User className='w-6 h-6' style={{ color: themeColor }} />
						<h2 className={`text-xl font-bold transition-colors duration-300 ${
							darkMode ? 'text-white' : 'text-gray-900'
						}`}>Profil</h2>
					</div>
					<div className='space-y-4'>
						<div>
							<label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
								darkMode ? 'text-gray-300' : 'text-gray-700'
							}`}>{t('common.name')}</label>
							<input
								type='text'
								value={profile.name}
								onChange={(e) =>
									setProfile({ ...profile, name: e.target.value })
								}
								className={`w-full px-4 py-2 border rounded-[14px] transition-colors duration-300 ${
									darkMode 
										? 'bg-[#334155] border-[#475569] text-white' 
										: 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'
								} focus:outline-none focus:ring-2 focus:ring-blue-500`}
							/>
						</div>
						<div>
							<label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
								darkMode ? 'text-gray-300' : 'text-gray-700'
							}`}>Email</label>
							<input
								type='email'
								value={profile.email}
								onChange={(e) =>
									setProfile({ ...profile, email: e.target.value })
								}
								className={`w-full px-4 py-2 border rounded-[14px] transition-colors duration-300 ${
									darkMode 
										? 'bg-[#334155] border-[#475569] text-white' 
										: 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'
								} focus:outline-none focus:ring-2 focus:ring-blue-500`}
							/>
						</div>
						<div>
							<label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
								darkMode ? 'text-gray-300' : 'text-gray-700'
							}`}>Telefon</label>
							<input
								type='tel'
								value={profile.phone}
								onChange={(e) =>
									setProfile({ ...profile, phone: e.target.value })
								}
								className={`w-full px-4 py-2 border rounded-[14px] transition-colors duration-300 ${
									darkMode 
										? 'bg-[#334155] border-[#475569] text-white' 
										: 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'
								} focus:outline-none focus:ring-2 focus:ring-blue-500`}
							/>
						</div>
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={handleSave}
							className='w-full px-4 py-3 text-white rounded-[14px] font-medium shadow-sm transition-all duration-300'
							style={{ backgroundColor: themeColor }}
							onMouseEnter={(e) => {
								e.target.style.backgroundColor = (currentTheme && currentTheme.primaryHover) || '#1D4ED8'
							}}
							onMouseLeave={(e) => {
								e.target.style.backgroundColor = themeColor
							}}
						>
							{t('common.save')}
						</motion.button>
					</div>
				</motion.div>

				{/* Theme Settings */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className={`relative rounded-2xl p-6 transition-all duration-200 ${
						darkMode 
							? 'bg-[#1E293B] border-[#334155]' 
							: 'bg-white border-[#E5E7EB]'
					} border shadow-[0_6px_20px_rgba(0,0,0,0.05)]`}
					style={{
						borderTop: darkMode ? undefined : `4px solid ${themeColor}`
					}}
				>
					<div className='flex items-center gap-3 mb-6'>
						<Palette className='w-6 h-6' style={{ color: themeColor }} />
						<h2 className={`text-xl font-bold transition-colors duration-300 ${
							darkMode ? 'text-white' : 'text-gray-900'
						}`}>Tema</h2>
					</div>
					<div className='space-y-4'>
						<div>
							<label className={`block text-sm font-medium mb-3 transition-colors duration-300 ${
								darkMode ? 'text-gray-300' : 'text-gray-700'
							}`}>Ranglar</label>
							<div className='grid grid-cols-2 gap-3'>
								{Object.keys(themes || {}).map((themeKey) => {
									const isActive = theme === themeKey
									return (
										<motion.button
											key={themeKey}
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											onClick={() => changeTheme(themeKey)}
											className={`p-4 rounded-[14px] border-2 transition-all duration-300 ${
												isActive
													? darkMode
														? 'border-white shadow-md'
														: 'border-gray-900 shadow-md'
													: darkMode
														? 'border-[#334155] hover:border-[#475569]'
														: 'border-[#E5E7EB] hover:border-gray-300'
											}`}
										>
											<div
												className='w-full h-10 rounded-[10px] mb-2'
												style={{ backgroundColor: themes[themeKey]?.primary || '#2563EB' }}
											/>
											<p className={`text-sm font-medium transition-colors duration-300 ${
												isActive 
													? darkMode
														? 'text-white' 
														: 'text-gray-900'
													: darkMode
														? 'text-gray-400'
														: 'text-gray-600'
											}`}>
												{themes[themeKey]?.name || themeKey}
											</p>
										</motion.button>
									)
								})}
							</div>
						</div>
						<div>
							<label className={`block text-sm font-medium mb-3 transition-colors duration-300 ${
								darkMode ? 'text-gray-300' : 'text-gray-700'
							}`}>Qora rejim</label>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={toggleDarkMode}
								className={`w-full px-4 py-3 rounded-[14px] font-medium transition-all duration-300 ${
									darkMode
										? 'bg-[#1E293B] text-white border border-[#334155]'
										: 'bg-[#F5F6FA] text-gray-800 border border-[#E5E7EB]'
								}`}
							>
								{darkMode ? 'Qora rejim yoqilgan' : 'Qora rejim o\'chirilgan'}
							</motion.button>
						</div>
					</div>
				</motion.div>

				{/* Language Settings */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className={`relative rounded-2xl p-6 transition-all duration-200 ${
						darkMode 
							? 'bg-[#1E293B] border-[#334155]' 
							: 'bg-white border-[#E5E7EB]'
					} border shadow-[0_6px_20px_rgba(0,0,0,0.05)]`}
					style={{
						borderTop: darkMode ? undefined : `4px solid ${themeColor}`
					}}
				>
					<div className='flex items-center gap-3 mb-6'>
						<Bell className='w-6 h-6' style={{ color: themeColor }} />
						<h2 className={`text-xl font-bold transition-colors duration-300 ${
							darkMode ? 'text-white' : 'text-gray-900'
						}`}>Til</h2>
					</div>
					<div className='space-y-2'>
						{(languages || []).map((lang) => (
							<motion.button
								key={lang.code}
								whileHover={{ scale: 1.01, x: 4 }}
								whileTap={{ scale: 0.99 }}
								onClick={() => changeLanguage(lang.code)}
								className={`w-full text-left px-4 py-3 rounded-[14px] transition-all duration-300 ${
									language === lang.code
										? 'text-white shadow-sm'
										: darkMode
											? 'bg-[#334155] hover:bg-[#475569] text-gray-300'
											: 'bg-[#F5F6FA] hover:bg-[#E5E7EB] text-gray-700'
								}`}
								style={language === lang.code ? {
									backgroundColor: themeColor
								} : {}}
							>
								{lang.nativeName}
							</motion.button>
						))}
					</div>
				</motion.div>
			</div>
		</div>
	)
}

export default TeacherSettings

