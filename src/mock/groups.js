import { mockStudents } from './students'

export const mockGroups = [
	{
		id: 1,
		name: 'Group A',
		teacherId: 1,
		teacherName: 'Sarah Johnson',
		studentCount: mockStudents.filter(s => s.group === 'Group A').length,
		description: 'Morning class for ages 4-5',
	},
	{
		id: 2,
		name: 'Group B',
		teacherId: 1,
		teacherName: 'Sarah Johnson',
		studentCount: mockStudents.filter(s => s.group === 'Group B').length,
		description: 'Afternoon class for ages 4-5',
	},
	{
		id: 3,
		name: 'Group C',
		teacherId: 1,
		teacherName: 'Sarah Johnson',
		studentCount: mockStudents.filter(s => s.group === 'Group C').length,
		description: 'Full day class for ages 4-5',
	},
]

export const getGroupsByTeacher = teacherId => {
	return mockGroups.filter(group => group.teacherId === teacherId)
}

export const getGroupByName = groupName => {
	return mockGroups.find(group => group.name === groupName)
}
