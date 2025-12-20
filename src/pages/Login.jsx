import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn, Key, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'

const Login = () => {
	const [username, setUsername] = useState('')
	const [code, setCode] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()
	const { login } = useAuth()
	const { t } = useLanguage()

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')
		
		if (!username.trim()) {
			setError('Login kiriting')
			return
		}
		
		setLoading(true)

		// Check if it's a child login (has password but no code)
		if (!code.trim()) {
			// Try child login
			const childCredentials = JSON.parse(localStorage.getItem('childCredentials') || '[]')
			const children = JSON.parse(localStorage.getItem('children') || '[]')
			const credential = childCredentials.find(c => c.login === username.trim())
			
			if (credential) {
				const child = children.find(c => c.id === credential.childId)
				if (child) {
					// Child login successful - redirect to parent view or special child view
					const childUser = {
						id: child.id,
						username: username.trim(),
						name: child.name,
						role: 'child',
						childId: child.id,
						childName: child.name
					}
					localStorage.setItem('currentUser', JSON.stringify(childUser))
					navigate('/parent/dashboard')
					setLoading(false)
					return
				}
			}
			setError('Login yoki parol noto\'g\'ri')
			setLoading(false)
			return
		}
		
		// Regular code-based login
		try {
			const result = login(code.trim().toUpperCase(), username.trim())
			if (result && result.success) {
				// Redirect based on role
				const role = result.role
				setLoading(false)
				// Small delay to ensure state is updated
				setTimeout(() => {
					if (role === 'admin') {
						navigate('/admin/dashboard', { replace: true })
					} else if (role === 'director') {
						navigate('/director/dashboard', { replace: true })
					} else if (role === 'teacher') {
						navigate('/teacher/dashboard', { replace: true })
					} else if (role === 'parent') {
						navigate('/parent/dashboard', { replace: true })
					}
				}, 50)
			} else {
				setError(result?.error || t('auth.invalidCode') || 'Noto\'g\'ri login yoki kod')
				setLoading(false)
			}
		} catch (err) {
			console.error('Login error:', err)
			setError('Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.')
			setLoading(false)
		}
	}

	return (
		<div className='min-h-screen bg-[#FFFFFF] dark:bg-[#0F172A] flex items-center justify-center p-4 transition-colors duration-300'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
				className='bg-white dark:bg-[#1E293B] rounded-[20px] shadow-2xl p-8 w-full max-w-md border border-gray-200 dark:border-[#334155] transition-colors duration-300'
			>
				<div className='text-center mb-8'>
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ delay: 0.2, type: 'spring' }}
						className='w-20 h-20 rounded-[20px] flex items-center justify-center mx-auto mb-4 shadow-lg'
						style={{ backgroundColor: '#2563EB' }}
					>
						<LogIn className='w-10 h-10 text-white' />
					</motion.div>
					<h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300'>
						Kindergarten CRM
					</h1>
					<p className='text-gray-600 dark:text-gray-400 transition-colors duration-300'>{t('auth.login')}</p>
				</div>

				<form onSubmit={handleSubmit} className='space-y-6'>
					{error && (
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-[14px] transition-colors duration-300'
						>
							{error}
						</motion.div>
					)}

					<div>
						<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300'>
							Login
						</label>
						<div className='relative'>
							<User className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
							<input
								type='text'
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className='w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-[#334155] rounded-[14px] bg-white dark:bg-[#0F172A] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300'
								placeholder='Login kiriting'
								required
								autoFocus
							/>
						</div>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300'>
							{t('auth.enterCode')} <span className='text-gray-400 text-xs'>(Ixtiyoriy - faqat xodimlar uchun)</span>
						</label>
						<div className='relative'>
							<Key className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
							<input
								type='text'
								value={code}
								onChange={(e) => setCode(e.target.value.toUpperCase())}
								className='w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-[#334155] rounded-[14px] bg-white dark:bg-[#0F172A] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase transition-colors duration-300'
								placeholder={t('auth.codePlaceholder')}
							/>
						</div>
					</div>

					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						type='submit'
						disabled={loading}
						className='w-full text-white py-3 rounded-[14px] font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm'
						style={{ backgroundColor: loading ? '#9CA3AF' : '#2563EB' }}
					>
						{loading ? 'Kirilmoqda...' : t('auth.login')}
					</motion.button>
				</form>

				<div className='mt-6 p-4 bg-[#F5F6FA] dark:bg-[#334155] rounded-[14px] transition-colors duration-300'>
					<p className='text-xs text-gray-600 dark:text-gray-400 text-center mb-2 transition-colors duration-300'>
						Demo ma'lumotlar:
					</p>
					<div className='space-y-1 text-xs text-gray-700 dark:text-gray-300 text-center transition-colors duration-300'>
						<p><strong>Admin:</strong> Login: admin | Kod: ADMIN001</p>
						<p><strong>Direktor:</strong> Login: director | Kod: DIR001</p>
						<p><strong>O'qituvchi:</strong> Login: teacher | Kod: TEACH001</p>
						<p><strong>Ota-Ona:</strong> Login: parent | Kod: PARENT001</p>
					</div>
				</div>
			</motion.div>
		</div>
	)
}

export default Login
