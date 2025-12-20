import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { useTheme } from '../../contexts/ThemeContext'

const Layout = ({ role }) => {
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const { darkMode, currentTheme } = useTheme()
	const location = useLocation()

	return (
		<div className={`flex h-screen transition-colors duration-300 ${
			darkMode 
				? 'dark bg-[#0F172A]' 
				: 'bg-[#ECEFF4]'
		}`}>
			<Sidebar role={role} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
			<div className='flex-1 flex flex-col overflow-hidden md:ml-64'>
				<Navbar role={role} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
				<main className='flex-1 overflow-y-auto p-4 md:p-6' style={{ paddingTop: '80px' }}>
					<motion.div
						key={location.pathname}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
						className='h-full w-full'
					>
						<Outlet />
					</motion.div>
				</main>
			</div>
			{sidebarOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
					className='fixed inset-0 z-20 md:hidden backdrop-blur-[12px] bg-black/25'
					onClick={() => setSidebarOpen(false)}
				/>
			)}
		</div>
	)
}

export default Layout

