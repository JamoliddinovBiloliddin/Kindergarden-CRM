import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, BookCheck, Trash2, Edit2 } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import { useTheme } from '../../contexts/ThemeContext'

const TeacherHomework = () => {
	const { t } = useLanguage()
	const { darkMode, currentTheme } = useTheme()
	const [homework, setHomework] = useState([])
	const [groups, setGroups] = useState([])
	const [showModal, setShowModal] = useState(false)
	const [editingHomework, setEditingHomework] = useState(null)
	const [formData, setFormData] = useState({
		groupId: '',
		title: '',
		description: '',
		dueDate: ''
	})

	useEffect(() => {
		loadData()
	}, [])

	const loadData = () => {
		const stored = JSON.parse(localStorage.getItem('homework') || '[]')
		setHomework(stored)

		// Load Teacher's groups
		const user = JSON.parse(localStorage.getItem('currentUser'))
		const allGroups = JSON.parse(localStorage.getItem('groups') || '[]')

		// Filter groups for this teacher (Reusing logic from TeacherGroups or similar)
		// If user is teacher, filter.
		let teacherGroups = []
		if (user && user.role === 'teacher') {
			const allTeachers = JSON.parse(localStorage.getItem('teachers') || '[]')
			const teacherId = user.teacherId || user.id
			const teacherObj = allTeachers.find(t => t.id === teacherId)
			const assignedGroups = teacherObj?.assignedGroups || []

			teacherGroups = allGroups.filter(g => g.teacherId === teacherId || assignedGroups.includes(g.id))
		} else {
			teacherGroups = allGroups // Fallback or empty?
		}
		setGroups(teacherGroups)
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		if (editingHomework) {
			const updated = homework.map(hw =>
				hw.id === editingHomework.id ? { ...hw, ...formData } : hw
			)
			localStorage.setItem('homework', JSON.stringify(updated))
			setHomework(updated)
			setEditingHomework(null)
		} else {
			const newHomework = {
				id: Date.now(),
				...formData,
				date: new Date().toISOString().split('T')[0],
				createdAt: new Date().toISOString()
			}
			const updated = [...homework, newHomework]
			localStorage.setItem('homework', JSON.stringify(updated))
			setHomework(updated)
		}
		setShowModal(false)
		setFormData({ groupId: '', title: '', description: '', dueDate: '' })
	}

	const deleteHomework = (id) => {
		const updated = homework.filter(hw => hw.id !== id)
		localStorage.setItem('homework', JSON.stringify(updated))
		setHomework(updated)
	}

	const editHomework = (hw) => {
		setEditingHomework(hw)
		setFormData(hw)
		setShowModal(true)
	}

	const themeColor = (currentTheme && currentTheme.primary) || '#2563EB'

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<motion.h1
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					className={`text-3xl font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}
				>
					{t('modules.homework')}
				</motion.h1>
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={() => setShowModal(true)}
					className='flex items-center gap-2 px-4 py-2 text-white rounded-[14px] font-medium shadow-sm transition-all duration-300'
					style={{ backgroundColor: themeColor }}
					onMouseEnter={(e) => e.target.style.backgroundColor = (currentTheme && currentTheme.primaryHover) || '#1D4ED8'}
					onMouseLeave={(e) => e.target.style.backgroundColor = themeColor}
				>
					<Plus className='w-5 h-5' />
					{t('homework.assignHomework')}
				</motion.button>
			</div>

			{/* Homework cards */}
			<div className='space-y-6'>
				{homework.map((hw, index) => {
					// We need to resolve Group Name for display
					// But 'groups' state might be limited to teacher's groups. 
					// However, 'homework' contains all homeworks potentially? No, just load localstorage.
					// Ideally we filter homeworks displayed here to ONLY those belonging to this teacher? 
					// Let's assume for now we show all or just match GroupName.
					// For display, we can try to find group in 'groups' list.
					const groupName = groups.find(g => g.id === hw.groupId)?.name || 'Noma\'lum guruh'

					return (
						<motion.div
							key={hw.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.05 }}
							style={{
								borderTop: darkMode ? undefined : `4px solid ${themeColor}`
							}}
							className={`relative rounded-2xl p-6 transition-all duration-200 ${darkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E5E7EB]'} border shadow-[0_6px_20px_rgba(0,0,0,0.05)]`}
						>
							<div className='flex items-start justify-between mb-4'>
								<div className='flex items-center gap-3'>
									<BookCheck className='w-6 h-6' style={{ color: themeColor }} />
									<div>
										<h3 className={`font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{hw.title}</h3>
										<p className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
											Guruh: {groupName} • {hw.date}
										</p>
									</div>
								</div>
								<div className='flex items-center gap-2'>
									<motion.button onClick={() => editHomework(hw)} className='text-blue-500 hover:text-blue-700'><Edit2 className='w-5 h-5' /></motion.button>
									<motion.button onClick={() => deleteHomework(hw.id)} className='text-red-500 hover:text-red-700'><Trash2 className='w-5 h-5' /></motion.button>
								</div>
							</div>
							<p className={`mb-4 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{hw.description}</p>
						</motion.div>
					)
				})}
			</div>

			{/* Homework Add/Edit Modal */}
			{showModal && (
				<div className='fixed inset-0 backdrop-blur-[12px] bg-black/20 flex items-center justify-center z-50 p-4' onClick={() => { setShowModal(false); setEditingHomework(null) }}>
					<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }} onClick={(e) => e.stopPropagation()} className={`relative rounded-2xl p-6 w-full max-w-md shadow-[0_6px_20px_rgba(0,0,0,0.05)] border ${darkMode ? 'bg-[#1F2937] border-[#334155]' : 'bg-white border-[#E5E7EB]'}`}>
						<h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
							{editingHomework ? 'Uyga vazifani tahrirlash' : t('homework.assignHomework')}
						</h2>
						<form onSubmit={handleSubmit} className='space-y-4'>
							<div>
								<label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Guruh</label>
								<select
									value={formData.groupId}
									onChange={(e) => {
										const gId = e.target.value
										// Find group Name from ID if possible, or just store ID. 
										// groupsList currently passed as prop is likely just names or objects? 
										// Let's assume we need to fetch groups from localstorage ourselves to get IDs, 
										// OR update parent component to pass objects.
										// Ideally, fetch groups here.
										setFormData({ ...formData, groupId: gId })
									}}
									className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${darkMode ? 'bg-[#334155] border-[#475569] text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'}`}
									required
								>
									<option value=''>Guruhni tanlang</option>
									{groups.map(group => <option key={group.id} value={group.id}>{group.name}</option>)}
								</select>
							</div>
							<div>
								<label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('activities.titleLabel')}</label>
								<input type='text' value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${darkMode ? 'bg-[#334155] border-[#475569] text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'}`} required />
							</div>
							<div>
								<label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('activities.description')}</label>
								<textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${darkMode ? 'bg-[#334155] border-[#475569] text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'}`} rows={3} required />
							</div>
							<div>
								<label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Muddat</label>
								<input type='date' value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${darkMode ? 'bg-[#334155] border-[#475569] text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'}`} required />
							</div>
							<div className='flex gap-3'>
								<button type='button' onClick={() => { setShowModal(false); setEditingHomework(null) }} className={`flex-1 px-4 py-2 border rounded-lg transition-colors duration-300 ${darkMode ? 'bg-[#1E293B] border-[#334155] text-white hover:bg-[#334155]' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>{t('common.cancel')}</button>
								<button type='submit' className='flex-1 px-4 py-2 text-white rounded-lg transition-all duration-300' style={{ backgroundColor: themeColor }} onMouseEnter={(e) => { e.target.style.backgroundColor = (currentTheme && currentTheme.primaryHover) || '#1D4ED8' }} onMouseLeave={(e) => { e.target.style.backgroundColor = themeColor }}>{t('common.save')}</button>
							</div>
						</form>
					</motion.div>
				</div>
			)}
		</div>
	)
}

export default TeacherHomework
