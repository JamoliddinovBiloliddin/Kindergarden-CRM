import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, MessageSquare, Edit2, Trash2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useTheme } from '../../contexts/ThemeContext'

const ParentComplaints = () => {
	const { user } = useAuth()
	const { t } = useLanguage()
	const { darkMode, currentTheme } = useTheme()
	const themeColor = (currentTheme && currentTheme.primary) || '#2563EB'
	const themeHover = (currentTheme && currentTheme.primaryHover) || '#1D4ED8'

	const [complaints, setComplaints] = useState([])
	const [showModal, setShowModal] = useState(false)
	const [formData, setFormData] = useState({ title: '', message: '' })
	const [editingId, setEditingId] = useState(null) // Edit uchun

	useEffect(() => {
		const stored = JSON.parse(localStorage.getItem('complaints') || '[]')
		const userComplaints = stored.filter((c) => c.parentCode === user?.code)
		setComplaints(userComplaints)
	}, [user])

	const handleSubmit = (e) => {
		e.preventDefault()

		if (editingId) {

			const updatedComplaints = complaints.map((c) =>
				c.id === editingId ? { ...c, ...formData } : c
			)
			localStorage.setItem('complaints', JSON.stringify(updatedComplaints))
			setComplaints(updatedComplaints)
		} else {
			
			const newComplaint = {
				id: Date.now(),
				...formData,
				parentName: user?.name,
				parentCode: user?.code,
				date: new Date().toISOString().split('T')[0],
				status: 'new',
				createdAt: new Date().toISOString()
			}
			const stored = JSON.parse(localStorage.getItem('complaints') || '[]')
			const updated = [...stored, newComplaint]
			localStorage.setItem('complaints', JSON.stringify(updated))
			setComplaints([...complaints, newComplaint])
		}

		setShowModal(false)
		setFormData({ title: '', message: '' })
		setEditingId(null)
	}

	const handleEdit = (complaint) => {
		setFormData({ title: complaint.title, message: complaint.message })
		setEditingId(complaint.id)
		setShowModal(true)
	}

	const handleDelete = (id) => {
		const updated = complaints.filter((c) => c.id !== id)
		localStorage.setItem('complaints', JSON.stringify(updated))
		setComplaints(updated)
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<h1 className={`text-3xl font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
					{t('modules.complaints')}
				</h1>
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					style={{ backgroundColor: themeColor }}
					onMouseEnter={(e) => e.target.style.backgroundColor = themeHover}
					onMouseLeave={(e) => e.target.style.backgroundColor = themeColor}
					onClick={() => setShowModal(true)}
					className='flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors duration-300'
				>
					<Plus className='w-5 h-5' />
					{t('complaints.sendComplaint')}
				</motion.button>
			</div>

			<div className='space-y-4'>
				{complaints.map((complaint) => (
					<motion.div
						key={complaint.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className={`rounded-xl shadow-sm border p-6 transition-colors duration-300 ${
							darkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-gray-200'
						}`}
						style={{ borderTop: darkMode ? undefined : `4px solid ${themeColor}` }}
					>
						<div className='flex items-start justify-between mb-4'>
							<div className='flex items-center gap-3'>
								<MessageSquare className='w-6 h-6 text-purple-500' />
								<div>
									<h3 className={`font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
										{complaint.title}
									</h3>
									<p className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
										{complaint.date}
									</p>
								</div>
							</div>
							<div className='flex gap-2'>
								<button
									onClick={() => handleEdit(complaint)}
									style={{ backgroundColor: themeColor }}
									onMouseEnter={(e) => e.target.style.backgroundColor = themeHover}
									onMouseLeave={(e) => e.target.style.backgroundColor = themeColor}
									className='flex items-center gap-1 px-3 py-1 rounded-lg text-white text-xs'
								>
									<Edit2 className='w-4 h-4' /> Tahrirlash
								</button>
								<button
									onClick={() => handleDelete(complaint.id)}
									className='flex items-center gap-1 px-3 py-1 rounded-lg text-white text-xs'
									style={{ backgroundColor: '#DC2626' }}
									onMouseEnter={(e) => e.target.style.backgroundColor = '#B91C1C'}
									onMouseLeave={(e) => e.target.style.backgroundColor = '#DC2626'}
								>
									<Trash2 className='w-4 h-4' /> O‘chirish
								</button>
							</div>
						</div>
						<p className={`transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
							{complaint.message}
						</p>
					</motion.div>
				))}
			</div>

			{showModal && (
				<div className='fixed inset-0 backdrop-blur-[12px] bg-black/20 flex items-center justify-center z-50 p-4' onClick={() => setShowModal(false)}>
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
						onClick={(e) => e.stopPropagation()}
						className={`rounded-[20px] p-6 w-full max-w-md shadow-2xl border transition-colors duration-300 ${
							darkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-gray-200'
						}`}
					>
						<h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
							{editingId ? 'Shikoyatni tahrirlash' : t('complaints.sendComplaint')}
						</h2>
						<form onSubmit={handleSubmit} className='space-y-4'>
							<div>
								<label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sarlavha</label>
								<input
									type='text'
									value={formData.title}
									onChange={(e) => setFormData({ ...formData, title: e.target.value })}
									className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${darkMode ? 'bg-[#334155] border-[#475569] text-white' : 'bg-white border-gray-300 text-gray-800'}`}
									required
								/>
							</div>
							<div>
								<label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Xabar</label>
								<textarea
									value={formData.message}
									onChange={(e) => setFormData({ ...formData, message: e.target.value })}
									className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${darkMode ? 'bg-[#334155] border-[#475569] text-white' : 'bg-white border-gray-300 text-gray-800'}`}
									rows={4}
									required
								/>
							</div>
							<div className='flex gap-3'>
								<button
									type='button'
									onClick={() => { setShowModal(false); setEditingId(null); }}
									className={`flex-1 px-4 py-2 rounded-lg border transition-colors duration-300 ${darkMode ? 'bg-[#334155] border-[#475569] text-white' : 'bg-white border-gray-300 text-gray-800'}`}
								>
									{t('common.cancel')}
								</button>
								<button
									type='submit'
									style={{ backgroundColor: themeColor }}
									onMouseEnter={(e) => e.target.style.backgroundColor = themeHover}
									onMouseLeave={(e) => e.target.style.backgroundColor = themeColor}
									className='flex-1 px-4 py-2 text-white rounded-lg transition-colors duration-300'
								>
									{editingId ? 'Saqlash' : 'Yuborish'}
								</button>
							</div>
						</form>
					</motion.div>
				</div>
			)}
		</div>
	)
}

export default ParentComplaints
