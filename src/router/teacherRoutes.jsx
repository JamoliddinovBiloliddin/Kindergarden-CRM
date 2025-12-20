import { Navigate, Outlet } from 'react-router-dom'
import { isTeacherAuthenticated } from '../mock/teacherData'
import TeacherLayout from '../teacher/TeacherLayout'
import Dashboard from '../teacher/pages/Dashboard'
import Attendance from '../teacher/pages/Attendance'
import Reports from '../teacher/pages/Reports'
import Group from '../teacher/pages/Group'
import Profile from '../teacher/pages/Profile'

const ProtectedRoute = () => {
	return isTeacherAuthenticated() ? <Outlet /> : <Navigate to='/' replace />
}

export const teacherRoutes = [
	{
		path: '/teacher',
		element: <ProtectedRoute />,
		children: [
			{
				element: <TeacherLayout />,
				children: [
					{
						path: 'dashboard',
						element: <Dashboard />
					},
					{
						path: 'attendance',
						element: <Attendance />
					},
					{
						path: 'reports',
						element: <Reports />
					},
					{
						path: 'group',
						element: <Group />
					},
					{
						path: 'profile',
						element: <Profile />
					},
					{
						index: true,
						element: <Navigate to='/teacher/dashboard' replace />
					}
				]
			}
		]
	}
]

