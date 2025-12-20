import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import { useTheme } from '../../contexts/ThemeContext'

const AdminComplaints = () => {
	const { t } = useLanguage()
	const { darkMode, currentTheme } = useTheme()
	const [complaints, setComplaints] = useState([])

	useEffect(() => {
		loadComplaints()
	}, [])

	const loadComplaints = () => {
		const stored = JSON.parse(localStorage.getItem('complaints') || '[]')
		setComplaints(stored)
	}

	const updateStatus = (id, status) => {
		const updated = complaints.map((c) =>
			c.id === id ? { ...c, status } : c
		)
		localStorage.setItem('complaints', JSON.stringify(updated))
		setComplaints(updated)
	}

	const getStatusIcon = (status) => {
		switch (status) {
			case 'new':
				return <Clock className='w-5 h-5 text-blue-500' />
			case 'inProgress':
				return <XCircle className='w-5 h-5 text-orange-500' />
			case 'resolved':
				return <CheckCircle className='w-5 h-5 text-green-500' />
			default:
				return <Clock className='w-5 h-5 text-gray-500' />
		}
	}

	const getStatusColor = (status) => {
		if (darkMode) {
			switch (status) {
				case 'new':
					return 'bg-blue-900/30 text-blue-300'
				case 'inProgress':
					return 'bg-orange-900/30 text-orange-300'
				case 'resolved':
					return 'bg-green-900/30 text-green-300'
				default:
					return 'bg-gray-800/30 text-gray-300'
			}
		} else {
			switch (status) {
				case 'new':
					return 'bg-blue-100 text-blue-700'
				case 'inProgress':
					return 'bg-orange-100 text-orange-700'
				case 'resolved':
					return 'bg-green-100 text-green-700'
				default:
					return 'bg-gray-100 text-gray-700'
			}
		}
	}

	return (
		<div className='space-y-6'>
			<h1 className={`text-3xl font-bold transition-colors duration-300 ${
				darkMode ? 'text-white' : 'text-gray-900'
			}`}>
				{t('modules.complaints')}
			</h1>

			<div className='space-y-6'>
				{complaints.map((complaint) => {
					const themeColor = (currentTheme && currentTheme.primary) || '#2563EB'
					return (
						<motion.div
							key={complaint.id}
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
						<div className='flex items-start justify-between mb-4'>
							<div className='flex items-center gap-3'>
								<MessageSquare className='w-6 h-6 text-purple-500' />
								<div>
									<h3 className={`font-bold transition-colors duration-300 ${
										darkMode ? 'text-white' : 'text-gray-900'
									}`}>{complaint.title}</h3>
									<p className={`text-sm transition-colors duration-300 ${
										darkMode ? 'text-gray-400' : 'text-gray-500'
									}`}>
										{complaint.parentName} • {complaint.date}
									</p>
								</div>
							</div>
							<div className='flex items-center gap-2'>
								{getStatusIcon(complaint.status)}
								<span
									className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
										complaint.status
									)}`}
								>
									{complaint.status === 'new'
										? 'Yangi'
										: complaint.status === 'inProgress'
										? 'Jarayonda'
										: 'Hal qilindi'}
								</span>
							</div>
						</div>
						<p className={`mb-4 transition-colors duration-300 ${
							darkMode ? 'text-gray-400' : 'text-gray-600'
						}`}>{complaint.message}</p>
						<div className='flex gap-2'>
							{complaint.status !== 'inProgress' && (
								<button
									onClick={() => updateStatus(complaint.id, 'inProgress')}
									className='px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600'
								>
									Jarayonda
								</button>
							)}
							{complaint.status !== 'resolved' && (
								<button
									onClick={() => updateStatus(complaint.id, 'resolved')}
									className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600'
								>
									Hal qilindi
								</button>
							)}
						</div>
						</motion.div>
					)
				})}
			</div>
		</div>
	)
}

export default AdminComplaints

