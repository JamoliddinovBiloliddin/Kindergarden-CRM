import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { QrCode, Download } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'

const ParentQRCode = () => {
	const { user } = useAuth()
	const { darkMode, currentTheme } = useTheme()
	const [child, setChild] = useState(null)
	const themeColor = (currentTheme && currentTheme.primary) || '#2563EB'

	useEffect(() => {
		const children = JSON.parse(localStorage.getItem('children') || '[]')
		const foundChild = children.find((c) => c.id === user?.childId)
		setChild(foundChild)
	}, [user])

	if (!child) {
		return (
			<div className='flex items-center justify-center h-64'>
				<p className={`transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'
					}`}>Bola ma'lumotlari topilmadi</p>
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			<h1 className={`text-3xl font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'
				}`}>QR Kod</h1>

			<div className={`flex flex-col items-center justify-center rounded-xl shadow-sm border p-8 transition-colors duration-300 ${darkMode
					? 'bg-[#1E293B] border-[#334155]'
					: 'bg-white border-gray-200'
				}`}>
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ delay: 0.2, type: 'spring' }}
					className='mb-6 bg-white p-4 rounded-lg'
				>
					<QRCodeSVG
						value={child.qrCode || `CHILD${child.id}`}
						size={256}
						bgColor='#FFFFFF'
						fgColor='#000000'
					/>
				</motion.div>
				<h2 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'
					}`}>{child.name}</h2>
				<p className={`mb-4 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'
					}`}>QR kodni skanerlang yoki yuklab oling</p>
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					style={{ backgroundColor: themeColor }}
					onMouseEnter={(e) => {
						e.target.style.backgroundColor = (currentTheme && currentTheme.primaryHover) || '#1D4ED8'
					}}
					onMouseLeave={(e) => {
						e.target.style.backgroundColor = themeColor
					}}
					className='flex items-center gap-2 px-6 py-3 text-white rounded-lg transition-colors duration-300'
				>
					<Download className='w-5 h-5' />
					Yuklab olish
				</motion.button>

			</div>

			<div className={`rounded-xl border p-6 transition-colors duration-300 ${darkMode
					? 'bg-blue-900/20 border-blue-800/30'
					: 'bg-blue-50 border-blue-200'
				}`}>
				<h3 className={`font-bold mb-2 transition-colors duration-300 ${darkMode ? 'text-blue-300' : 'text-blue-800'
					}`}>QR kod nima uchun kerak?</h3>
				<ul className={`space-y-2 transition-colors duration-300 ${darkMode ? 'text-blue-200' : 'text-blue-700'
					}`}>
					<li>• Bola haqidagi barcha ma'lumotlarga kirish</li>
					<li>• Ovqatlanish tarixini ko'rish</li>
					<li>• Emlash yozuvlarini ko'rish</li>
					<li>• Uyga vazifalarni ko'rish</li>
					<li>• Davomatni tekshirish</li>
				</ul>
			</div>
		</div>
	)
}

export default ParentQRCode

