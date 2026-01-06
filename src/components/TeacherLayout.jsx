import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import TeacherNavbar from './TeacherNavbar'
import TeacherSidebar from './TeacherSidebar'

const TeacherLayout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false)

	return (
		<div className='flex h-screen bg-gray-50'>
			<TeacherSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
			<div className='flex-1 flex flex-col overflow-hidden'>
				<TeacherNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
				<main className='flex-1 overflow-y-auto p-4 md:p-6'>
					<Outlet />
				</main>
			</div>
			{sidebarOpen && (
				<div
					className='fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden'
					onClick={() => setSidebarOpen(false)}
				/>
			)}
		</div>
	)
}

export default TeacherLayout
