import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Moon, Clock } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useTheme } from '../../contexts/ThemeContext'

const ParentSleep = () => {
	const { user } = useAuth()
	const { t } = useLanguage()
	const { darkMode, currentTheme } = useTheme()
	const themeColor = (currentTheme && currentTheme.primary) || '#2563EB'

	const [sleepRecords, setSleepRecords] = useState([])
	const [child, setChild] = useState(null)

	useEffect(() => {
		const children = JSON.parse(localStorage.getItem('children') || '[]')
		const foundChild = children.find((c) => c.id === user?.childId)
		setChild(foundChild)

		const stored = JSON.parse(localStorage.getItem('sleep') || '[]')
		const childSleep = stored.filter((s) => s.childName === foundChild?.name)
		setSleepRecords(childSleep)
	}, [user])

	if (!child) {
		return (
			<div className='flex items-center justify-center h-64'>
				<p className='text-gray-500'>Bola ma'lumotlari topilmadi</p>
			</div>
		)
	}

	const cardBg = darkMode ? 'bg-[#1E293B]' : 'bg-white'
	const textPrimary = darkMode ? 'text-white' : 'text-gray-800'
	const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600'

	return (
		<div className='space-y-6'>
			<h1 className={`text-3xl font-bold transition-colors duration-300 ${textPrimary}`}>
				{t('modules.sleep')} - {child.name}
			</h1>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				{sleepRecords.map((record) => (
					<motion.div
						key={record.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className={`${cardBg} rounded-xl shadow-sm border p-6`}
						style={{ borderTop: darkMode ? undefined : `4px solid ${themeColor}` }}
					>
						<div className='flex items-start justify-between mb-4'>
							<Moon className='w-6 h-6 text-purple-500' />
							<span className={`text-xs ${textSecondary}`}>{record.date}</span>
						</div>
						<div className='space-y-3'>
							<div className={`flex items-center gap-2 text-sm ${textSecondary}`}>
								<Clock className='w-4 h-4' />
								<span>Uyqu boshlanishi:</span>
								<span className='font-semibold'>{record.sleepStart}</span>
							</div>
							<div className={`flex items-center gap-2 text-sm ${textSecondary}`}>
								<Clock className='w-4 h-4' />
								<span>Uyg'onish:</span>
								<span className='font-semibold'>{record.wakeUp}</span>
							</div>
							<div className='pt-3 border-t'>
								<p className='text-sm font-semibold text-purple-600'>
									Davomiylik: {record.duration}
								</p>
							</div>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	)
}

export default ParentSleep
