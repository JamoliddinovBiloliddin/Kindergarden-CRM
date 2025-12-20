import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, UtensilsCrossed, Clock } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'

const AdminMeals = () => {
	const { t } = useLanguage()
	const { darkMode, currentTheme } = useTheme()
	const { user } = useAuth()

	if (user?.role === 'director') {
		return (
			<div className="p-6 text-center">
				<h2 className={`w-full text-2xl font-medium transition-colors duration-300 ${
					darkMode ? 'text-white' : 'text-gray-900'
				} focus:outline-none focus:ring-2 focus:ring-blue-500`} >
					Bu bo‘lim direktor uchun mavjud emas
				</h2>
			</div>
		)
	}

	const [meals, setMeals] = useState([])
	const [showModal, setShowModal] = useState(false)
	const [editingMeal, setEditingMeal] = useState(null)
	const [formData, setFormData] = useState({
		mealType: 'breakfast',
		menu: '',
		time: ''
	})

	useEffect(() => {
		loadMeals()
	}, [])

	const loadMeals = () => {
		const stored = JSON.parse(localStorage.getItem('meals') || '[]')
		setMeals(stored)
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		let updated
		if (editingMeal) {
			updated = meals.map(meal =>
				meal.id === editingMeal.id ? { ...meal, ...formData } : meal
			)
		} else {
			const newMeal = {
				id: Date.now(),
				...formData,
				date: new Date().toISOString().split('T')[0],
				createdAt: new Date().toISOString()
			}
			updated = [...meals, newMeal]
		}
		localStorage.setItem('meals', JSON.stringify(updated))
		setMeals(updated)
		setShowModal(false)
		setEditingMeal(null)
		setFormData({ mealType: 'breakfast', menu: '', time: '' })
	}

	// EDIT FUNCTION
	const handleEdit = (meal) => {
		setEditingMeal(meal)
		setFormData({
			mealType: meal.mealType,
			menu: meal.menu,
			time: meal.time
		})
		setShowModal(true)
	}

	// DELETE FUNCTION (alertsiz)
	const handleDelete = (mealId) => {
		const updated = meals.filter(m => m.id !== mealId)
		localStorage.setItem('meals', JSON.stringify(updated))
		setMeals(updated)
	}

	const mealTypes = {
		breakfast: 'Nonushta',
		lunch: 'Tushlik',
		snack: 'Tushlikdan keyin'
	}

	const themeColor = (currentTheme && currentTheme.primary) || '#2563EB'
	const themeHover = (currentTheme && currentTheme.primaryHover) || '#1D4ED8'

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<motion.h1 
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					className={`text-3xl font-bold transition-colors duration-300 ${
						darkMode ? 'text-white' : 'text-gray-900'
					}`}
				>
					{t('modules.meals')}
				</motion.h1>

				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={() => setShowModal(true)}
					className='flex items-center gap-2 px-4 py-2 text-white rounded-[14px] font-medium shadow-sm transition-all duration-300'
					style={{ backgroundColor: themeColor }}
					onMouseEnter={(e) => { e.target.style.backgroundColor = themeHover }}
					onMouseLeave={(e) => { e.target.style.backgroundColor = themeColor }}
				>
					<Plus className='w-5 h-5' />
					{t('meals.addMeal')}
				</motion.button>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{meals.map((meal, index) => (
					<motion.div
						key={meal.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.05 }}
						whileHover={{ y: -2, transition: { duration: 0.2, ease: 'easeOut' } }}
						className={`relative rounded-2xl p-6 transition-all duration-200 ${
							darkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E5E7EB]'
						} border shadow-[0_6px_20px_rgba(0,0,0,0.05)]`}
						style={{ borderTop: darkMode ? undefined : `4px solid ${themeColor}` }}
					>
						<div className='flex items-start justify-between mb-4'>
							<div className='flex items-center gap-2'>
								<UtensilsCrossed className='w-5 h-5' style={{ color: themeColor }} />
								<span className='font-semibold' style={{ color: themeColor }}>
									{mealTypes[meal.mealType]}
								</span>
							</div>
							<span className={`text-xs transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{meal.date}</span>
						</div>
						<p className={`text-sm mb-3 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{meal.menu}</p>
						<div className={`flex items-center gap-2 text-sm transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
							<Clock className='w-4 h-4' />
							{meal.time}
						</div>

						<div className='flex gap-3 mt-4'>
							<button
								onClick={() => handleEdit(meal)}
								className='flex-1 px-3 py-2 text-white rounded-lg text-sm font-medium'
								style={{ backgroundColor: themeColor }}
								onMouseEnter={(e) => { e.target.style.backgroundColor = themeHover }}
								onMouseLeave={(e) => { e.target.style.backgroundColor = themeColor }}
							>
								O‘zgartirish
							</button>

							<button
								onClick={() => handleDelete(meal.id)}
								className='flex-1 px-3 py-2 text-white rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600'
							>
								O‘chirish
							</button>
						</div>
					</motion.div>
				))}
			</div>

			{showModal && (
				<div className='fixed inset-0 backdrop-blur-[12px] bg-black/20 flex items-center justify-center z-50 p-4' onClick={() => setShowModal(false)}>
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{ duration: 0.3 }}
						onClick={(e) => e.stopPropagation()}
						className={`relative rounded-2xl p-6 w-full max-w-md shadow-[0_6px_20px_rgba(0,0,0,0.05)] border ${darkMode ? 'bg-[#1F2937] border-[#334155]' : 'bg-white border-[#E5E7EB]'}`}
						style={{ borderTop: darkMode ? undefined : `4px solid ${themeColor}` }}
					>
						<h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
							{editingMeal ? 'O‘zgartirish' : t('meals.addMeal')}
						</h2>

						<form onSubmit={handleSubmit} className='space-y-4'>
							<div>
								<label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ovqat turi</label>
								<select
									value={formData.mealType}
									onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
									className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${darkMode ? 'bg-[#334155] border-[#475569] text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'}`}
								>
									<option value='breakfast'>Nonushta</option>
									<option value='lunch'>Tushlik</option>
									<option value='snack'>Tushlikdan keyin</option>
								</select>
							</div>

							<div>
								<label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Menu</label>
								<textarea
									value={formData.menu}
									onChange={(e) => setFormData({ ...formData, menu: e.target.value })}
									className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${darkMode ? 'bg-[#334155] border-[#475569] text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'}`}
									rows={3}
									required
								/>
							</div>

							<div>
								<label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Vaqti</label>
								<input
									type='time'
									value={formData.time}
									onChange={(e) => setFormData({ ...formData, time: e.target.value })}
									className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${darkMode ? 'bg-[#334155] border-[#475569] text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'}`}
									required
								/>
							</div>

							<div className='flex gap-3'>
								<button
									type='button'
									onClick={() => { setShowModal(false); setEditingMeal(null) }}
									className={`flex-1 px-4 py-2 border rounded-lg transition-colors duration-300 ${darkMode ? 'bg-[#1E293B] border-[#334155] text-white hover:bg-[#334155]' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
								>
									{t('common.cancel')}
								</button>
								<button
									type='submit'
									className='flex-1 px-4 py-2 text-white rounded-lg transition-all duration-300'
									style={{ backgroundColor: themeColor }}
									onMouseEnter={(e) => { e.target.style.backgroundColor = themeHover }}
									onMouseLeave={(e) => { e.target.style.backgroundColor = themeColor }}
								>
									{t('common.save')}
								</button>
							</div>
						</form>
					</motion.div>
				</div>
			)}
		</div>
	)
}

export default AdminMeals
