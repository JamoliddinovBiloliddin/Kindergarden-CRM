import { motion } from 'framer-motion'
import {
	LayoutDashboard,
	Users,
	UtensilsCrossed,
	Syringe,
	BookOpen,
	Warehouse,
	Moon,
	BookCheck,
	CalendarCheck,
	MessageSquare,
	Settings,
	X,
	LogOut,
	QrCode,
	FileText,
	UserCircle
} from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useTheme } from '../../contexts/ThemeContext'

const SidebarContent = ({ role, isOpen, setIsOpen }) => {
	const location = useLocation()
	const navigate = useNavigate()
	const { user, logout } = useAuth()
	const { t } = useLanguage()
	const { currentTheme, darkMode } = useTheme()

	// Define menu items based on role
	const getMenuItems = () => {
		const baseItems = [
			{ path: `/${role}/dashboard`, icon: LayoutDashboard, label: t('common.dashboard') }
		]

		if (role === 'admin') {
			return [
				...baseItems,
				{ path: '/admin/filial', icon: Warehouse, label: t('modules.filial') },
				{ path: '/admin/teachers', icon: Users, label: 'Tarbiyachilar' },
				{ path: '/admin/groups', icon: Users, label: 'Guruhlar' },
				{ path: '/admin/children', icon: Users, label: t('modules.children') },
				{ path: '/admin/meals', icon: UtensilsCrossed, label: t('modules.meals') },
				{ path: '/admin/vaccination', icon: Syringe, label: t('modules.vaccination') },
				{ path: '/admin/activities', icon: BookOpen, label: t('modules.activities') },
				{ path: '/admin/complaints', icon: MessageSquare, label: t('modules.complaints') },
				{ path: '/admin/settings', icon: Settings, label: t('common.settings') }
			]
		} else if (role === 'director') {
			return [
				...baseItems,
				{ path: '/director/filial', icon: Warehouse, label: t('modules.filial') },
				{ path: '/director/children', icon: Users, label: t('modules.children') },
				{ path: '/director/meals', icon: UtensilsCrossed, label: t('modules.meals') },
				{ path: '/director/vaccination', icon: Syringe, label: t('modules.vaccination') },
				{ path: '/director/activities', icon: BookOpen, label: t('modules.activities') },
				{ path: '/director/storage', icon: Warehouse, label: t('modules.storage') },
				{ path: '/director/complaints', icon: MessageSquare, label: t('modules.complaints') },
				{ path: '/director/settings', icon: Settings, label: t('common.settings') }
			]
		} else if (role === 'teacher') {
			return [
				...baseItems,
				{ path: '/teacher/group', icon: Users, label: t('modules.groups') },
				{ path: '/teacher/attendance', icon: CalendarCheck, label: t('modules.attendance') },
				{ path: '/teacher/meals', icon: UtensilsCrossed, label: t('modules.meals') },
				{ path: '/teacher/sleep', icon: Moon, label: t('modules.sleep') },
				{ path: '/teacher/homework', icon: BookCheck, label: t('modules.homework') },
				{ path: '/teacher/reports', icon: FileText, label: 'Hisobotlar' },
				{ path: '/teacher/profile', icon: UserCircle, label: 'Profil' },
				{ path: '/teacher/settings', icon: Settings, label: t('common.settings') }
			]
		} else if (role === 'parent') {
			return [
				...baseItems,
				{ path: '/parent/child', icon: Users, label: t('modules.myChild') },
				{ path: '/parent/meals', icon: UtensilsCrossed, label: t('modules.meals') },
				{ path: '/parent/vaccination', icon: Syringe, label: t('modules.vaccination') },
				{ path: '/parent/activities', icon: BookOpen, label: t('modules.activities') },
				{ path: '/parent/sleep', icon: Moon, label: t('modules.sleep') },
				{ path: '/parent/homework', icon: BookCheck, label: t('modules.homework') },
				{ path: '/parent/qr', icon: QrCode, label: t('modules.qrCode') },
				{ path: '/parent/complaints', icon: MessageSquare, label: t('modules.complaints') },
				{ path: '/parent/settings', icon: Settings, label: t('common.settings') }
			]
		}

		return baseItems
	}

	const menuItems = getMenuItems()

	const isActive = (path) => {
		return location.pathname === path
	}

	const handleLinkClick = () => {
		if (window.innerWidth < 768) {
			setIsOpen(false)
		}
	}

	const handleLogout = () => {
		if (confirm('Chiqishni xohlaysizmi?')) {
			logout()
			navigate('/')
		}
	}

	return (
		<>
			<div className='p-6 border-b border-[#1F2937] flex items-center justify-between transition-colors duration-300'>
				<div className='flex-1'>
					<h1 className='text-2xl font-bold text-white transition-colors duration-300'>
						Kindergarten CRM
					</h1>
					<p className='text-sm mt-1 text-gray-400 transition-colors duration-300'>
						{role.charAt(0).toUpperCase() + role.slice(1)} Panel
					</p>
				</div>
				<button
					onClick={() => setIsOpen(false)}
					className='md:hidden text-white hover:opacity-70 transition-colors duration-300'
				>
					<X className='w-6 h-6' />
				</button>
			</div>

			<div className='p-4 border-b border-[#1F2937] transition-colors duration-300'>
				<div className='flex items-center gap-3'>
					<motion.div
						whileHover={{ scale: 1.05 }}
						className='w-12 h-12 rounded-[14px] flex items-center justify-center text-white font-semibold text-lg shadow-sm'
						style={{
							backgroundColor: (currentTheme && currentTheme.primary) || '#2563EB'
						}}
					>
						{user?.name?.charAt(0) || 'U'}
					</motion.div>
					<div className='flex-1 min-w-0'>
						<p className='font-semibold truncate text-white transition-colors duration-300'>
							{user?.name}
						</p>
						<p className='text-xs truncate text-gray-400 transition-colors duration-300'>
							{user?.role}
						</p>
					</div>
				</div>
			</div>

			<nav className='flex-1 p-4 space-y-2 overflow-y-auto'>
				{menuItems.map((item, index) => {
					const Icon = item.icon
					const active = isActive(item.path)
					return (
						<motion.div
							key={item.path}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: index * 0.05 }}
						>
							<Link
								to={item.path}
								onClick={handleLinkClick}
								className={`flex items-center gap-3 px-4 py-3 rounded-[14px] transition-all duration-300 ${active
									? 'text-white shadow-sm'
									: 'text-gray-300 hover:bg-[#1F2937]'
									}`}
								style={active ? {
									backgroundColor: (currentTheme && currentTheme.primary) || '#2563EB'
								} : {}}
							>
								<Icon className='w-5 h-5' />
								<span className='font-medium'>{item.label}</span>
							</Link>
						</motion.div>
					)
				})}
			</nav>

			<div className='p-4 border-t border-[#1F2937] transition-colors duration-300'>
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={handleLogout}
					className='flex items-center gap-3 px-4 py-3 rounded-[14px] transition-all duration-300 w-full text-red-400 hover:bg-[#1F2937]'
				>
					<LogOut className='w-5 h-5' />
					<span className='font-medium'>{t('common.logout')}</span>
				</motion.button>
			</div>
		</>
	)
}

const Sidebar = ({ role, isOpen, setIsOpen }) => {
	const { darkMode } = useTheme()

	return (
		<>
			{/* Desktop Sidebar - always visible */}
			<aside
				className={`hidden md:flex fixed inset-y-0 left-0 w-64 flex-col z-40 transition-colors duration-300 ${darkMode
					? 'bg-[#020617] border-[#334155]'
					: 'bg-[#111827] border-[#1F2937]'
					} shadow-lg`}
				style={{ top: '0', height: '100vh' }}
			>
				<SidebarContent role={role} isOpen={isOpen} setIsOpen={setIsOpen} />
			</aside>

			{/* Mobile Sidebar - animated */}
			<motion.aside
				initial={false}
				animate={{
					x: isOpen ? 0 : '-100%'
				}}
				transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
				className={`md:hidden fixed inset-y-0 left-0 w-64 ${darkMode
					? 'bg-[#020617] border-[#334155]'
					: 'bg-[#111827] border-[#1F2937]'
					} shadow-lg flex flex-col z-50 transition-colors duration-300`}
				style={{ top: '0', height: '100vh' }}
			>
				<SidebarContent role={role} isOpen={isOpen} setIsOpen={setIsOpen} />
			</motion.aside>
		</>
	)
}

export default Sidebar
