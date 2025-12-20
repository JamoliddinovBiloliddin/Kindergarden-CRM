import { useState, useEffect } from 'react'
import { Users, UserX, ClipboardList, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
	const [stats, setStats] = useState({
		todayStudents: 0,
		absent: 0,
		present: 0,
		tasks: 0
	})

	const [todayStudents, setTodayStudents] = useState([])
	const [tasks, setTasks] = useState([])
	const [weekCalendar, setWeekCalendar] = useState([])

	useEffect(() => {
		// Load attendance data
		const today = new Date().toISOString().split('T')[0]
		const attendanceData = JSON.parse(localStorage.getItem('attendance') || '{}')
		const todayAttendance = attendanceData[today] || {}

		// Load students
		const students = JSON.parse(localStorage.getItem('students') || '[]')
		setTodayStudents(students.slice(0, 5))

		// Calculate stats
		const presentCount = Object.values(todayAttendance).filter(
			(status) => status === 'present'
		).length
		const absentCount = Object.values(todayAttendance).filter(
			(status) => status === 'absent'
		).length

		setStats({
			todayStudents: students.length,
			absent: absentCount,
			present: presentCount,
			tasks: 3
		})

		// Mock tasks
		setTasks([
			{ id: 1, title: 'Prepare art materials for tomorrow', completed: false },
			{ id: 2, title: 'Review parent feedback', completed: false },
			{ id: 3, title: 'Update student progress reports', completed: true }
		])

		// Generate week calendar
		const week = []
		for (let i = 0; i < 7; i++) {
			const date = new Date()
			date.setDate(date.getDate() + i)
			week.push({
				day: date.toLocaleDateString('en-US', { weekday: 'short' }),
				date: date.getDate(),
				isToday: i === 0
			})
		}
		setWeekCalendar(week)
	}, [])

	const statCards = [
		{
			title: "Today's Students",
			value: stats.todayStudents,
			icon: Users,
			color: 'bg-blue-500',
			bgColor: 'bg-blue-50',
			textColor: 'text-blue-700'
		},
		{
			title: 'Present',
			value: stats.present,
			icon: Users,
			color: 'bg-green-500',
			bgColor: 'bg-green-50',
			textColor: 'text-green-700'
		},
		{
			title: 'Absent',
			value: stats.absent,
			icon: UserX,
			color: 'bg-red-500',
			bgColor: 'bg-red-50',
			textColor: 'text-red-700'
		},
		{
			title: 'Tasks',
			value: stats.tasks,
			icon: ClipboardList,
			color: 'bg-purple-500',
			bgColor: 'bg-purple-50',
			textColor: 'text-purple-700'
		}
	]

	return (
		<div className="space-y-6">
			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{statCards.map((stat, index) => {
					const Icon = stat.icon
					return (
						<div
							key={index}
							className={`${stat.bgColor} rounded-xl p-6 shadow-sm border border-gray-100`}
						>
							<div className="flex items-center justify-between">
								<div>
									<p className={`text-sm font-medium ${stat.textColor} mb-1`}>
										{stat.title}
									</p>
									<p className={`text-3xl font-bold ${stat.textColor}`}>
										{stat.value}
									</p>
								</div>
								<div className={`${stat.color} p-3 rounded-lg`}>
									<Icon className="w-6 h-6 text-white" />
								</div>
							</div>
						</div>
					)
				})}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Today's Students */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-xl font-bold text-gray-800">Today's Students</h3>
						<Link
							to="/attendance"
							className="text-sm text-purple-600 hover:text-purple-800 font-medium"
						>
							View All →
						</Link>
					</div>
					<div className="space-y-3">
						{todayStudents.length > 0 ? (
							todayStudents.map((student) => (
								<div
									key={student.id}
									className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
								>
									<div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-semibold">
										{student.name.charAt(0)}
									</div>
									<div className="flex-1">
										<p className="font-medium text-gray-800">{student.name}</p>
										<p className="text-sm text-gray-500">{student.group}</p>
									</div>
								</div>
							))
						) : (
							<p className="text-gray-500 text-center py-4">No students today</p>
						)}
					</div>
				</div>

				{/* Tasks */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-xl font-bold text-gray-800">Tasks</h3>
						<ClipboardList className="w-5 h-5 text-gray-400" />
					</div>
					<div className="space-y-3">
						{tasks.map((task) => (
							<div
								key={task.id}
								className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
							>
								<input
									type="checkbox"
									checked={task.completed}
									onChange={() => {
										setTasks(
											tasks.map((t) =>
												t.id === task.id ? { ...t, completed: !t.completed } : t
											)
										)
									}}
									className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
								/>
								<span
									className={`flex-1 ${
										task.completed ? 'line-through text-gray-400' : 'text-gray-800'
									}`}
								>
									{task.title}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Weekly Calendar */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-xl font-bold text-gray-800">Weekly Calendar</h3>
					<Calendar className="w-5 h-5 text-gray-400" />
				</div>
				<div className="grid grid-cols-7 gap-2">
					{weekCalendar.map((day, index) => (
						<div
							key={index}
							className={`p-4 rounded-lg text-center ${
								day.isToday
									? 'bg-purple-500 text-white'
									: 'bg-gray-50 text-gray-700'
							}`}
						>
							<p className="text-sm font-medium mb-1">{day.day}</p>
							<p className="text-2xl font-bold">{day.date}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default Dashboard

