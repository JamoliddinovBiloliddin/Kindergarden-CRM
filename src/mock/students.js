export const mockStudents = [
	{
		id: 1,
		name: 'Emma Wilson',
		group: 'Group A',
		parentName: 'John & Mary Wilson',
		parentPhone: '+1 (555) 111-2222',
		parentEmail: 'wilson.family@email.com',
		allergies: 'Peanuts, Dairy',
		avatar: null,
		age: 4
	},
	{
		id: 2,
		name: 'Liam Johnson',
		group: 'Group A',
		parentName: 'Michael Johnson',
		parentPhone: '+1 (555) 111-3333',
		parentEmail: 'm.johnson@email.com',
		allergies: null,
		avatar: null,
		age: 5
	},
	{
		id: 3,
		name: 'Olivia Brown',
		group: 'Group B',
		parentName: 'David & Lisa Brown',
		parentPhone: '+1 (555) 111-4444',
		parentEmail: 'brown.family@email.com',
		allergies: 'Eggs',
		avatar: null,
		age: 4
	},
	{
		id: 4,
		name: 'Noah Davis',
		group: 'Group B',
		parentName: 'Robert Davis',
		parentPhone: '+1 (555) 111-5555',
		parentEmail: 'r.davis@email.com',
		allergies: null,
		avatar: null,
		age: 5
	},
	{
		id: 5,
		name: 'Ava Miller',
		group: 'Group A',
		parentName: 'Jennifer Miller',
		parentPhone: '+1 (555) 111-6666',
		parentEmail: 'j.miller@email.com',
		allergies: 'Gluten',
		avatar: null,
		age: 4
	},
	{
		id: 6,
		name: 'Ethan Garcia',
		group: 'Group C',
		parentName: 'Carlos & Maria Garcia',
		parentPhone: '+1 (555) 111-7777',
		parentEmail: 'garcia.family@email.com',
		allergies: null,
		avatar: null,
		age: 5
	},
	{
		id: 7,
		name: 'Sophia Martinez',
		group: 'Group C',
		parentName: 'James Martinez',
		parentPhone: '+1 (555) 111-8888',
		parentEmail: 'j.martinez@email.com',
		allergies: 'Shellfish',
		avatar: null,
		age: 4
	},
	{
		id: 8,
		name: 'Mason Anderson',
		group: 'Group B',
		parentName: 'Patricia Anderson',
		parentPhone: '+1 (555) 111-9999',
		parentEmail: 'p.anderson@email.com',
		allergies: null,
		avatar: null,
		age: 5
	},
	{
		id: 9,
		name: 'Isabella Taylor',
		group: 'Group A',
		parentName: 'William Taylor',
		parentPhone: '+1 (555) 222-1111',
		parentEmail: 'w.taylor@email.com',
		allergies: 'Nuts',
		avatar: null,
		age: 4
	},
	{
		id: 10,
		name: 'Lucas Thomas',
		group: 'Group C',
		parentName: 'Elizabeth Thomas',
		parentPhone: '+1 (555) 222-2222',
		parentEmail: 'e.thomas@email.com',
		allergies: null,
		avatar: null,
		age: 5
	},
	{
		id: 11,
		name: 'Mia Jackson',
		group: 'Group B',
		parentName: 'Christopher Jackson',
		parentPhone: '+1 (555) 222-3333',
		parentEmail: 'c.jackson@email.com',
		allergies: 'Dairy',
		avatar: null,
		age: 4
	},
	{
		id: 12,
		name: 'Henry White',
		group: 'Group A',
		parentName: 'Amanda White',
		parentPhone: '+1 (555) 222-4444',
		parentEmail: 'a.white@email.com',
		allergies: null,
		avatar: null,
		age: 5
	}
]

export const getStudentsByGroup = (groupName) => {
	return mockStudents.filter(student => student.group === groupName)
}

export const getAllStudents = () => {
	return mockStudents
}

export const getStudentById = (id) => {
	return mockStudents.find(student => student.id === id)
}

