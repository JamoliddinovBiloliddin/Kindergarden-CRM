import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'
import Login from './pages/Login'

// Admin
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/pages/Dashboard'
import AdminMeals from './admin/pages/Meals'
import AdminVaccination from './admin/pages/Vaccination'
import AdminActivities from './admin/pages/Activities'
import AdminChildren from './admin/pages/Children'
import AdminTeachers from './admin/pages/Teachers'
import AdminGroups from './admin/pages/Groups'
import AdminComplaints from './admin/pages/Complaints'
import AdminSettings from './admin/pages/Settings'

// Director
import DirectorLayout from './director/DirectorLayout'
import DirectorDashboard from './director/pages/Dashboard'
import DirectorFilial from './director/pages/Filial'
import DirectorStorage from './director/pages/Storage'
import DirectorMeals from './director/pages/Meals'
import DirectorVaccination from './director/pages/Vaccination'
import DirectorActivities from './director/pages/Activities'
import DirectorChildren from './director/pages/Children'
import DirectorComplaints from './director/pages/Complaints'
import DirectorSettings from './director/pages/Settings'

// Teacher
import TeacherLayout from './teacher/TeacherLayout'
import TeacherDashboard from './teacher/pages/Dashboard'
import TeacherAttendance from './teacher/pages/Attendance'
import TeacherReports from './teacher/pages/Reports'
import TeacherGroup from './teacher/pages/Group'
import TeacherProfile from './teacher/pages/Profile'
import TeacherMeals from './teacher/pages/Meals'
import TeacherSleep from './teacher/pages/Sleep'
import TeacherHomework from './teacher/pages/Homework'
import TeacherSettings from './teacher/pages/Settings'

// Parent
import ParentLayout from './parent/ParentLayout'
import ParentDashboard from './parent/pages/Dashboard'
import ParentChild from './parent/pages/Child'
import ParentMeals from './parent/pages/Meals'
import ParentVaccination from './parent/pages/Vaccination'
import ParentActivities from './parent/pages/Activities'
import ParentSleep from './parent/pages/Sleep'
import ParentHomework from './parent/pages/Homework'
import ParentQRCode from './parent/pages/QRCode'
import ParentComplaints from './parent/pages/Complaints'
import ParentSettings from './parent/pages/Settings'

import { useAuth } from './contexts/AuthContext'

const ProtectedRoute = ({ children, allowedRoles }) => {
	const { isAuthenticated, user, loading } = useAuth()

	// Check localStorage as fallback if state hasn't updated yet
	let storedUser = null
	try {
		const stored = localStorage.getItem('currentUser')
		if (stored) {
			storedUser = JSON.parse(stored)
		}
	} catch (error) {
		console.error('Error parsing stored user:', error)
		localStorage.removeItem('currentUser')
	}

	const currentUser = user || storedUser
	const authenticated = isAuthenticated || !!currentUser

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0F172A]">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
					<p className="text-gray-600 dark:text-gray-400">Yuklanmoqda...</p>
				</div>
			</div>
		)
	}

	if (!authenticated) {
		return <Navigate to='/' replace />
	}

	if (allowedRoles && currentUser && !allowedRoles.includes(currentUser.role)) {
		return <Navigate to={`/${currentUser.role}/dashboard`} replace />
	}

	return children
}

function AppRoutes() {
	return (
		<Routes>
			<Route path='/' element={<Login />} />

			{/* Admin Routes */}
			<Route
				path='/admin'
				element={
					<ProtectedRoute allowedRoles={['admin']}>
						<AdminLayout />
					</ProtectedRoute>
				}
			>
				<Route index element={<Navigate to='/admin/dashboard' replace />} />
				<Route path='dashboard' element={<AdminDashboard />} />
				<Route path='children' element={<AdminChildren />} />
				<Route path='teachers' element={<AdminTeachers />} />
				<Route path='groups' element={<AdminGroups />} />
				<Route path='filial' element={<DirectorFilial />} />
				<Route path='meals' element={<AdminMeals />} />
				<Route path='vaccination' element={<AdminVaccination />} />
				<Route path='activities' element={<AdminActivities />} />
				<Route path='complaints' element={<AdminComplaints />} />
				<Route path='settings' element={<AdminSettings />} />
			</Route>

			{/* Director Routes */}
			<Route
				path='/director'
				element={
					<ProtectedRoute allowedRoles={['director']}>
						<DirectorLayout />
					</ProtectedRoute>
				}
			>
				<Route index element={<Navigate to='/director/dashboard' replace />} />
				<Route path='dashboard' element={<DirectorDashboard />} />
				<Route path='filial' element={<DirectorFilial />} />
				<Route path='children' element={<DirectorChildren />} />
				<Route path='meals' element={<DirectorMeals />} />
				<Route path='vaccination' element={<DirectorVaccination />} />
				<Route path='activities' element={<DirectorActivities />} />
				<Route path='storage' element={<DirectorStorage />} />
				<Route path='complaints' element={<DirectorComplaints />} />
				<Route path='settings' element={<DirectorSettings />} />
			</Route>

			{/* Teacher Routes */}
			<Route
				path='/teacher'
				element={
					<ProtectedRoute allowedRoles={['teacher']}>
						<TeacherLayout />
					</ProtectedRoute>
				}
			>
				<Route index element={<Navigate to='/teacher/dashboard' replace />} />
				<Route path='dashboard' element={<TeacherDashboard />} />
				<Route path='group' element={<TeacherGroup />} />
				<Route path='meals' element={<TeacherMeals />} />
				<Route path='sleep' element={<TeacherSleep />} />
				<Route path='homework' element={<TeacherHomework />} />
				<Route path='attendance' element={<TeacherAttendance />} />
				<Route path='reports' element={<TeacherReports />} />
				<Route path='profile' element={<TeacherProfile />} />
				<Route path='settings' element={<TeacherSettings />} />
			</Route>

			{/* Parent Routes */}
			<Route
				path='/parent'
				element={
					<ProtectedRoute allowedRoles={['parent']}>
						<ParentLayout />
					</ProtectedRoute>
				}
			>
				<Route index element={<Navigate to='/parent/dashboard' replace />} />
				<Route path='dashboard' element={<ParentDashboard />} />
				<Route path='child' element={<ParentChild />} />
				<Route path='meals' element={<ParentMeals />} />
				<Route path='vaccination' element={<ParentVaccination />} />
				<Route path='activities' element={<ParentActivities />} />
				<Route path='sleep' element={<ParentSleep />} />
				<Route path='homework' element={<ParentHomework />} />
				<Route path='qr' element={<ParentQRCode />} />
				<Route path='complaints' element={<ParentComplaints />} />
				<Route path='settings' element={<ParentSettings />} />
			</Route>

			<Route path='*' element={<Navigate to='/' replace />} />
		</Routes>
	)
}

function App() {
	return (
		<AuthProvider>
			<ThemeProvider>
				<LanguageProvider>
					<BrowserRouter>
						<AppRoutes />
					</BrowserRouter>
				</LanguageProvider>
			</ThemeProvider>
		</AuthProvider>
	)
}

export default App
