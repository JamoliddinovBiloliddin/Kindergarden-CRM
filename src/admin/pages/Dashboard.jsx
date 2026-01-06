import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, UtensilsCrossed, Syringe, CalendarCheck } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import { useTheme } from '../../contexts/ThemeContext'

const AdminDashboard = () => {
	const { t } = useLanguage()
	const { currentTheme, darkMode } = useTheme()
	const [stats, setStats] = useState({
		totalChildren: 0,
		todayMeals: 0,
		pendingVaccines: 0,
		todayAttendance: 0
	})

	useEffect(() => {
		let children = [], meals = [], vaccines = [], attendance = {}
		try { children = JSON.parse(localStorage.getItem('children') || '[]') } catch (e) { }
		try { meals = JSON.parse(localStorage.getItem('meals') || '[]') } catch (e) { }
		try { vaccines = JSON.parse(localStorage.getItem('vaccines') || '[]') } catch (e) { }
		try { attendance = JSON.parse(localStorage.getItem('attendance') || '{}') } catch (e) { }

		const today = new Date().toISOString().split('T')[0]
		const todayMeals = meals.filter(m => m.date === today).length
		const pendingVaccines = vaccines.filter(v => v.status === 'pending').length
		const todayAttendance = Object.keys(attendance[today] || {}).length

		setStats({
			totalChildren: children.length,
			todayMeals,
			pendingVaccines,
			todayAttendance
		})
	}, [])

	const statCards = [
		{
			title: 'Jami Bolalar',
			value: stats.totalChildren,
			icon: Users,
			iconBg: darkMode ? 'rgba(37, 99, 235, 0.15)' : 'rgba(37, 99, 235, 0.08)',
			iconColor: '#2563EB'
		},
		{
			title: 'Bugungi Ovqatlar',
			value: stats.todayMeals,
			icon: UtensilsCrossed,
			iconBg: darkMode ? 'rgba(22, 163, 74, 0.15)' : 'rgba(22, 163, 74, 0.08)',
			iconColor: '#16A34A'
		},
		{
			title: 'Kutilayotgan Emlashlar',
			value: stats.pendingVaccines,
			icon: Syringe,
			iconBg: darkMode ? 'rgba(249, 115, 22, 0.15)' : 'rgba(249, 115, 22, 0.08)',
			iconColor: '#F97316'
		},
		{
			title: 'Bugungi Qabul',
			value: stats.todayAttendance,
			icon: CalendarCheck,
			iconBg: darkMode ? 'rgba(124, 58, 237, 0.15)' : 'rgba(124, 58, 237, 0.08)',
			iconColor: '#7C3AED'
		}
	]

	const themeColor = (currentTheme && currentTheme.primary) || '#2563EB'

	return (
		<div className='space-y-6'>
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className={`relative rounded-2xl p-6 transition-all duration-200 ${darkMode
						? 'bg-[#1E293B] border-[#334155]'
						: 'bg-white border-[#E5E7EB]'
					} border shadow-[0_6px_20px_rgba(0,0,0,0.06)] hover:-translate-y-0.5`}
				style={{
					borderTop: darkMode ? undefined : `4px solid ${themeColor}`
				}}
			>
				<h1 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'
					}`}>Admin Panel</h1>
				<p className={`transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'
					}`}>Boshqaruv paneliga xush kelibsiz</p>
			</motion.div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				{statCards.map((stat, index) => {
					const Icon = stat.icon
					return (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1, duration: 0.4 }}
							whileHover={{ y: -2, transition: { duration: 0.2, ease: 'easeOut' } }}
							className={`relative rounded-2xl p-6 transition-all duration-200 ${darkMode
									? 'bg-[#1E293B] border-[#334155]'
									: 'bg-white border-[#E5E7EB]'
								} border shadow-[0_6px_20px_rgba(0,0,0,0.06)]`}
							style={{
								borderTop: darkMode ? undefined : `4px solid ${stat.iconColor}`
							}}
						>
							<div className='flex items-center justify-between'>
								<div>
									<p className={`text-sm font-medium mb-1 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'
										}`}>
										{stat.title}
									</p>
									<p className={`text-3xl font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'
										}`}>{stat.value}</p>
								</div>
								<motion.div
									whileHover={{ scale: 1.1, rotate: 5 }}
									className='p-3 rounded-[14px] shadow-sm'
									style={{
										backgroundColor: stat.iconBg
									}}
								>
									<Icon
										className='w-6 h-6'
										style={{ color: stat.iconColor }}
									/>
								</motion.div>
							</div>
						</motion.div>
					)
				})}
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.2 }}
					whileHover={{ y: -2, transition: { duration: 0.2, ease: 'easeOut' } }}
					className={`relative rounded-2xl p-6 transition-all duration-200 ${darkMode
							? 'bg-[#1E293B] border-[#334155]'
							: 'bg-white border-[#E5E7EB]'
						} border shadow-[0_6px_20px_rgba(0,0,0,0.06)]`}
					style={{
						borderTop: darkMode ? undefined : `4px solid ${themeColor}`
					}}
				>
					<h3 className={`text-xl font-bold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'
						}`}>So'nggi Faoliyatlar</h3>
					<div className='space-y-3'>
						{[1, 2, 3].map((i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: i * 0.1 }}
								className={`flex items-center gap-3 p-3 rounded-[14px] transition-colors duration-300 ${darkMode
										? 'bg-[#334155]'
										: 'bg-gray-50'
									}`}
							>
								<div className='w-2 h-2 rounded-full' style={{ backgroundColor: themeColor }} />
								<div className='flex-1'>
									<p className={`text-sm font-medium transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'
										}`}>Yangi ovqat qo'shildi</p>
									<p className={`text-xs transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'
										}`}>5 daqiqa oldin</p>
								</div>
							</motion.div>
						))}
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.3 }}
					whileHover={{ y: -2, transition: { duration: 0.2, ease: 'easeOut' } }}
					className={`relative rounded-2xl p-6 transition-all duration-200 ${darkMode
							? 'bg-[#1E293B] border-[#334155]'
							: 'bg-white border-[#E5E7EB]'
						} border shadow-[0_6px_20px_rgba(0,0,0,0.06)]`}
					style={{
						borderTop: darkMode ? undefined : `4px solid ${themeColor}`
					}}
				>
					<h3 className={`text-xl font-bold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'
						}`}>Statistika</h3>

					<div className='space-y-6'>
						{/* Qabul qilinganlar */}
						<div>
							<div className='flex justify-between mb-2 items-center'>
								<span className={`text-sm font-semibold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'
									}`}>Qabul qilinganlar</span>
								<span className={`text-lg font-extrabold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'
									}`}>85%</span>
							</div>
							<div className={`w-full rounded-full h-2 transition-colors duration-300 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'
								}`}>
								<motion.div
									initial={{ width: 0 }}
									animate={{ width: '85%' }}
									transition={{ duration: 1, delay: 0.5 }}
									className='h-2 rounded-full'
									style={{ backgroundColor: themeColor }}
								/>
							</div>
						</div>

						{/* Ovqatlanish */}
						<div>
							<div className='flex justify-between mb-2 items-center'>
								<span className={`text-sm font-semibold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'
									}`}>Ovqatlanish</span>
								<span className={`text-lg font-extrabold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'
									}`}>92%</span>
							</div>
							<div className={`w-full rounded-full h-2 transition-colors duration-300 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'
								}`}>
								<motion.div
									initial={{ width: 0 }}
									animate={{ width: '92%' }}
									transition={{ duration: 1, delay: 0.7 }}
									className='h-2 rounded-full'
									style={{ backgroundColor: themeColor }}
								/>
							</div>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	)
}

export default AdminDashboard
