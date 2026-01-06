import { ChevronDown, LogOut, Menu, User } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const TeacherNavbar = ({ onMenuClick }) => {
	const location = useLocation()
	const [dropdownOpen, setDropdownOpen] = useState(false)
	const [teacher] = useState(() => {
		const stored = localStorage.getItem('teacher')
		return stored
			? JSON.parse(stored)
			: {
					name: 'Sarah Johnson',
					email: 'sarah.johnson@kindergarten.com',
					avatar: null,
			  }
	})

	const pageTitles = {
		'/dashboard': 'Dashboard',
		'/attendance': 'Attendance',
		'/reports': 'Reports',
		'/groups': 'Groups',
		'/profile': 'Profile',
	}

	const currentTitle = pageTitles[location.pathname] || 'Dashboard'

	return (
		<header className='bg-white shadow-sm border-b border-gray-200 px-4 md:px-6 py-4'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-4'>
					<button
						onClick={onMenuClick}
						className='md:hidden text-gray-700 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors'
					>
						<Menu className='w-6 h-6' />
					</button>
					<h2 className='text-xl md:text-2xl font-bold text-gray-800'>
						{currentTitle}
					</h2>
				</div>
				<div className='relative'>
					<button
						onClick={() => setDropdownOpen(!dropdownOpen)}
						className='flex items-center gap-2 md:gap-3 px-2 md:px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors'
					>
						<div className='w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm md:text-base'>
							{teacher.name.charAt(0)}
						</div>
						<span className='hidden md:inline font-medium text-gray-700'>
							{teacher.name}
						</span>
						<ChevronDown className='w-4 h-4 text-gray-500' />
					</button>
					{dropdownOpen && (
						<>
							<div
								className='fixed inset-0 z-10'
								onClick={() => setDropdownOpen(false)}
							/>
							<div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20'>
								<Link
									to='/profile'
									className='flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700'
									onClick={() => setDropdownOpen(false)}
								>
									<User className='w-4 h-4' />
									<span>Profile</span>
								</Link>
								<button
									onClick={() => {
										setDropdownOpen(false)
										if (confirm('Are you sure you want to logout?')) {
											window.location.href = '/'
										}
									}}
									className='w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600'
								>
									<LogOut className='w-4 h-4' />
									<span>Logout</span>
								</button>
							</div>
						</>
					)}
				</div>
			</div>
		</header>
	)
}

export default TeacherNavbar
