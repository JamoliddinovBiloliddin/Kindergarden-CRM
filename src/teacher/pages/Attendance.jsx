import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, Heart, Save, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { getAllStudents, getStudentsByGroup } from '../../mock/students'
import { getGroupsByTeacher } from '../../mock/groups'
import { teacherData } from '../../mock/teacherData'
import { useTheme } from '../../contexts/ThemeContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { FaRegCheckCircle } from "react-icons/fa";

const Attendance = () => {
	const { darkMode, currentTheme } = useTheme()
	const { t } = useLanguage()
	const [selectedGroup, setSelectedGroup] = useState('All')
	const [students, setStudents] = useState([])
	const [attendance, setAttendance] = useState({})
	const [selectedDate, setSelectedDate] = useState(
		new Date().toISOString().split('T')[0]
	)
	const [saved, setSaved] = useState(false)
	const [groups] = useState(() => {
		const teacher = JSON.parse(localStorage.getItem('teacher') || JSON.stringify(teacherData))
		return getGroupsByTeacher(teacher.id)
	})

	useEffect(() => {
		loadStudents()
		loadAttendance()
	}, [selectedGroup, selectedDate])

	const loadStudents = () => {
		let allStudents = getAllStudents()
		if (selectedGroup !== 'All') {
			allStudents = getStudentsByGroup(selectedGroup)
		}
		setStudents(allStudents)
	}

	const loadAttendance = () => {
		const attendanceData = JSON.parse(localStorage.getItem('attendance') || '{}')
		setAttendance(attendanceData[selectedDate] || {})
	}

	const updateAttendance = (studentId, status) => {
		const newAttendance = { ...attendance, [studentId]: status }
		setAttendance(newAttendance)
		setSaved(false)
	}

	const saveAttendance = () => {
		const attendanceData = JSON.parse(localStorage.getItem('attendance') || '{}')
		attendanceData[selectedDate] = attendance
		localStorage.setItem('attendance', JSON.stringify(attendanceData))
		setSaved(true)
		setTimeout(() => setSaved(false), 3000)
	}

	const getStatusIcon = status => {
		switch (status) {
			case 'present':
				return <CheckCircle className='w-5 h-5 text-green-500' />
			case 'absent':
				return <XCircle className='w-5 h-5 text-red-500' />
			case 'late':
				return <Clock className='w-5 h-5 text-yellow-500' />
			case 'sick':
				return <Heart className='w-5 h-5 text-pink-500' />
			default:
				return null
		}
	}

	const themeColor = (currentTheme && currentTheme.primary) || '#2563EB'

	const statusButtons = [
		{ status: 'present', label: t('attendance.present'), color: 'bg-green-500 hover:bg-green-600' },
		{ status: 'absent', label: t('attendance.absent'), color: 'bg-red-500 hover:bg-red-600' },
		{ status: 'late', label: 'Kechikdi', color: 'bg-yellow-500 hover:bg-yellow-600' },
		{ status: 'sick', label: 'Kasallangan', color: 'bg-pink-500 hover:bg-pink-600' }
	]

	// ➤ MASS PRESENT BUTTON
	const markAllPresent = () => {
		const updated = {}
		students.forEach(s => {
			updated[s.id] = 'present'
		})
		setAttendance(updated)
		setSaved(false)
	}

	return (
		<div className='space-y-6'>
			<motion.div
				initial={{ opacity: 0, y: -20 }}
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
				{/* FILTER + BUTTON ROW */}
				<div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6'>
					<div className='flex flex-col md:flex-row gap-4 flex-1'>
						
						{/* GROUP SELECT */}
						<div>
							<label className={`block text-sm font-medium mb-2 ${
								darkMode ? 'text-gray-300' : 'text-gray-700'
							}`}>
								{t('common.group')}
							</label>
							<select
								value={selectedGroup}
								onChange={e => setSelectedGroup(e.target.value)}
								className={`px-4 py-2 border rounded-lg ${
									darkMode 
										? 'bg-[#334155] border-[#475569] text-white' 
										: 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'
								}`}
							>
								<option value='All'>Barcha guruhlar</option>
								{groups.map(group => (
									<option key={group.id} value={group.name}>
										{group.name}
									</option>
								))}
							</select>
						</div>

						{/* DATE PICKER */}
						<div>
							<label className={`block text-sm font-medium mb-2 ${
								darkMode ? 'text-gray-300' : 'text-gray-700'
							}`}>
								{t('activities.date')}
							</label>
							<input
								type='date'
								value={selectedDate}
								onChange={e => setSelectedDate(e.target.value)}
								className={`px-4 py-2 border rounded-lg ${
									darkMode 
										? 'bg-[#334155] border-[#475569] text-white' 
										: 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'
								}`}
							/>
						</div>


					</div>
											{/* ➤ MASS PRESENT BUTTON */}
											<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={markAllPresent}
							className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300
								${darkMode ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-green-600 hover:bg-green-500 text-white'}
							`}
						>
							<FaRegCheckCircle className='font-bold text-lg'/>Barchasini mavjud qilish
						</motion.button>

					{/* SAVE BUTTON */}
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={saveAttendance}
						className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 ${
							saved ? 'bg-green-500' : ''
						}`}
						style={!saved ? { backgroundColor: themeColor } : {}}
					>
						<Save className='w-5 h-5' />
						{saved ? 'Saqlandi!' : 'Saqlash'}
					</motion.button>
				</div>

				{/* STUDENT LIST */}
				<div className='space-y-3'>
					{students.length > 0 ? (
						students.map((student, index) => {
							const currentStatus = attendance[student.id] || null
							return (
								<motion.div
									key={student.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.05 }}
									className={`relative rounded-2xl p-4 transition-all border ${
										darkMode 
											? 'bg-[#334155] border-[#475569]' 
											: currentStatus === 'present'
												? 'bg-green-50 border-green-200'
												: currentStatus === 'absent'
													? 'bg-red-50 border-red-200'
													: currentStatus === 'late'
														? 'bg-yellow-50 border-yellow-200'
														: currentStatus === 'sick'
															? 'bg-pink-50 border-pink-200'
															: 'bg-white border-[#E5E7EB]'
									}`}
									style={{
										borderTop: darkMode ? undefined : currentStatus
											? `4px solid ${currentStatus === 'present'
												? '#16A34A'
												: currentStatus === 'absent'
													? '#EF4444'
													: currentStatus === 'late'
														? '#EAB308'
														: '#EC4899'
											}`
											: `4px solid ${themeColor}`
									}}
								>
									<div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
										<div className='flex items-center gap-4 flex-1'>
											<div className='w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg'
												style={{ backgroundColor: themeColor }}
											>
												{student.name.charAt(0)}
											</div>

											<div>
												<p className={`${darkMode ? 'text-white' : 'text-gray-900'} font-semibold`}>
													{student.name}
												</p>
												<p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
													{student.group}
												</p>
											</div>

											{currentStatus && (
												<div className='flex items-center gap-2'>
													{getStatusIcon(currentStatus)}
													<span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium capitalize`}>
														{currentStatus}
													</span>
												</div>
											)}
										</div>

										<div className='flex flex-wrap items-center gap-2'>
											{statusButtons.map(btn => (
												<motion.button
													key={btn.status}
													whileHover={{ scale: 1.05 }}
													whileTap={{ scale: 0.95 }}
													onClick={() => updateAttendance(student.id, btn.status)}
													className={`px-3 py-2 rounded-lg text-white text-sm font-medium transition-all duration-300 ${
														currentStatus === btn.status
															? `${btn.color} ring-2 ring-offset-2 ring-gray-400`
															: btn.color
													}`}
												>
													{btn.label}
												</motion.button>
											))}
										</div>
									</div>
								</motion.div>
							)
						})
					) : (
						<div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
							<Users className={`w-12 h-12 mx-auto mb-2 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
							<p>Tanlangan guruhda o'quvchilar topilmadi</p>
						</div>
					)}
				</div>
			</motion.div>
		</div>
	)
}

export default Attendance
