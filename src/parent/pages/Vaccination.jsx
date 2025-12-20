import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Syringe, Calendar, CheckCircle, Clock } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useTheme } from '../../contexts/ThemeContext'

const ParentVaccination = () => {
	const { user } = useAuth()
	const { t } = useLanguage()
	const [vaccines, setVaccines] = useState([])
	const [child, setChild] = useState(null)
	const { darkMode, currentTheme } = useTheme()
	const themeColor = (currentTheme && currentTheme.primary) || '#2563EB'
	const themeHover = (currentTheme && currentTheme.primaryHover) || '#1D4ED8'

	useEffect(() => {
		const children = JSON.parse(localStorage.getItem('children') || '[]')
		const foundChild = children.find((c) => c.id === user?.childId)
		setChild(foundChild)

		const stored = JSON.parse(localStorage.getItem('vaccines') || '[]')
		const childVaccines = stored.filter((v) => v.childName === foundChild?.name)
		setVaccines(childVaccines)
	}, [user])

	if (!child) {
		return (
			<div className='flex items-center justify-center h-64'>
				<p className='text-gray-500'>Bola ma'lumotlari topilmadi</p>
			</div>
		)
	}

	return (
		<div className='space-y-6'>
    <h1 className={`text-3xl font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
      {t('modules.vaccination')} - {child.name}
    </h1>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{vaccines.map((vaccine) => (
					<motion.div
						key={vaccine.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className={`bg-white rounded-xl shadow-sm border p-6 ${
							vaccine.status === 'completed'
								? 'border-green-200'
								: 'border-orange-200'
						}`}
					>
						<div className='flex items-start justify-between mb-4'>
							<Syringe
								className={`w-6 h-6 ${
									vaccine.status === 'completed'
										? 'text-green-500'
										: 'text-orange-500'
								}`}
							/>
							{vaccine.status === 'completed' ? (
								<CheckCircle className='w-5 h-5 text-green-500' />
							) : (
								<Clock className='w-5 h-5 text-orange-500' />
							)}
						</div>
						<p className='text-sm text-gray-600 mb-2'>{vaccine.vaccineName}</p>
						<div className='flex items-center gap-2 text-sm text-gray-500 mb-3'>
							<Calendar className='w-4 h-4' />
							{vaccine.dueDate}
						</div>
						<span
							className={`px-3 py-1 rounded-full text-xs font-semibold ${
								vaccine.status === 'completed'
									? 'bg-green-100 text-green-700'
									: 'bg-orange-100 text-orange-700'
							}`}
						>
							{vaccine.status === 'completed' ? 'Yakunlangan' : 'Kutilmoqda'}
						</span>
					</motion.div>
				))}
			</div>
		</div>
	)
}

export default ParentVaccination

