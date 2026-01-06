import { useState, useEffect } from 'react'
import { User, Mail, Phone, Lock, Save, Edit2, Calendar, Upload } from 'lucide-react'
import { motion } from 'framer-motion'
import { teacherData } from '../../mock/teacherData'
import { useTheme } from '../../contexts/ThemeContext'
import { useLanguage } from '../../contexts/LanguageContext'

const Profile = () => {
	const { darkMode, currentTheme } = useTheme()
	const { t } = useLanguage()
	const [teacher, setTeacher] = useState(teacherData)
	const [editingPhone, setEditingPhone] = useState(false)
	const [phoneValue, setPhoneValue] = useState('')
	const [passwordForm, setPasswordForm] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: ''
	})
	const [passwordSaved, setPasswordSaved] = useState(false)
	const [profileImage, setProfileImage] = useState(null)

	useEffect(() => {
		const stored = localStorage.getItem('teacher')
		if (stored) {
			const parsed = JSON.parse(stored)
			setTeacher(parsed)
			setPhoneValue(parsed.phone || '')
			setProfileImage(parsed.profileImage || null)
		} else {
			setPhoneValue(teacherData.phone)
		}
	}, [])

	const handleImageChange = (e) => {
		const file = e.target.files[0]
		if (file) {
			const reader = new FileReader()
			reader.onloadend = () => {
				setProfileImage(reader.result)
				const updated = { ...teacher, profileImage: reader.result }
				setTeacher(updated)
				localStorage.setItem('teacher', JSON.stringify(updated))
			}
			reader.readAsDataURL(file)
		}
	}

	const handleSavePhone = () => {
		const updated = { ...teacher, phone: phoneValue }
		setTeacher(updated)
		localStorage.setItem('teacher', JSON.stringify(updated))
		setEditingPhone(false)
	}

	const handlePasswordChange = e => {
		e.preventDefault()
		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			alert('Yangi parollar mos kelmaydi!')
			return
		}
		if (passwordForm.newPassword.length < 6) {
			alert('Parol kamida 6 belgi bo\'lishi kerak!')
			return
		}
		setPasswordSaved(true)
		setPasswordForm({
			currentPassword: '',
			newPassword: '',
			confirmPassword: ''
		})
		setTimeout(() => setPasswordSaved(false), 3000)
	}

	const themeColor = (currentTheme && currentTheme.primary) || '#2563EB'

	return (
		<div className='space-y-6 max-w-4xl'>
			<motion.div
				initial={{ opacity: 0, y: -20 }}
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
				<div className='flex flex-col md:flex-row items-center md:items-start gap-6 mb-6'>
					<div className='relative'>
						<div className={`w-32 h-32 rounded-full flex items-center justify-center text-white font-bold text-4xl transition-colors duration-300 overflow-hidden ${
							profileImage ? '' : ''
						}`}
							style={{
								backgroundColor: profileImage ? 'transparent' : themeColor
							}}
						>
							{profileImage ? (
								<img src={profileImage} alt='Profile' className='w-full h-full object-cover' />
							) : (
								teacher.name.charAt(0)
							)}
						</div>
						<label className='absolute bottom-0 right-0 bg-white dark:bg-[#334155] rounded-full p-2 cursor-pointer shadow-lg border border-gray-200 dark:border-[#475569] hover:scale-110 transition-transform'>
							<Upload className='w-4 h-4 text-gray-600 dark:text-gray-300' />
							<input
								type='file'
								accept='image/*'
								onChange={handleImageChange}
								className='hidden'
							/>
						</label>
					</div>
					<div className='flex-1 text-center md:text-left'>
						<h2 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
							darkMode ? 'text-white' : 'text-gray-900'
						}`}>{teacher.name}</h2>
						<p className={`text-lg mb-1 transition-colors duration-300 ${
							darkMode ? 'text-gray-400' : 'text-gray-500'
						}`}>{teacher.role}</p>
						<div className={`flex items-center justify-center md:justify-start gap-2 text-sm transition-colors duration-300 ${
							darkMode ? 'text-gray-500' : 'text-gray-400'
						}`}>
							<Calendar className='w-4 h-4' />
							<span>
								Qo'shilgan {new Date(teacher.joinedDate).toLocaleDateString('uz-UZ', {
									year: 'numeric',
									month: 'long',
									day: 'numeric'
								})}
							</span>
						</div>
					</div>
				</div>

				<div className='space-y-4'>
					<div className={`flex items-center gap-4 p-4 rounded-lg transition-colors duration-300 ${
						darkMode ? 'bg-[#334155]' : 'bg-gray-50'
					}`}>
						<Mail className='w-5 h-5' style={{ color: themeColor }} />
						<div className='flex-1'>
							<p className={`text-sm transition-colors duration-300 ${
								darkMode ? 'text-gray-400' : 'text-gray-500'
							}`}>Email</p>
							<p className={`font-medium transition-colors duration-300 ${
								darkMode ? 'text-white' : 'text-gray-900'
							}`}>{teacher.email}</p>
						</div>
					</div>

					<div className={`flex items-center gap-4 p-4 rounded-lg transition-colors duration-300 ${
						darkMode ? 'bg-[#334155]' : 'bg-gray-50'
					}`}>
						<Phone className='w-5 h-5' style={{ color: themeColor }} />
						<div className='flex-1'>
							<p className={`text-sm transition-colors duration-300 ${
								darkMode ? 'text-gray-400' : 'text-gray-500'
							}`}>Telefon raqami</p>
							{editingPhone ? (
								<div className='flex items-center gap-2 mt-1'>
									<input
										type='tel'
										value={phoneValue}
										onChange={e => setPhoneValue(e.target.value)}
										className={`flex-1 px-3 py-2 border rounded-lg transition-colors duration-300 ${
											darkMode 
												? 'bg-[#1E293B] border-[#475569] text-white' 
												: 'bg-white border-[#E5E7EB] text-gray-900'
										} focus:outline-none focus:ring-2 focus:ring-blue-500`}
										placeholder='+998901234567'
									/>
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										onClick={handleSavePhone}
										className='px-4 py-2 text-white rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1'
										style={{ backgroundColor: themeColor }}
										onMouseEnter={(e) => {
											e.target.style.backgroundColor = (currentTheme && currentTheme.primaryHover) || '#1D4ED8'
										}}
										onMouseLeave={(e) => {
											e.target.style.backgroundColor = themeColor
										}}
									>
										<Save className='w-4 h-4' />
										{t('common.save')}
									</motion.button>
									<button
										onClick={() => {
											setEditingPhone(false)
											setPhoneValue(teacher.phone)
										}}
										className={`px-4 py-2 rounded-lg transition-colors duration-300 text-sm font-medium ${
											darkMode 
												? 'bg-[#334155] text-gray-300 hover:bg-[#3D4A5F]' 
												: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
										}`}
									>
										{t('common.cancel')}
									</button>
								</div>
							) : (
								<div className='flex items-center gap-2 mt-1'>
									<p className={`font-medium transition-colors duration-300 ${
										darkMode ? 'text-white' : 'text-gray-900'
									}`}>
										{teacher.phone || 'O\'rnatilmagan'}
									</p>
									<button
										onClick={() => setEditingPhone(true)}
										className='transition-colors duration-300'
										style={{ color: themeColor }}
									>
										<Edit2 className='w-4 h-4' />
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</motion.div>

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
				<div className='flex items-center gap-3 mb-6'>
					<Lock className='w-5 h-5' style={{ color: themeColor }} />
					<h3 className={`text-xl font-bold transition-colors duration-300 ${
						darkMode ? 'text-white' : 'text-gray-900'
					}`}>Parolni o'zgartirish</h3>
				</div>

				<form onSubmit={handlePasswordChange} className='space-y-4'>
					<div>
						<label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
							darkMode ? 'text-gray-300' : 'text-gray-700'
						}`}>
							Joriy parol
						</label>
						<input
							type='password'
							value={passwordForm.currentPassword}
							onChange={e =>
								setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
							}
							className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${
								darkMode 
									? 'bg-[#334155] border-[#475569] text-white' 
									: 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'
							} focus:outline-none focus:ring-2 focus:ring-blue-500`}
							placeholder='Joriy parolni kiriting'
							required
						/>
					</div>

					<div>
						<label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
							darkMode ? 'text-gray-300' : 'text-gray-700'
						}`}>
							Yangi parol
						</label>
						<input
							type='password'
							value={passwordForm.newPassword}
							onChange={e =>
								setPasswordForm({ ...passwordForm, newPassword: e.target.value })
							}
							className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${
								darkMode 
									? 'bg-[#334155] border-[#475569] text-white' 
									: 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'
							} focus:outline-none focus:ring-2 focus:ring-blue-500`}
							placeholder='Yangi parolni kiriting (min. 6 belgi)'
							required
						/>
					</div>

					<div>
						<label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
							darkMode ? 'text-gray-300' : 'text-gray-700'
						}`}>
							Yangi parolni tasdiqlash
						</label>
						<input
							type='password'
							value={passwordForm.confirmPassword}
							onChange={e =>
								setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
							}
							className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${
								darkMode 
									? 'bg-[#334155] border-[#475569] text-white' 
									: 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'
							} focus:outline-none focus:ring-2 focus:ring-blue-500`}
							placeholder='Yangi parolni tasdiqlang'
							required
						/>
					</div>

					<button
						type='submit'
						className={`w-full px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 ${
							passwordSaved ? 'bg-green-500' : ''
						}`}
						style={!passwordSaved ? {
							backgroundColor: themeColor
						} : {}}
						onMouseEnter={(e) => {
							if (!passwordSaved) {
								e.target.style.backgroundColor = (currentTheme && currentTheme.primaryHover) || '#1D4ED8'
							}
						}}
						onMouseLeave={(e) => {
							if (!passwordSaved) {
								e.target.style.backgroundColor = themeColor
							}
						}}
					>
						{passwordSaved ? 'Parol muvaffaqiyatli o\'zgartirildi!' : 'Parolni o\'zgartirish'}
					</button>
				</form>
			</motion.div>
		</div>
	)
}

export default Profile
