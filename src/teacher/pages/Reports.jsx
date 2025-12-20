import { useState, useEffect } from 'react'
import { FileText, Plus, Calendar, Image as ImageIcon, X, ChevronDown, ChevronUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { getReportsByTeacher, saveReport } from '../../mock/reports'
import { teacherData } from '../../mock/teacherData'
import { useTheme } from '../../contexts/ThemeContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { Edit2, Trash2 } from 'lucide-react'


const Reports = () => {
	const { darkMode, currentTheme } = useTheme()
	const { t } = useLanguage()
	const [showForm, setShowForm] = useState(false)
	const [reports, setReports] = useState([])
	const [expandedReports, setExpandedReports] = useState(new Set())
	const [editingReportId, setEditingReportId] = useState(null)

	const [formData, setFormData] = useState({
		date: new Date().toISOString().split('T')[0],
		eating: 'good',
		activityNotes: '',
		sleepTime: '',
		image: null
	})

	useEffect(() => {
		const teacher = JSON.parse(localStorage.getItem('teacher') || JSON.stringify(teacherData))
		setReports(getReportsByTeacher(teacher.id))
	}, [])

	const handleImageChange = e => {
		const file = e.target.files[0]
		if (file) {
			const reader = new FileReader()
			reader.onloadend = () => setFormData({ ...formData, image: reader.result })
			reader.readAsDataURL(file)
		}
	}

	const handleSubmit = e => {
		e.preventDefault()
		const teacher = JSON.parse(localStorage.getItem('teacher') || JSON.stringify(teacherData))

		// EDIT mode
		if (editingReportId) {
			const updated = updateReport(editingReportId, {
				...formData,
				teacherId: teacher.id
			})
			setReports(prev => prev.map(r => (r.id === editingReportId ? updated : r)))
			setEditingReportId(null)
		} else {
			// CREATE mode
			const saved = saveReport({
				...formData,
				teacherId: teacher.id
			})
			setReports(prev => [saved, ...prev])
		}

		setFormData({
			date: new Date().toISOString().split('T')[0],
			eating: 'good',
			activityNotes: '',
			sleepTime: '',
			image: null
		})
		setShowForm(false)
	}

	const toggleReport = id => {
		const expanded = new Set(expandedReports)
		expanded.has(id) ? expanded.delete(id) : expanded.add(id)
		setExpandedReports(expanded)
	}

	// DELETE function
	const handleDelete = id => {
		deleteReport(id)
		setReports(prev => prev.filter(r => r.id !== id))
	}

	// EDIT function
	const handleEdit = report => {
		setEditingReportId(report.id)
		setFormData({
			date: report.date,
			eating: report.eating,
			activityNotes: report.activityNotes,
			sleepTime: report.sleepTime,
			image: report.image
		})
		setShowForm(true)
	}

	const themeColor = (currentTheme && currentTheme.primary) || '#2563EB'

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<motion.h3 
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					className={`text-2xl font-bold transition-colors duration-300 ${
						darkMode ? 'text-white' : 'text-gray-900'
					}`}
				>
					Kunlik hisobotlar
				</motion.h3>
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={() => setShowForm(!showForm)}
					className='flex items-center gap-2 px-6 py-3 text-white rounded-lg transition-all duration-300 font-medium'
					style={{ backgroundColor: themeColor }}
					onMouseEnter={(e) => {
						e.target.style.backgroundColor = (currentTheme && currentTheme.primaryHover) || '#1D4ED8'
					}}
					onMouseLeave={(e) => {
						e.target.style.backgroundColor = themeColor
					}}
				>
					<Plus className='w-5 h-5' />
					Hisobot yaratish
				</motion.button>
			</div>

			{showForm && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
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
					<h4 className={`text-xl font-bold mb-4 transition-colors duration-300 ${
						darkMode ? 'text-white' : 'text-gray-900'
					}`}>Kunlik hisobot yaratish</h4>
					<form onSubmit={handleSubmit} className='space-y-4'>
						<div>
							<label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
								darkMode ? 'text-gray-300' : 'text-gray-700'
							}`}>
								{t('activities.date')}
							</label>
							<input
								type='date'
								value={formData.date}
								onChange={e => setFormData({ ...formData, date: e.target.value })}
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
								Ovqatlanish holati
							</label>
							<select
								value={formData.eating}
								onChange={e => setFormData({ ...formData, eating: e.target.value })}
								className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${
									darkMode 
										? 'bg-[#334155] border-[#475569] text-white' 
										: 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'
								} focus:outline-none focus:ring-2 focus:ring-blue-500`}
							>
								<option value='good'>Yaxshi</option>
								<option value='average'>O\'rtacha</option>
								<option value='poor'>Yomon</option>
							</select>
						</div>

						<div>
							<label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
								darkMode ? 'text-gray-300' : 'text-gray-700'
							}`}>
								Faoliyat izohlari
							</label>
							<textarea
								value={formData.activityNotes}
								onChange={e =>
									setFormData({ ...formData, activityNotes: e.target.value })
								}
								rows={4}
								className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${
									darkMode 
										? 'bg-[#334155] border-[#475569] text-white' 
										: 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'
								} focus:outline-none focus:ring-2 focus:ring-blue-500`}
								placeholder="Bugungi faoliyatlar, xulq-atvor yoki muhim voqealar haqida yozing..."
								required
							/>
						</div>

						<div>
							<label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
								darkMode ? 'text-gray-300' : 'text-gray-700'
							}`}>
								{t('sleep.duration')}
							</label>
							<input
								type='text'
								value={formData.sleepTime}
								onChange={e => setFormData({ ...formData, sleepTime: e.target.value })}
								className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${
									darkMode 
										? 'bg-[#334155] border-[#475569] text-white' 
										: 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'
								} focus:outline-none focus:ring-2 focus:ring-blue-500`}
								placeholder='masalan, 2 soat, 1.5 soat'
								required
							/>
						</div>

						<div>
							<label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
								darkMode ? 'text-gray-300' : 'text-gray-700'
							}`}>
								Rasm yuklash (ixtiyoriy)
							</label>
							<div className='flex items-center gap-4'>
								<label className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition-colors duration-300 ${
									darkMode 
										? 'bg-[#334155] border-[#475569] text-white hover:bg-[#3D4A5F]' 
										: 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-700 hover:bg-gray-50'
								}`}>
									<ImageIcon className='w-5 h-5' />
									<span className='text-sm'>Rasm tanlash</span>
									<input
										type='file'
										accept='image/*'
										onChange={handleImageChange}
										className='hidden'
									/>
								</label>
								{formData.image && (
									<div className='relative'>
										<img
											src={formData.image}
											alt='Preview'
											className='w-20 h-20 object-cover rounded-lg'
										/>
										<button
											type='button'
											onClick={() => setFormData({ ...formData, image: null })}
											className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors'
										>
											<X className='w-4 h-4' />
										</button>
									</div>
								)}
							</div>
						</div>

						<div className='flex gap-3'>
							<button
								type='submit'
								className='flex-1 px-6 py-3 text-white rounded-lg transition-all duration-300 font-medium'
								style={{ backgroundColor: themeColor }}
								onMouseEnter={(e) => {
									e.target.style.backgroundColor = (currentTheme && currentTheme.primaryHover) || '#1D4ED8'
								}}
								onMouseLeave={(e) => {
									e.target.style.backgroundColor = themeColor
								}}
							>
								Hisobotni saqlash
							</button>
							<button
								type='button'
								onClick={() => {
									setShowForm(false)
									setFormData({
										date: new Date().toISOString().split('T')[0],
										eating: 'good',
										activityNotes: '',
										sleepTime: '',
										image: null
									})
								}}
								className={`px-6 py-3 rounded-lg transition-colors duration-300 font-medium ${
									darkMode 
										? 'bg-[#334155] text-gray-300 hover:bg-[#3D4A5F]' 
										: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
								}`}
							>
								{t('common.cancel')}
							</button>
						</div>
					</form>
				</motion.div>
			)}

			<div className='space-y-6'>
				{reports.length > 0 ? (
					reports.map((report, index) => {
						const isExpanded = expandedReports.has(report.id)
						return (
							<motion.div
								key={report.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.05 }}
								whileHover={{ y: -2, transition: { duration: 0.2, ease: 'easeOut' } }}
								className={`relative rounded-2xl overflow-hidden transition-all duration-200 ${
									darkMode 
										? 'bg-[#1E293B] border-[#334155]' 
										: 'bg-white border-[#E5E7EB]'
								} border shadow-[0_6px_20px_rgba(0,0,0,0.05)]`}
								style={{
									borderTop: darkMode ? undefined : `4px solid ${themeColor}`
								}}
							>
								<button
									onClick={() => toggleReport(report.id)}
									className={`w-full p-6 flex items-center justify-between transition-colors duration-300 ${
										darkMode ? 'hover:bg-[#334155]' : 'hover:bg-gray-50'
									}`}
								>
									<div className='flex items-center gap-4 flex-1 text-left'>
										<Calendar className='w-5 h-5' style={{ color: themeColor }} />
										<div>
											<p className={`font-semibold transition-colors duration-300 ${
												darkMode ? 'text-white' : 'text-gray-900'
											}`}>
												{new Date(report.date).toLocaleDateString('uz-UZ', {
													weekday: 'long',
													year: 'numeric',
													month: 'long',
													day: 'numeric'
												})}
											</p>
											<p className={`text-sm transition-colors duration-300 ${
												darkMode ? 'text-gray-400' : 'text-gray-500'
											}`}>
												Yaratilgan:{' '}
												{new Date(report.createdAt).toLocaleString('uz-UZ', {
													month: 'short',
													day: 'numeric',
													hour: '2-digit',
													minute: '2-digit'
												})}
											</p>
										</div>
									</div>
									{isExpanded ? (
										<ChevronUp className={`w-5 h-5 transition-colors duration-300 ${
											darkMode ? 'text-gray-400' : 'text-gray-400'
										}`} />
									) : (
										<ChevronDown className={`w-5 h-5 transition-colors duration-300 ${
											darkMode ? 'text-gray-400' : 'text-gray-400'
										}`} />
									)}
								</button>

								{isExpanded && (
									<div className={`px-6 pb-6 border-t transition-colors duration-300 ${
										darkMode ? 'border-[#334155] pt-4' : 'border-gray-100 pt-4'
									}`}>
										<div className='mb-4'>
											<p className={`text-sm font-medium mb-2 transition-colors duration-300 ${
												darkMode ? 'text-gray-300' : 'text-gray-700'
											}`}>
												Faoliyat izohlari:
											</p>
											<p className={`whitespace-pre-wrap transition-colors duration-300 ${
												darkMode ? 'text-gray-300' : 'text-gray-700'
											}`}>
												{report.activityNotes}
											</p>
										</div>

										<div className='flex items-center gap-6 mb-4'>
											<div>
												<span className={`text-sm transition-colors duration-300 ${
													darkMode ? 'text-gray-400' : 'text-gray-500'
												}`}>Ovqatlanish: </span>
												<span
													className={`font-medium transition-colors duration-300 ${
														report.eating === 'good'
															? 'text-green-600'
															: report.eating === 'average'
																? 'text-yellow-600'
																: 'text-red-600'
													}`}
												>
													{report.eating === 'good' ? 'Yaxshi' : report.eating === 'average' ? 'O\'rtacha' : 'Yomon'}
												</span>
											</div>
											<div>
												<span className={`text-sm transition-colors duration-300 ${
													darkMode ? 'text-gray-400' : 'text-gray-500'
												}`}>Uyqu vaqti: </span>
												<span className={`font-medium transition-colors duration-300 ${
													darkMode ? 'text-white' : 'text-gray-900'
												}`}>
													{report.sleepTime}
												</span>
											</div>
										</div>

										{report.image && (
											<div className='mt-4'>
												<img
													src={report.image}
													alt='Report'
													className='w-full max-w-md rounded-lg object-cover'
												/>
											</div>
										)}
									</div>
								)}
							</motion.div>
						)
					})
				) : (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className={`relative rounded-2xl p-12 text-center transition-all duration-200 ${
							darkMode 
								? 'bg-[#1E293B] border-[#334155]' 
								: 'bg-white border-[#E5E7EB]'
						} border shadow-[0_6px_20px_rgba(0,0,0,0.05)]`}
						style={{
							borderTop: darkMode ? undefined : `4px solid ${themeColor}`
						}}
					>
						<FileText className={`w-16 h-16 mx-auto mb-4 transition-colors duration-300 ${
							darkMode ? 'text-gray-600' : 'text-gray-300'
						}`} />
						<p className={`text-lg transition-colors duration-300 ${
							darkMode ? 'text-gray-400' : 'text-gray-500'
						}`}>Hozircha hisobotlar yo'q</p>
						<p className={`text-sm mt-2 transition-colors duration-300 ${
							darkMode ? 'text-gray-500' : 'text-gray-400'
						}`}>
							Boshlash uchun birinchi kunlik hisobotni yarating
						</p>
					</motion.div>
				)}
			</div>
		</div>
	)
}

export default Reports
