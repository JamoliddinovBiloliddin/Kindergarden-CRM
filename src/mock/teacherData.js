export const teacherData = {
	id: 1,
	name: 'Sarah Johnson',
	email: 'sarah.johnson@kindergarten.com',
	phone: '+1 (555) 123-4567',
	role: 'Lead Teacher',
	joinedDate: '2020-01-15',
	avatar: null,
	password: 'teacher123' // Mock password for login
}

export const mockLogin = (email, password) => {
	if (
		email === teacherData.email &&
		password === teacherData.password
	) {
		localStorage.setItem('isTeacherLoggedIn', 'true')
		localStorage.setItem('teacher', JSON.stringify(teacherData))
		return { success: true, teacher: teacherData }
	}
	return { success: false, error: 'Invalid credentials' }
}

export const mockLogout = () => {
	localStorage.removeItem('isTeacherLoggedIn')
	localStorage.removeItem('teacher')
}

export const isTeacherAuthenticated = () => {
	return localStorage.getItem('isTeacherLoggedIn') === 'true'
}

