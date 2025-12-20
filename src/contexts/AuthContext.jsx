import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider')
	}
	return context
}

// Mock user codes - In production, these would come from database
const USER_CODES = {
	admin: ['ADMIN001', 'ADMIN002'],
	director: ['DIR001', 'DIR002'],
	teacher: ['TEACH001', 'TEACH002'],
	parent: ['PARENT001', 'PARENT002', 'PARENT003']
}

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		// Check if user is already logged in
		const storedUser = localStorage.getItem('currentUser')
		if (storedUser) {
			try {
				const parsedUser = JSON.parse(storedUser)
				setUser(parsedUser)
			} catch (error) {
				console.error('Error parsing stored user:', error)
				localStorage.removeItem('currentUser')
			}
		}
		setLoading(false)

		// Listen for storage changes (for cross-tab sync)
		const handleStorageChange = (e) => {
			if (e.key === 'currentUser') {
				if (e.newValue) {
					try {
						setUser(JSON.parse(e.newValue))
					} catch (error) {
						console.error('Error parsing storage change:', error)
					}
				} else {
					setUser(null)
				}
			}
		}

		window.addEventListener('storage', handleStorageChange)
		return () => window.removeEventListener('storage', handleStorageChange)
	}, [])

	const login = (code, username) => {
		// Determine role based on code
		let role = null
		let userData = null
		const upperCode = code ? code.trim().toUpperCase() : ''
		const trimmedUsername = username ? username.trim() : ''

		if (!upperCode && !trimmedUsername) {
			return { success: false, error: 'Login yoki kod kiriting' }
		}

		// 1. Check Dynamic Users (Teachers, etc.) created by Admin
		try {
			const authUsers = JSON.parse(localStorage.getItem('auth_users') || '[]')
			// Check matching username AND password (we use 'code' field as password for teachers in this context, or strict password check)
			// The Login.jsx sends 'code' as the password field if it's not empty, or we might need to adjust Login.jsx to send password.
			// Currently Login.jsx treats the second input as 'code'. For teachers created by Admin, they have 'password'.
			// Let's assume the 'code' input in Login.jsx is used for Password for dynamic users.

			const foundUser = authUsers.find(u =>
				u.username === trimmedUsername &&
				u.password === upperCode // Assuming code input is used as password
			)

			if (foundUser) {
				role = foundUser.role
				userData = {
					...foundUser,
					// Ensure essential fields
					name: foundUser.name || foundUser.username,
					role: foundUser.role,
					// If teacher, include teacherId
					teacherId: foundUser.teacherId,
				}

				// If teacher, fetch latest group assignments
				if (role === 'teacher' && userData.teacherId) {
					const teachers = JSON.parse(localStorage.getItem('teachers') || '[]')
					const teacherDetails = teachers.find(t => t.id === userData.teacherId)
					if (teacherDetails) {
						userData.assignedGroups = teacherDetails.assignedGroups || []
						userData.photo = teacherDetails.photo
						userData.name = `${teacherDetails.firstName} ${teacherDetails.lastName}`
					}
				}

				// If parent, fetch latest child info
				if (role === 'parent' && userData.childId) {
					const children = JSON.parse(localStorage.getItem('children') || '[]')
					const child = children.find(c => c.id === userData.childId)
					if (child) {
						userData.childName = child.name
						userData.groupId = child.groupId // Ensure groupId is up to date
					}
				}

				localStorage.setItem('currentUser', JSON.stringify(userData))
				setUser(userData)
				return { success: true, user: userData, role }
			}
		} catch (err) {
			console.error('Error checking auth_users', err)
		}

		// 2. Fallback to Mock Codes (Legacy support)
		if (USER_CODES.admin.includes(upperCode)) {
			role = 'admin'
			userData = {
				id: 1,
				code: upperCode,
				username: username || 'admin',
				name: username || 'Admin User',
				role: 'admin',
				email: 'admin@kindergarten.com',
				phone: '+998 90 123 4567'
			}
		} else if (USER_CODES.director.includes(upperCode)) {
			role = 'director'
			userData = {
				id: 2,
				code: upperCode,
				username: username || 'director',
				name: username || 'Director User',
				role: 'director',
				email: 'director@kindergarten.com',
				phone: '+998 90 234 5678',
				branch: 'Main Branch'
			}
		} else if (USER_CODES.teacher.includes(upperCode)) {
			role = 'teacher'
			userData = {
				id: 3,
				code: upperCode,
				username: username || 'teacher',
				name: username || 'Teacher User',
				role: 'teacher',
				email: 'teacher@kindergarten.com',
				phone: '+998 90 345 6789',
				groups: ['Group A', 'Group B'] // Mock groups
			}
		} else if (USER_CODES.parent.includes(upperCode)) {
			role = 'parent'
			// Find child linked to this parent code
			let children = []
			try {
				children = JSON.parse(localStorage.getItem('children') || '[]')
			} catch (e) {
				console.error('Error parsing children:', e)
				children = []
			}
			const child = children.find(c => c.parentCode === upperCode)
			userData = {
				id: 4,
				code: upperCode,
				username: username || 'parent',
				name: username || 'Parent User',
				role: 'parent',
				email: 'parent@kindergarten.com',
				phone: '+998 90 456 7890',
				childId: child?.id || null,
				childName: child?.name || 'Child Name'
			}
		}

		if (role && userData) {
			// Save to localStorage first
			localStorage.setItem('currentUser', JSON.stringify(userData))
			// Then update state immediately
			setUser(userData)
			return { success: true, user: userData, role }
		}

		return { success: false, error: 'Noto\'g\'ri login yoki kod' }
	}

	const logout = () => {
		setUser(null)
		localStorage.removeItem('currentUser')
	}

	const value = {
		user,
		login,
		logout,
		loading,
		isAuthenticated: !!user
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

