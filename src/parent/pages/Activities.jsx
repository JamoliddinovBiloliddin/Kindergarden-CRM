import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Calendar, Clock } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import { useTheme } from '../../contexts/ThemeContext'

const ParentActivities = () => {
	const { t } = useLanguage()
	const { darkMode, currentTheme } = useTheme()
	const themeColor = (currentTheme && currentTheme.primary) || '#2563EB'
	const themeHover = (currentTheme && currentTheme.primaryHover) || '#1D4ED8'

	const [activities, setActivities] = useState([])

	useEffect(() => {
		const stored = JSON.parse(localStorage.getItem('activities') || '[]')
		setActivities(stored)
	}, [])

	// Ranglarni moslash
	const cardBg = darkMode ? 'bg-[#1E293B]' : 'bg-white'
	const textPrimary = darkMode ? 'text-white' : 'text-gray-800'
	const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500'

	return (
		<div className='space-y-6'>
			<h1 className={`text-3xl font-bold transition-colors duration-300 ${textPrimary}`}>
				{t('modules.activities')}
			</h1>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				{activities.map((activity) => (
					<motion.div
						key={activity.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className={`${cardBg} rounded-xl shadow-sm border-t p-6`}
						style={{
							borderTop: darkMode ? undefined : `4px solid ${themeColor}`
						}}
					>
						<div className='flex items-start justify-between mb-4'>
							<BookOpen className='w-6 h-6 text-blue-500' />
							<span className={`text-xs ${textSecondary}`}>{activity.date}</span>
						</div>
						<h3 className={`font-bold mb-2 ${textPrimary}`}>{activity.title}</h3>
						<p className={`text-sm mb-4 ${textSecondary}`}>{activity.description}</p>
						<div className={`flex items-center gap-4 text-sm ${textSecondary}`}>
							<div className='flex items-center gap-1'>
								<Clock className='w-4 h-4' />
								{activity.time}
							</div>
							<div className='flex items-center gap-1'>
								<Calendar className='w-4 h-4' />
								{activity.group}
							</div>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	)
}

export default ParentActivities
