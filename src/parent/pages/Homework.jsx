import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookCheck, CheckCircle, XCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useTheme } from '../../contexts/ThemeContext'

const ParentHomework = () => {
	const { user } = useAuth()
	const { t } = useLanguage()
	const { darkMode, currentTheme } = useTheme()
	const themeColor = (currentTheme && currentTheme.primary) || '#2563EB'

	const [homework, setHomework] = useState([])
	const [child, setChild] = useState(null)

	useEffect(() => {
		// Load children to find current child info (name and groupId)
		const children = JSON.parse(localStorage.getItem('children') || '[]')
		const foundChild = children.find((c) => c.id === user?.childId)
		setChild(foundChild)

		const stored = JSON.parse(localStorage.getItem('homework') || '[]')

		if (foundChild) {
			// Filter homework by groupId
			const childHomework = stored.filter((h) => h.groupId === foundChild.groupId)
			setHomework(childHomework)
		}
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
				{t('modules.homework')} - {child.name}
			</h1>

			<div className='space-y-4'>
				{homework.map((hw) => (
					<motion.div
						key={hw.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className={`${cardBg} rounded-xl shadow-sm border p-6`}
						style={{ borderTop: darkMode ? undefined : `4px solid ${themeColor}` }}
					>
						<div className='flex items-start justify-between mb-4'>
							<div className='flex items-center gap-3'>
								<BookCheck className='w-6 h-6 text-blue-500' />
								<div>
									<h3 className={`font-bold ${textPrimary}`}>{hw.title}</h3>
									<p className={`text-sm ${textSecondary}`}>{hw.date}</p>
								</div>
							</div>
							{hw.status === 'done' ? (
								<CheckCircle className='w-6 h-6 text-green-500' />
							) : (
								<XCircle className='w-6 h-6 text-orange-500' />
							)}
						</div>
						<p className={`${textSecondary} mb-3`}>{hw.description}</p>
						<span
							className={`px-3 py-1 rounded-full text-xs font-semibold ${hw.status === 'done'
									? 'bg-green-100 text-green-700'
									: 'bg-orange-100 text-orange-700'
								}`}
						>
							{hw.status === 'done' ? 'Bajarildi' : 'Bajarilmadi'}
						</span>
					</motion.div>
				))}
			</div>
		</div>
	)
}

export default ParentHomework
