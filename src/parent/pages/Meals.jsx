import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { UtensilsCrossed, Clock } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useTheme } from '../../contexts/ThemeContext'

const ParentMeals = () => {
	const { user } = useAuth()
	const { t } = useLanguage()
	const [meals, setMeals] = useState([])
	const [child, setChild] = useState(null)
	const { darkMode, currentTheme } = useTheme()
	const themeColor = (currentTheme && currentTheme.primary) || '#2563EB'
	const themeHover = (currentTheme && currentTheme.primaryHover) || '#1D4ED8'

	useEffect(() => {
		const children = JSON.parse(localStorage.getItem('children') || '[]')
		const foundChild = children.find((c) => c.id === user?.childId)
		setChild(foundChild)

		const stored = JSON.parse(localStorage.getItem('meals') || '[]')
		const childMeals = stored.filter((m) => m.childName === foundChild?.name)
		setMeals(childMeals)
	}, [user])

	const mealTypes = {
		breakfast: 'Nonushta',
		lunch: 'Tushlik',
		snack: 'Tushlikdan keyin'
	}

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
  {t('modules.meals')} - {child.name}
</h1>


			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{meals.map((meal) => (
					<motion.div
						key={meal.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'
					>
						<div className='flex items-start justify-between mb-4'>
							<div className='flex items-center gap-2'>
								<UtensilsCrossed className='w-5 h-5 text-purple-500' />
								<span className='font-semibold text-purple-600'>
									{mealTypes[meal.mealType]}
								</span>
							</div>
							<span className='text-xs text-gray-500'>{meal.date}</span>
						</div>
						<p className='text-sm text-gray-600 mb-3'>{meal.menu}</p>
						<div className='flex items-center gap-2 text-sm text-gray-500'>
							<Clock className='w-4 h-4' />
							{meal.time}
						</div>
					</motion.div>
				))}
			</div>

			{meals.length === 0 && (
				<div className='text-center py-12'>
					<p className='text-gray-500'>Hozircha ovqat yozuvlari yo'q</p>
				</div>
			)}
		</div>
	)
}

export default ParentMeals

