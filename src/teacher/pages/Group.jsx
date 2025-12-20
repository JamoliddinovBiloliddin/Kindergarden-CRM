import { useState, useEffect } from 'react'
import { Users, Phone, Mail, AlertCircle, ChevronRight, ArrowLeft, Award, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import { useLanguage } from '../../contexts/LanguageContext'

const TeacherGroups = () => {
	const { darkMode, currentTheme } = useTheme()
	const { t } = useLanguage()
	const [groups, setGroups] = useState([])
	const [selectedGroup, setSelectedGroup] = useState(null)
	const [students, setStudents] = useState([])
	const [showGradeModal, setShowGradeModal] = useState(false)
	const [selectedStudent, setSelectedStudent] = useState(null)
	const [gradeForm, setGradeForm] = useState({ grade: '', comment: '' })
	const [currentUser, setCurrentUser] = useState(null)

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem('currentUser'))
		// If logged in as teacher, we expect user.teacherId or user.id to match teacherId in groups
		setCurrentUser(user)

		if (user) {
			loadTeacherGroups(user)
		}
	}, [])

	const loadTeacherGroups = (user) => {
		const allGroups = JSON.parse(localStorage.getItem('groups') || '[]')
		const allTeachers = JSON.parse(localStorage.getItem('teachers') || '[]')

		const teacherId = user.teacherId || user.id

		const teacherObj = allTeachers.find(t => t.id === teacherId)
		const assignedGroupIds = teacherObj ? (teacherObj.assignedGroups || []) : []

		const teacherGroups = allGroups.filter(g =>
			g.teacherId === teacherId || assignedGroupIds.includes(g.id)
		)

		const uniqueGroups = [...new Map(teacherGroups.map(g => [g.id, g])).values()]

		const allChildren = JSON.parse(localStorage.getItem('children') || '[]')

		const groupsWithCounts = uniqueGroups.map(g => {
			// Strict filtering by ID first, then fallback to Name for robustness
			const count = allChildren.filter(c => c.groupId === g.id || c.group === g.name).length
			return {
				...g,
				studentCount: count,
				description: `Sig'im: ${g.capacity}`
			}
		})

		setGroups(groupsWithCounts)
	}

	const handleGroupClick = (group) => {
		// Prevent access if group is not in the allowed list (Client-side protection)
		const isAllowed = groups.some(g => g.id === group.id)
		if (!isAllowed) return

		setSelectedGroup(group)
		const allChildren = JSON.parse(localStorage.getItem('children') || '[]')
		// Filter students by groupId (preferred) or group name (legacy)
		const groupStudents = allChildren.filter(c => c.groupId === group.id || c.group === group.name)
		setStudents(groupStudents)
	}

	const handleBack = () => {
		setSelectedGroup(null)
		setStudents([])
	}

	// ... Grade logic methods ...
	const handleGradeClick = (student) => {
		setSelectedStudent(student)
		const grades = JSON.parse(localStorage.getItem('grades') || '{}')
		const studentGrade = grades[student.id] || { grade: '', comment: '' }
		setGradeForm(studentGrade)
		setShowGradeModal(true)
	}

	const handleGradeSubmit = (e) => {
		e.preventDefault()
		const grades = JSON.parse(localStorage.getItem('grades') || '{}')
		grades[selectedStudent.id] = {
			...gradeForm,
			date: new Date().toISOString(),
			teacherId: currentUser.id
		}
		localStorage.setItem('grades', JSON.stringify(grades))
		setShowGradeModal(false)
		setSelectedStudent(null)
		setGradeForm({ grade: '', comment: '' })
	}

	const getGradeColor = (grade) => {
		switch (grade) {
			case 'A': return { bg: '#16A34A', text: 'text-white', border: '#16A34A' }
			case 'B': return { bg: '#EAB308', text: 'text-white', border: '#EAB308' }
			case 'C': return { bg: '#EF4444', text: 'text-white', border: '#EF4444' }
			default: return { bg: darkMode ? '#334155' : '#F9FAFB', text: darkMode ? 'text-gray-300' : 'text-gray-700', border: darkMode ? '#475569' : '#E5E7EB' }
		}
	}

	const themeColor = (currentTheme && currentTheme.primary) || '#2563EB'

	if (selectedGroup) {
		// ... Render Single Group View ...
		// (Copied largely from original file but using dynamic data)
		return (
			<div className='space-y-6'>
				<motion.button
					// ... props
					onClick={handleBack}
					className={`flex items-center gap-2 font-medium transition-colors duration-300 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
						}`}
					style={{ color: themeColor }}
				>
					<ArrowLeft className='w-5 h-5' />
					Guruhlarga qaytish
				</motion.button>

				{/* Header Card */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					whileHover={{ y: -2, transition: { duration: 0.2, ease: 'easeOut' } }}
					className={`relative rounded-2xl p-6 transition-all duration-200 ${darkMode
						? 'bg-[#1E293B] border-[#334155]'
						: 'bg-white border-[#E5E7EB]'
						} border shadow-[0_6px_20px_rgba(0,0,0,0.05)]`}
					style={{
						borderTop: darkMode ? undefined : `4px solid ${themeColor}`
					}}
				>
					<div className='flex items-center gap-4 mb-6'>
						<div className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-colors duration-300`}
							style={{ backgroundColor: themeColor }}
						>
							<Users className='w-8 h-8' />
						</div>
						<div>
							<h2 className={`text-2xl font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'
								}`}>{selectedGroup.name}</h2>
							<p className={`transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'
								}`}>{selectedGroup.description || 'Guruh haqida ma\'lumot'}</p>
							<p className={`text-sm mt-1 transition-colors duration-300 ${darkMode ? 'text-gray-500' : 'text-gray-400'
								}`}>
								{students.length} o'quvchi
							</p>
						</div>
					</div>

					<div className='space-y-4'>
						{students.length > 0 ? (
							students.map((student, index) => {
								const grades = JSON.parse(localStorage.getItem('grades') || '{}')
								const studentGrade = grades[student.id] || { grade: '', comment: '' }
								const gradeColors = getGradeColor(studentGrade.grade)

								return (
									<motion.div
										key={student.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: index * 0.05 }}
										whileHover={{ y: -2, transition: { duration: 0.2, ease: 'easeOut' } }}
										className={`relative rounded-2xl p-5 transition-all duration-200 ${darkMode
											? 'bg-[#334155] border-[#475569]'
											: 'bg-gray-50 border-[#E5E7EB]'
											} border shadow-[0_6px_20px_rgba(0,0,0,0.05)]`}
										style={{
											borderTop: darkMode ? undefined : `4px solid ${studentGrade.grade ? gradeColors.border : themeColor}`
										}}
									>
										<div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
											<div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold text-xl transition-colors duration-300`}
												style={{
													backgroundColor: studentGrade.grade ? gradeColors.bg : themeColor
												}}
											>
												{student.name.charAt(0)}
											</div>
											<div className='flex-1'>
												<div className='flex items-center gap-3 mb-2'>
													<h3 className={`font-semibold text-lg transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'
														}`}>
														{student.name}
													</h3>
													{studentGrade.grade && (
														<span className={`px-3 py-1 rounded-lg font-bold text-sm transition-colors duration-300 ${gradeColors.text}`}
															style={{ backgroundColor: gradeColors.bg }}
														>
															{studentGrade.grade}
														</span>
													)}
												</div>
												<div className='space-y-2'>
													<div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
														<User className='w-4 h-4' />
														<span>Yoshi: {student.age} yosh</span>
													</div>
													{/* Other fields if available in student object */}
													{studentGrade.comment && (
														<div className={`text-sm p-2 rounded-lg transition-colors duration-300 ${darkMode ? 'bg-[#1E293B] text-gray-300' : 'bg-white text-gray-700'
															}`}>
															<span className='font-medium'>Izoh: </span>{studentGrade.comment}
														</div>
													)}
												</div>
											</div>
											<motion.button
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
												onClick={() => handleGradeClick(student)}
												className='flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all duration-300'
												style={{ backgroundColor: themeColor }}
											>
												<Award className='w-5 h-5' />
												{studentGrade.grade ? 'Bahoni o\'zgartirish' : 'Baho berish'}
											</motion.button>
										</div>
									</motion.div>
								)
							})
						) : (
							<div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
								<Users className={`w-12 h-12 mx-auto mb-2 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
								<p>Bu guruhda o'quvchilar yo'q</p>
							</div>
						)}
					</div>
				</motion.div>

				{showGradeModal && (
					<div className='fixed inset-0 backdrop-blur-[12px] bg-black/20 flex items-center justify-center z-50 p-4' onClick={() => setShowGradeModal(false)}>
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							onClick={(e) => e.stopPropagation()}
							className={`relative rounded-2xl p-6 w-full max-w-md shadow-xl border ${darkMode
								? 'bg-[#1F2937] border-[#334155]'
								: 'bg-white border-[#E5E7EB]'
								}`}
							style={{
								borderTop: darkMode ? undefined : `4px solid ${themeColor}`
							}}
						>
							<h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
								{selectedStudent?.name} uchun baho
							</h2>
							<form onSubmit={handleGradeSubmit} className='space-y-4'>
								{/* Grade Buttons */}
								<div>
									<label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
										Baho
									</label>
									<div className='grid grid-cols-3 gap-2'>
										{['A', 'B', 'C'].map((grade) => {
											const gradeColors = getGradeColor(grade)
											return (
												<motion.button
													key={grade}
													type='button'
													whileHover={{ scale: 1.05 }}
													whileTap={{ scale: 0.95 }}
													onClick={() => setGradeForm({ ...gradeForm, grade })}
													className={`px-4 py-3 rounded-lg font-bold text-lg transition-all duration-300 ${gradeForm.grade === grade ? 'ring-2 ring-offset-2' : ''
														} ${gradeColors.text}`}
													style={{
														backgroundColor: gradeForm.grade === grade ? gradeColors.bg : (darkMode ? '#334155' : '#F9FAFB'),
														border: `2px solid ${gradeForm.grade === grade ? gradeColors.border : (darkMode ? '#475569' : '#E5E7EB')}`,
														color: gradeForm.grade === grade ? gradeColors.text : (darkMode ? '#D1D5DB' : '#6B7280')
													}}
												>
													{grade}
												</motion.button>
											)
										})}
									</div>
								</div>

								{/* Comment */}
								<div>
									<label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
										Izoh
									</label>
									<textarea
										value={gradeForm.comment}
										onChange={(e) => setGradeForm({ ...gradeForm, comment: e.target.value })}
										className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-[#334155] border-[#475569] text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'}`}
										rows={3}
										placeholder='Izoh yozing...'
									/>
								</div>

								<div className='flex gap-3'>
									<button
										type='button'
										onClick={() => setShowGradeModal(false)}
										className={`flex-1 px-4 py-2 border rounded-lg ${darkMode ? 'bg-[#1E293B] border-[#334155] text-white' : 'bg-white border-gray-300 text-gray-700'}`}
									>
										{t('common.cancel')}
									</button>
									<button
										type='submit'
										className='flex-1 px-4 py-2 text-white rounded-lg'
										style={{ backgroundColor: themeColor }}
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

	return (
		<div className='space-y-6'>
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className={`relative rounded-2xl p-6 transition-all duration-200 ${darkMode
						? 'bg-[#1E293B] border-[#334155]'
						: 'bg-white border-[#E5E7EB]'
					} border shadow-[0_6px_20px_rgba(0,0,0,0.05)]`}
				style={{
					borderTop: darkMode ? undefined : `4px solid ${themeColor}`
				}}
			>
				<h2 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'
					}`}>Xush kelibsiz, {currentUser?.name || currentUser?.username}!</h2>
				<h3 className={`text-lg font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Mening guruhlarim</h3>
				<p className={`transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'
					}`}>O'quvchi guruhlarini boshqaring va tafsilotlarni ko'ring</p>
			</motion.div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{groups.map((group, index) => (
					<motion.div
						key={group.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.05 }}
						whileHover={{ y: -2, transition: { duration: 0.2, ease: 'easeOut' } }}
						onClick={() => handleGroupClick(group)}
						className={`relative rounded-2xl p-6 cursor-pointer transition-all duration-200 ${darkMode
							? 'bg-[#1E293B] border-[#334155] hover:border-[#475569]'
							: 'bg-white border-[#E5E7EB] hover:border-blue-300'
							} border shadow-[0_6px_20px_rgba(0,0,0,0.05)]`}
						style={{
							borderTop: darkMode ? undefined : `4px solid ${themeColor}`
						}}
					>
						<div className='flex items-center justify-between mb-4'>
							<div className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-colors duration-300`}
								style={{ backgroundColor: themeColor }}
							>
								<Users className='w-8 h-8' />
							</div>
							<ChevronRight className={`w-6 h-6 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-400'
								}`} />
						</div>
						<h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'
							}`}>{group.name}</h3>
						<p className={`text-sm mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'
							}`}>{group.description}</p>
						<p className='font-semibold transition-colors duration-300'
							style={{ color: themeColor }}
						>
							{group.studentCount} o'quvchi
						</p>
					</motion.div>
				))}
			</div>

			{groups.length === 0 && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className={`relative rounded-2xl p-12 text-center transition-all duration-200 ${darkMode
						? 'bg-[#1E293B] border-[#334155]'
						: 'bg-white border-[#E5E7EB]'
						} border shadow-[0_6px_20px_rgba(0,0,0,0.05)]`}
					style={{
						borderTop: darkMode ? undefined : `4px solid ${themeColor}`
					}}
				>
					<Users className={`w-16 h-16 mx-auto mb-4 transition-colors duration-300 ${darkMode ? 'text-gray-600' : 'text-gray-300'
						}`} />
					<p className={`text-lg transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'
						}`}>Sizga biriktirilgan guruhlar mavjud emas</p>
				</motion.div>
			)}
		</div>
	)
}

export default TeacherGroups
