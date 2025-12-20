import {
	CalendarCheck,
	FileText,
	LayoutDashboard,
	LogOut,
	UserCircle,
	Users,
	X,
	UtensilsCrossed,
	Moon,
	BookCheck,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { teacherData } from '../../mock/teacherData'

const TeacherSidebar = ({ isOpen, setIsOpen }) => {
	const location = useLocation()

	const menuItems = [
		{ path: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
		{ path: '/teacher/group', icon: Users, label: 'Groups' },
		{ path: '/teacher/meals', icon: UtensilsCrossed, label: 'Ovqatlanish' },
		{ path: '/teacher/sleep', icon: Moon, label: 'Uyqu' },
		{ path: '/teacher/homework', icon: BookCheck, label: 'Uyga Vazifalar' },
		{ path: '/teacher/attendance', icon: CalendarCheck, label: 'Attendance' },
		{ path: '/teacher/reports', icon: FileText, label: 'Daily Reports' },
		{ path: '/teacher/profile', icon: UserCircle, label: 'Profile' },
	]

	const isActive = path => {
		return location.pathname === path
	}

	const handleLinkClick = () => {
		if (window.innerWidth < 768) {
			setIsOpen(false)
		}
	}

	const teacher = JSON.parse(localStorage.getItem('teacher') || JSON.stringify(teacherData))

	return (
		<aside
			className={`fixed md:static inset-y-0 left-0 w-64 bg-gradient-to-b from-pink-100 to-purple-100 shadow-lg flex flex-col z-30 transform transition-transform duration-300 ease-in-out ${
				isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
			}`}
		>
			<div className='p-6 border-b border-pink-200 flex items-center justify-between'>
				<div className='flex-1'>
					<h1 className='text-2xl font-bold text-purple-800'>Kindergarten CRM</h1>
					<p className='text-sm text-purple-600 mt-1'>Teacher Panel</p>
				</div>
				<button
					onClick={() => setIsOpen(false)}
					className='md:hidden text-purple-800 hover:text-purple-900'
				>
					<X className='w-6 h-6' />
				</button>
			</div>

			<div className='p-4 border-b border-pink-200'>
				<div className='flex items-center gap-3'>
					<div className='w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg'>
						{teacher.name.charAt(0)}
					</div>
					<div className='flex-1 min-w-0'>
						<p className='font-semibold text-purple-800 truncate'>{teacher.name}</p>
						<p className='text-xs text-purple-600 truncate'>{teacher.role}</p>
					</div>
				</div>
			</div>

			<nav className='flex-1 p-4 space-y-2 overflow-y-auto'>
				{menuItems.map(item => {
					const Icon = item.icon
					const active = isActive(item.path)
					return (
						<Link
							key={item.path}
							to={item.path}
							onClick={handleLinkClick}
							className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
								active
									? 'bg-purple-500 text-white shadow-md'
									: 'text-purple-700 hover:bg-purple-50 hover:text-purple-900'
							}`}
						>
							<Icon className='w-5 h-5' />
							<span className='font-medium'>{item.label}</span>
						</Link>
					)
				})}
			</nav>

			<div className='p-4 border-t border-pink-200'>
				<button
					onClick={() => {
						if (confirm('Are you sure you want to logout?')) {
							localStorage.removeItem('isTeacherLoggedIn')
							localStorage.removeItem('teacher')
							window.location.href = '/'
						}
					}}
					className='flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 w-full'
				>
					<LogOut className='w-5 h-5' />
					<span className='font-medium'>Logout</span>
				</button>
			</div>
		</aside>
	)
}

export default TeacherSidebar

