import { useState, useEffect } from 'react'
import { Users, Phone, AlertCircle, ChevronRight } from 'lucide-react'

const Groups = () => {
	const [groups, setGroups] = useState([])
	const [selectedGroup, setSelectedGroup] = useState(null)
	const [students, setStudents] = useState([])

	useEffect(() => {
		// Load students
		const storedStudents = JSON.parse(localStorage.getItem('students') || '[]')
		if (storedStudents.length === 0) {
			// Initialize with mock data
			const mockStudents = [
				{
					id: 1,
					name: 'Emma Wilson',
					group: 'Group A',
					parentPhone: '+1234567890',
					allergies: 'Peanuts'
				},
				{
					id: 2,
					name: 'Liam Johnson',
					group: 'Group A',
					parentPhone: '+1234567891',
					allergies: null
				},
				{
					id: 3,
					name: 'Olivia Brown',
					group: 'Group B',
					parentPhone: '+1234567892',
					allergies: 'Dairy'
				},
				{
					id: 4,
					name: 'Noah Davis',
					group: 'Group B',
					parentPhone: '+1234567893',
					allergies: null
				},
				{
					id: 5,
					name: 'Ava Miller',
					group: 'Group A',
					parentPhone: '+1234567894',
					allergies: 'Eggs'
				},
				{
					id: 6,
					name: 'Ethan Garcia',
					group: 'Group C',
					parentPhone: '+1234567895',
					allergies: null
				},
				{
					id: 7,
					name: 'Sophia Martinez',
					group: 'Group C',
					parentPhone: '+1234567896',
					allergies: 'Gluten'
				},
				{
					id: 8,
					name: 'Mason Anderson',
					group: 'Group B',
					parentPhone: '+1234567897',
					allergies: null
				}
			]
			localStorage.setItem('students', JSON.stringify(mockStudents))
			setStudents(mockStudents)
		} else {
			setStudents(storedStudents)
		}

		// Group students by group
		const grouped = {}
		const allStudents = JSON.parse(localStorage.getItem('students') || '[]')
		allStudents.forEach((student) => {
			if (!grouped[student.group]) {
				grouped[student.group] = []
			}
			grouped[student.group].push(student)
		})

		const groupsList = Object.keys(grouped).map((groupName) => ({
			name: groupName,
			students: grouped[groupName],
			count: grouped[groupName].length
		}))

		setGroups(groupsList)
	}, [])

	const handleGroupClick = (group) => {
		setSelectedGroup(group)
	}

	const handleBack = () => {
		setSelectedGroup(null)
	}

	if (selectedGroup) {
		return (
			<div className="space-y-6">
				<button
					onClick={handleBack}
					className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium mb-4"
				>
					← Back to Groups
				</button>

				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
					<div className="flex items-center gap-3 mb-6">
						<div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
							<Users className="w-6 h-6 text-white" />
						</div>
						<div>
							<h2 className="text-2xl font-bold text-gray-800">{selectedGroup.name}</h2>
							<p className="text-gray-500">{selectedGroup.count} students</p>
						</div>
					</div>

					<div className="space-y-4">
						{selectedGroup.students.map((student) => (
							<div
								key={student.id}
								className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
							>
								<div className="flex items-start justify-between">
									<div className="flex items-center gap-4 flex-1">
										<div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
											{student.name.charAt(0)}
										</div>
										<div className="flex-1">
											<p className="font-semibold text-gray-800 text-lg">{student.name}</p>
											<div className="flex items-center gap-4 mt-2">
												<div className="flex items-center gap-2 text-gray-600">
													<Phone className="w-4 h-4" />
													<span className="text-sm">{student.parentPhone || 'N/A'}</span>
												</div>
											</div>
											{student.allergies && (
												<div className="flex items-center gap-2 mt-2 text-red-600">
													<AlertCircle className="w-4 h-4" />
													<span className="text-sm font-medium">
														Allergy: {student.allergies}
													</span>
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold text-gray-800 mb-2">My Groups</h2>
				<p className="text-gray-500">Manage your student groups and view details</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{groups.map((group) => (
					<div
						key={group.name}
						onClick={() => handleGroupClick(group)}
						className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition-all hover:border-purple-300"
					>
						<div className="flex items-center justify-between mb-4">
							<div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
								<Users className="w-6 h-6 text-white" />
							</div>
							<ChevronRight className="w-5 h-5 text-gray-400" />
						</div>
						<h3 className="text-xl font-bold text-gray-800 mb-2">{group.name}</h3>
						<p className="text-gray-500">{group.count} students</p>
					</div>
				))}
			</div>

			{groups.length === 0 && (
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
					<Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
					<p className="text-gray-500 text-lg">No groups found</p>
				</div>
			)}
		</div>
	)
}

export default Groups

