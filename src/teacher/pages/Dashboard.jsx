import { useState, useEffect } from 'react'
import { Users, UserX, ClipboardList, Calendar, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { teacherData } from '../../mock/teacherData'
import { getAllStudents } from '../../mock/students'
import { useTheme } from '../../contexts/ThemeContext'
import { useLanguage } from '../../contexts/LanguageContext'

const Dashboard = () => {
	const { currentTheme, darkMode } = useTheme()
	const { t } = useLanguage()
	const [teacher] = useState(() => {
		const stored = localStorage.getItem('teacher')
		try {
			return stored ? JSON.parse(stored) : teacherData
		} catch (e) {
			console.error('Error parsing teacher:', e)
			return teacherData
		}
	})

	const [stats, setStats] = useState({
		totalStudents: 0,
		absent: 0,
		tasks: 0
	})

	const [weekCalendar, setWeekCalendar] = useState([])
	const [todaySchedule, setTodaySchedule] = useState([])

	useEffect(() => {
		// Load students
		const students = getAllStudents()

		// Load attendance for today
		const today = new Date().toISOString().split('T')[0]
		let attendanceData = {}
		try {
			attendanceData = JSON.parse(localStorage.getItem('attendance') || '{}')
		} catch (e) {
			console.error('Error parsing attendance:', e)
			attendanceData = {}
		}
		const todayAttendance = attendanceData[today] || {}

		const absentCount = Object.values(todayAttendance).filter(
			status => status === 'absent'
		).length

		setStats({
			totalStudents: students.length,
			absent: absentCount,
			tasks: 3
		})

		// Generate week calendar
		const week = []
		for (let i = 0; i < 7; i++) {
			const date = new Date()
			date.setDate(date.getDate() + i)
			week.push({
				day: date.toLocaleDateString('uz-UZ', { weekday: 'short' }),
				date: date.getDate(),
				month: date.toLocaleDateString('uz-UZ', { month: 'short' }),
				isToday: i === 0,
				fullDate: date.toISOString().split('T')[0]
			})
		}
		setWeekCalendar(week)

		// Mock today's schedule
		setTodaySchedule([
			{ time: '09:00', activity: 'Ertalabki doira', group: 'A guruhi' },
			{ time: '10:30', activity: 'San\'at va hunarmandchilik', group: 'B guruhi' },
			{ time: '14:00', activity: 'Hikoya vaqti', group: 'C guruhi' },
			{ time: '15:30', activity: 'Tashqi o\'yinlar', group: 'Barcha guruhlar' }
		])
	}, [])

	const themeColor = (currentTheme && currentTheme.primary) || '#2563EB'

	const statCards = [
		{
			title: 'Bugungi o\'quvchilar',
			value: stats.totalStudents,
			icon: Users,
			iconColor: themeColor,
			iconBg: darkMode ? 'rgba(37, 99, 235, 0.15)' : 'rgba(37, 99, 235, 0.08)'
		},
		{
			title: 'Yo\'q',
			value: stats.absent,
			icon: UserX,
			iconColor: '#EF4444',
			iconBg: darkMode ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.08)'
		},
		{
			title: 'Bugungi vazifalar',
			value: stats.tasks,
			icon: ClipboardList,
			iconColor: '#7C3AED',
			iconBg: darkMode ? 'rgba(124, 58, 237, 0.15)' : 'rgba(124, 58, 237, 0.08)'
		}
	]

	return (
		<div className='space-y-6'>
			{/* Welcome Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				whileHover={{ y: -2, transition: { duration: 0.2, ease: 'easeOut' } }}
				className={`relative rounded-2xl p-6 transition-all duration-200 ${darkMode
						? 'bg-[#1E293B] border-[#334155]'
						: 'bg-white border-[#E5E7EB]'
					} border shadow-[0_6px_20px_rgba(0,0,0,0.06)]`}
				style={{
					borderTop: darkMode ? undefined : `4px solid ${themeColor}`
				}}
			>
				<h1 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'
					}`}>O'qituvchi Panel</h1>
				<p className={`transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'
					}`}>Salom, {teacher.name}! Boshqaruv paneliga xush kelibsiz</p>
			</motion.div>

			{/* Stats Cards */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				{statCards.map((stat, index) => {
					const Icon = stat.icon
					return (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
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
										}`}>
										{stat.value}
									</p>
								</div>
								<div className='p-3 rounded-lg' style={{ backgroundColor: stat.iconBg }}>
									<Icon className='w-6 h-6' style={{ color: stat.iconColor }} />
								</div>
							</div>
						</motion.div>
					)
				})}
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* Today's Schedule */}
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
					<div className='flex items-center justify-between mb-4'>
						<h3 className={`text-xl font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'
							}`}>Bugungi jadval</h3>
						<Clock className={`w-5 h-5 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-400'
							}`} />
					</div>
					<div className='space-y-3'>
						{todaySchedule.map((item, index) => (
							<div
								key={index}
								className={`flex items-center gap-4 p-3 rounded-lg transition-colors duration-300 ${darkMode
										? 'bg-[#334155] hover:bg-[#3D4A5F]'
										: 'bg-gray-50 hover:bg-gray-100'
									}`}
							>
								<div className={`text-sm font-semibold w-20 transition-colors duration-300 ${darkMode ? 'text-blue-300' : 'text-blue-600'
									}`}>
									{item.time}
								</div>
								<div className='flex-1'>
									<p className={`font-medium transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'
										}`}>{item.activity}</p>
									<p className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'
										}`}>{item.group}</p>
								</div>
							</div>
						))}
					</div>
				</motion.div>

				{/* Weekly Calendar */}
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
					<div className='flex items-center justify-between mb-4'>
						<h3 className={`text-xl font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'
							}`}>Haftalik kalendar</h3>
						<Calendar className={`w-5 h-5 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-400'
							}`} />
					</div>
					<div className='grid grid-cols-7 gap-2'>
						{weekCalendar.map((day, index) => (
							<div
								key={index}
								className={`p-3 rounded-lg text-center transition-colors duration-300 ${day.isToday
										? darkMode
											? 'bg-blue-600 text-white'
											: `text-white`
										: darkMode
											? 'bg-[#334155] text-gray-300'
											: 'bg-gray-50 text-gray-700'
									}`}
								style={day.isToday && !darkMode ? {
									backgroundColor: themeColor
								} : {}}
							>
								<p className='text-xs font-medium mb-1'>{day.day}</p>
								<p className='text-xl font-bold'>{day.date}</p>
								<p className='text-xs opacity-75'>{day.month}</p>
							</div>
						))}
					</div>
				</motion.div>
			</div>
		</div>
	)
}

export default Dashboard
