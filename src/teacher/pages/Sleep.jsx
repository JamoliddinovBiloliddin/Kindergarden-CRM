import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Moon, Clock, Trash2, Edit2 } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import { useTheme } from '../../contexts/ThemeContext'

const TeacherSleep = () => {
	const { t } = useLanguage()
	const { darkMode, currentTheme } = useTheme()
	const [sleepRecords, setSleepRecords] = useState([])
	const [showModal, setShowModal] = useState(false)
	const [editId, setEditId] = useState(null)
	const [formData, setFormData] = useState({
		childName: '',
		sleepStart: '',
		wakeUp: ''
	})

	useEffect(() => {
		loadSleepRecords()
	}, [])

	const loadSleepRecords = () => {
		const stored = JSON.parse(localStorage.getItem('sleep') || '[]')
		setSleepRecords(stored)
	}

	const calculateDuration = (start, end) => {
		if (!start || !end) return '0 daqiqa'
		const startTime = new Date(`2000-01-01 ${start}`)
		const endTime = new Date(`2000-01-01 ${end}`)
		const diff = (endTime - startTime) / 1000 / 60
		return `${Math.round(diff)} daqiqa`
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		const duration = calculateDuration(formData.sleepStart, formData.wakeUp)

		if (editId) {
			// Editing existing record
			const updated = sleepRecords.map(record =>
				record.id === editId ? { ...record, ...formData, duration } : record
			)
			localStorage.setItem('sleep', JSON.stringify(updated))
			setSleepRecords(updated)
			setEditId(null)
		} else {
			// Adding new record
			const newRecord = {
				id: Date.now(),
				...formData,
				duration,
				date: new Date().toISOString().split('T')[0],
				createdAt: new Date().toISOString()
			}
			const updated = [...sleepRecords, newRecord]
			localStorage.setItem('sleep', JSON.stringify(updated))
			setSleepRecords(updated)
		}

		setShowModal(false)
		setFormData({ childName: '', sleepStart: '', wakeUp: '' })
	}

	const handleDelete = (id) => {
		const filtered = sleepRecords.filter(record => record.id !== id)
		localStorage.setItem('sleep', JSON.stringify(filtered))
		setSleepRecords(filtered)
	}

	const handleEdit = (record) => {
		setFormData({
			childName: record.childName,
			sleepStart: record.sleepStart,
			wakeUp: record.wakeUp
		})
		setEditId(record.id)
		setShowModal(true)
	}

	const themeColor = (currentTheme && currentTheme.primary) || '#2563EB'

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
					{t('modules.sleep')}
				</motion.h1>
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={() => {
						setShowModal(true)
						setEditId(null)
						setFormData({ childName: '', sleepStart: '', wakeUp: '' })
					}}
					className='flex items-center gap-2 px-4 py-2 text-white rounded-[14px] font-medium shadow-sm transition-all duration-300'
					style={{ backgroundColor: themeColor }}
					onMouseEnter={(e) => {
						e.target.style.backgroundColor = (currentTheme && currentTheme.primaryHover) || '#1D4ED8'
					}}
					onMouseLeave={(e) => {
						e.target.style.backgroundColor = themeColor
					}}
				>
					<Plus className='w-5 h-5' />
					{t('common.add')}
				</motion.button>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				{sleepRecords.map((record, index) => (
					<motion.div
						key={record.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.05 }}
						whileHover={{ y: -2, transition: { duration: 0.2, ease: 'easeOut' } }}
						className={`relative rounded-2xl p-6 transition-all duration-200 ${
							darkMode 
								? 'bg-[#1E293B] border-[#334155]' 
								: 'bg-white border-[#E5E7EB]'
						} border shadow-[0_6px_20px_rgba(0,0,0,0.05)]`}
						style={{
							borderTop: darkMode ? undefined : `4px solid ${themeColor}`
						}}
					>
						<div className='flex items-start justify-between mb-4'>
							<Moon className='w-6 h-6' style={{ color: themeColor }} />
							<span className={`text-xs transition-colors duration-300 ${
								darkMode ? 'text-gray-400' : 'text-gray-500'
							}`}>{record.date}</span>
						</div>
						<h3 className={`font-bold mb-4 transition-colors duration-300 ${
							darkMode ? 'text-white' : 'text-gray-900'
						}`}>{record.childName}</h3>
						<div className='space-y-3'>
							<div className={`flex items-center gap-2 text-sm transition-colors duration-300 ${
								darkMode ? 'text-gray-400' : 'text-gray-600'
							}`}>
								<Clock className='w-4 h-4' />
								<span>{t('sleep.sleepStart')}:</span>
								<span className='font-semibold'>{record.sleepStart}</span>
							</div>
							<div className={`flex items-center gap-2 text-sm transition-colors duration-300 ${
								darkMode ? 'text-gray-400' : 'text-gray-600'
							}`}>
								<Clock className='w-4 h-4' />
								<span>{t('sleep.wakeUp')}:</span>
								<span className='font-semibold'>{record.wakeUp}</span>
							</div>
							<div className={`pt-3 border-t transition-colors duration-300 ${
								darkMode ? 'border-[#334155]' : 'border-gray-200'
							}`}>
								<p className='text-sm font-semibold transition-colors duration-300'
									style={{ color: themeColor }}
								>
									{t('sleep.duration')}: {record.duration}
								</p>
							</div>
						</div>

						{/* Edit & Delete buttons */}
						<div className='flex gap-2 mt-4'>
							<button
								onClick={() => handleEdit(record)}
								className='flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white rounded-lg'
								style={{ backgroundColor: themeColor }}
							>
								<Edit2 className='w-4 h-4' /> O'zgartirish
							</button>
							<button
								onClick={() => handleDelete(record.id)}
								className='flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white rounded-lg bg-red-500 hover:bg-red-600'
							>
								<Trash2 className='w-4 h-4' /> O'chirish
							</button>
						</div>
					</motion.div>
				))}
			</div>

			{/* Modal */}
			{showModal && (
				<div className='fixed inset-0 backdrop-blur-[12px] bg-black/20 flex items-center justify-center z-50 p-4' onClick={() => setShowModal(false)}>
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
						onClick={(e) => e.stopPropagation()}
						className={`relative rounded-2xl p-6 w-full max-w-md shadow-[0_6px_20px_rgba(0,0,0,0.05)] border ${
							darkMode 
								? 'bg-[#1F2937] border-[#334155]' 
								: 'bg-white border-[#E5E7EB]'
						}`}
						style={{
							borderTop: darkMode ? undefined : `4px solid ${themeColor}`
						}}
					>
						<h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
							darkMode ? 'text-white' : 'text-gray-900'
						}`}>{editId ? "Uyquni o'zgartirish" : "Uyqu qo'shish"}</h2>

						<form onSubmit={handleSubmit} className='space-y-4'>
							<div>
								<label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
									darkMode ? 'text-gray-300' : 'text-gray-700'
								}`}>
									Hafta kuni
								</label>
								<select
									value={formData.childName}
									onChange={(e) =>
										setFormData({ ...formData, childName: e.target.value })
									}
									className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${
										darkMode 
											? 'bg-[#334155] border-[#475569] text-white' 
											: 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'
									} focus:outline-none focus:ring-2 focus:ring-blue-500`}
									required
								>
									<option value="">Kunni tanlang</option>
									<option value="Dushanba">Dushanba</option>
									<option value="Seshanba">Seshanba</option>
									<option value="Chorshanba">Chorshanba</option>
									<option value="Payshanba">Payshanba</option>
									<option value="Juma">Juma</option>
									<option value="Shanba">Shanba</option>
									<option value="Yakshanba">Yakshanba</option>
								</select>
							</div>

							<div>
								<label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
									darkMode ? 'text-gray-300' : 'text-gray-700'
								}`}>
									{t('sleep.sleepStart')}
								</label>
								<input
									type='time'
									value={formData.sleepStart}
									onChange={(e) =>
										setFormData({ ...formData, sleepStart: e.target.value })
									}
									className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${
										darkMode 
											? 'bg-[#334155] border-[#475569] text-white' 
											: 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'
									} focus:outline-none focus:ring-2 focus:ring-blue-500`}
									required
								/>
							</div>

							<div>
								<label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
									darkMode ? 'text-gray-300' : 'text-gray-700'
								}`}>
									{t('sleep.wakeUp')}
								</label>
								<input
									type='time'
									value={formData.wakeUp}
									onChange={(e) =>
										setFormData({ ...formData, wakeUp: e.target.value })
									}
									className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${
										darkMode 
											? 'bg-[#334155] border-[#475569] text-white' 
											: 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'
									} focus:outline-none focus:ring-2 focus:ring-blue-500`}
									required
								/>
							</div>

							<div className='flex gap-3'>
								<button
									type='button'
									onClick={() => setShowModal(false)}
									className={`flex-1 px-4 py-2 border rounded-lg transition-colors duration-300 ${
										darkMode 
											? 'bg-[#1E293B] border-[#334155] text-white hover:bg-[#334155]' 
											: 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
									}`}
								>
									{t('common.cancel')}
								</button>
								<button
									type='submit'
									className='flex-1 px-4 py-2 text-white rounded-lg transition-all duration-300'
									style={{ backgroundColor: themeColor }}
									onMouseEnter={(e) => {
										e.target.style.backgroundColor = (currentTheme && currentTheme.primaryHover) || '#1D4ED8'
									}}
									onMouseLeave={(e) => {
										e.target.style.backgroundColor = themeColor
									}}
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

export default TeacherSleep
