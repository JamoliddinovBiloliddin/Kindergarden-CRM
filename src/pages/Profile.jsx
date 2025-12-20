import { useState, useEffect } from 'react'
import { User, Mail, Phone, Lock, Save, Edit2 } from 'lucide-react'

const Profile = () => {
	const [teacher, setTeacher] = useState({
		name: 'Sarah Johnson',
		email: 'sarah.johnson@kindergarten.com',
		phone: '+1234567890',
		position: 'Lead Teacher',
		experience: '5 years'
	})
	const [editingPhone, setEditingPhone] = useState(false)
	const [phoneValue, setPhoneValue] = useState('')
	const [passwordForm, setPasswordForm] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: ''
	})
	const [passwordSaved, setPasswordSaved] = useState(false)

	useEffect(() => {
		const stored = localStorage.getItem('teacher')
		if (stored) {
			const parsed = JSON.parse(stored)
			setTeacher(parsed)
			setPhoneValue(parsed.phone || '')
		} else {
			setPhoneValue(teacher.phone)
		}
	}, [])

	const handleSavePhone = () => {
		const updated = { ...teacher, phone: phoneValue }
		setTeacher(updated)
		localStorage.setItem('teacher', JSON.stringify(updated))
		setEditingPhone(false)
	}

	const handlePasswordChange = (e) => {
		e.preventDefault()
		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			alert('New passwords do not match!')
			return
		}
		if (passwordForm.newPassword.length < 6) {
			alert('Password must be at least 6 characters!')
			return
		}
		// Mock password change
		setPasswordSaved(true)
		setPasswordForm({
			currentPassword: '',
			newPassword: '',
			confirmPassword: ''
		})
		setTimeout(() => setPasswordSaved(false), 3000)
	}

	return (
		<div className="space-y-6 max-w-4xl">
			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
				<div className="flex items-center gap-6 mb-6">
					<div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-3xl">
						{teacher.name.charAt(0)}
					</div>
					<div>
						<h2 className="text-2xl font-bold text-gray-800">{teacher.name}</h2>
						<p className="text-gray-500">{teacher.position}</p>
						<p className="text-sm text-gray-400 mt-1">{teacher.experience} of experience</p>
					</div>
				</div>

				<div className="space-y-4">
					<div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
						<Mail className="w-5 h-5 text-purple-500" />
						<div className="flex-1">
							<p className="text-sm text-gray-500">Email</p>
							<p className="font-medium text-gray-800">{teacher.email}</p>
						</div>
					</div>

					<div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
						<Phone className="w-5 h-5 text-purple-500" />
						<div className="flex-1">
							<p className="text-sm text-gray-500">Phone Number</p>
							{editingPhone ? (
								<div className="flex items-center gap-2 mt-1">
									<input
										type="tel"
										value={phoneValue}
										onChange={(e) => setPhoneValue(e.target.value)}
										className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
										placeholder="+1234567890"
									/>
									<button
										onClick={handleSavePhone}
										className="px-4 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
									>
										<Save className="w-4 h-4" />
									</button>
									<button
										onClick={() => {
											setEditingPhone(false)
											setPhoneValue(teacher.phone)
										}}
										className="px-4 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
									>
										Cancel
									</button>
								</div>
							) : (
								<div className="flex items-center gap-2 mt-1">
									<p className="font-medium text-gray-800">
										{teacher.phone || 'Not set'}
									</p>
									<button
										onClick={() => setEditingPhone(true)}
										className="text-purple-600 hover:text-purple-800 transition-colors"
									>
										<Edit2 className="w-4 h-4" />
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
				<div className="flex items-center gap-3 mb-6">
					<Lock className="w-5 h-5 text-purple-500" />
					<h3 className="text-xl font-bold text-gray-800">Change Password</h3>
				</div>

				<form onSubmit={handlePasswordChange} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Current Password
						</label>
						<input
							type="password"
							value={passwordForm.currentPassword}
							onChange={(e) =>
								setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
							}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
							placeholder="Enter current password"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							New Password
						</label>
						<input
							type="password"
							value={passwordForm.newPassword}
							onChange={(e) =>
								setPasswordForm({ ...passwordForm, newPassword: e.target.value })
							}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
							placeholder="Enter new password (min. 6 characters)"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Confirm New Password
						</label>
						<input
							type="password"
							value={passwordForm.confirmPassword}
							onChange={(e) =>
								setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
							}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
							placeholder="Confirm new password"
							required
						/>
					</div>

					<button
						type="submit"
						className={`w-full px-6 py-3 rounded-lg text-white font-medium transition-colors ${
							passwordSaved
								? 'bg-green-500'
								: 'bg-purple-500 hover:bg-purple-600'
						}`}
					>
						{passwordSaved ? 'Password Changed Successfully!' : 'Change Password'}
					</button>
				</form>
			</div>
		</div>
	)
}

export default Profile

