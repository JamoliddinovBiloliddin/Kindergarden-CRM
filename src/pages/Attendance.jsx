import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, Heart, Save } from 'lucide-react'

const Attendance = () => {
	const [students, setStudents] = useState([])
	const [attendance, setAttendance] = useState({})
	const [selectedDate, setSelectedDate] = useState(
		new Date().toISOString().split('T')[0]
	)
	const [saved, setSaved] = useState(false)

	useEffect(() => {
		// Load students
		const storedStudents = JSON.parse(localStorage.getItem('students') || '[]')
		if (storedStudents.length === 0) {
			// Initialize with mock data if empty
			const mockStudents = [
				{ id: 1, name: 'Emma Wilson', group: 'Group A', parentPhone: '+1234567890' },
				{ id: 2, name: 'Liam Johnson', group: 'Group A', parentPhone: '+1234567891' },
				{ id: 3, name: 'Olivia Brown', group: 'Group B', parentPhone: '+1234567892' },
				{ id: 4, name: 'Noah Davis', group: 'Group B', parentPhone: '+1234567893' },
				{ id: 5, name: 'Ava Miller', group: 'Group A', parentPhone: '+1234567894' },
				{ id: 6, name: 'Ethan Garcia', group: 'Group C', parentPhone: '+1234567895' },
				{ id: 7, name: 'Sophia Martinez', group: 'Group C', parentPhone: '+1234567896' },
				{ id: 8, name: 'Mason Anderson', group: 'Group B', parentPhone: '+1234567897' }
			]
			localStorage.setItem('students', JSON.stringify(mockStudents))
			setStudents(mockStudents)
		} else {
			setStudents(storedStudents)
		}

		// Load attendance for selected date
		const attendanceData = JSON.parse(localStorage.getItem('attendance') || '{}')
		setAttendance(attendanceData[selectedDate] || {})
	}, [selectedDate])

	const updateAttendance = (studentId, status) => {
		const newAttendance = { ...attendance, [studentId]: status }
		setAttendance(newAttendance)
		setSaved(false)
	}

	const saveAttendance = () => {
		const attendanceData = JSON.parse(localStorage.getItem('attendance') || '{}')
		attendanceData[selectedDate] = attendance
		localStorage.setItem('attendance', JSON.stringify(attendanceData))
		setSaved(true)
		setTimeout(() => setSaved(false), 3000)
	}

	const getStatusIcon = (status) => {
		switch (status) {
			case 'present':
				return <CheckCircle className="w-5 h-5 text-green-500" />
			case 'absent':
				return <XCircle className="w-5 h-5 text-red-500" />
			case 'late':
				return <Clock className="w-5 h-5 text-yellow-500" />
			case 'sick':
				return <Heart className="w-5 h-5 text-pink-500" />
			default:
				return null
		}
	}

	const getStatusColor = (status) => {
		switch (status) {
			case 'present':
				return 'bg-green-50 border-green-200 text-green-700'
			case 'absent':
				return 'bg-red-50 border-red-200 text-red-700'
			case 'late':
				return 'bg-yellow-50 border-yellow-200 text-yellow-700'
			case 'sick':
				return 'bg-pink-50 border-pink-200 text-pink-700'
			default:
				return 'bg-gray-50 border-gray-200 text-gray-700'
		}
	}

	const statusButtons = [
		{ status: 'present', label: 'Present', color: 'bg-green-500 hover:bg-green-600' },
		{ status: 'absent', label: 'Absent', color: 'bg-red-500 hover:bg-red-600' },
		{ status: 'late', label: 'Late', color: 'bg-yellow-500 hover:bg-yellow-600' },
		{ status: 'sick', label: 'Sick', color: 'bg-pink-500 hover:bg-pink-600' }
	]

	return (
		<div className="space-y-6">
			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h3 className="text-xl font-bold text-gray-800 mb-2">Mark Attendance</h3>
						<input
							type="date"
							value={selectedDate}
							onChange={(e) => setSelectedDate(e.target.value)}
							className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
						/>
					</div>
					<button
						onClick={saveAttendance}
						className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-colors ${
							saved ? 'bg-green-500' : 'bg-purple-500 hover:bg-purple-600'
						}`}
					>
						<Save className="w-5 h-5" />
						{saved ? 'Saved!' : 'Save Attendance'}
					</button>
				</div>

				<div className="space-y-3">
					{students.map((student) => {
						const currentStatus = attendance[student.id] || null
						return (
							<div
								key={student.id}
								className={`p-4 rounded-lg border-2 transition-all ${
									currentStatus ? getStatusColor(currentStatus) : 'bg-white border-gray-200'
								}`}
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-4 flex-1">
										<div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
											{student.name.charAt(0)}
										</div>
										<div>
											<p className="font-semibold text-gray-800">{student.name}</p>
											<p className="text-sm text-gray-500">{student.group}</p>
										</div>
										{currentStatus && (
											<div className="flex items-center gap-2">
												{getStatusIcon(currentStatus)}
												<span className="font-medium capitalize">{currentStatus}</span>
											</div>
										)}
									</div>
									<div className="flex items-center gap-2">
										{statusButtons.map((btn) => (
											<button
												key={btn.status}
												onClick={() => updateAttendance(student.id, btn.status)}
												className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors ${
													currentStatus === btn.status
														? `${btn.color} ring-2 ring-offset-2 ring-gray-400`
														: btn.color
												}`}
											>
												{btn.label}
											</button>
										))}
									</div>
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}

export default Attendance

