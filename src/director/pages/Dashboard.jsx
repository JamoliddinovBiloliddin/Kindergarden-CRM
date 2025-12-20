import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Warehouse, CheckCircle } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import {
	ResponsiveContainer,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	PieChart,
	Pie,
	Cell,
	Legend
} from 'recharts'

const DirectorDashboard = () => {
	const { currentTheme, darkMode } = useTheme()
	const [stats, setStats] = useState({
		totalChildren: 0,
		totalGroups: 0,
		totalStaff: 0,
		totalRevenue: 0
	})

	const [financial, setFinancial] = useState([])
	const [branchStats, setBranchStats] = useState([])

	useEffect(() => {
		let children = [], groups = [], teachers = []
		try {
			children = JSON.parse(localStorage.getItem('children') || '[]')
			groups = JSON.parse(localStorage.getItem('groups') || '[]')
			teachers = JSON.parse(localStorage.getItem('teachers') || '[]')
		} catch (e) { console.error(e) }

		// load financial data (seed if missing)
		let fin = []
		try {
			fin = JSON.parse(localStorage.getItem('financial') || '[]')
		} catch (e) { fin = [] }
		if (!fin || fin.length === 0) {
			fin = [
				{ month: 'Yan', revenue: 1200000, expense: 450000 },
				{ month: 'Fev', revenue: 980000, expense: 360000 },
				{ month: 'Mar', revenue: 1520000, expense: 540000 },
				{ month: 'Apr', revenue: 1100000, expense: 400000 },
				{ month: 'May', revenue: 1250000, expense: 500000 }
			]
			localStorage.setItem('financial', JSON.stringify(fin))
		}
		// calculate profit
		fin = fin.map(f => ({ ...f, profit: (f.revenue || 0) - (f.expense || 0) }))
		setFinancial(fin)

		// Get current month revenue (mock logic: last month in array)
		const currentRevenue = fin.length > 0 ? fin[fin.length - 1].revenue : 0

		// branch stats
		let branches = []
		try {
			branches = JSON.parse(localStorage.getItem('branches') || '[]')
		} catch (e) { console.error(e) }
		const bstats = branches.map(b => ({ name: b.name, children: b.childrenCount || 0 }))
		setBranchStats(bstats)

		setStats({
			totalChildren: children.length,
			totalGroups: groups.length,
			totalStaff: teachers.length,
			totalRevenue: currentRevenue
		})
	}, [])

	const themeColor = (currentTheme && currentTheme.primary) || '#2563EB'

	const statCards = [
		{
			title: 'Bolalar soni',
			value: stats.totalChildren,
			icon: Users,
			iconColor: '#2563EB',
			iconBg: darkMode ? 'rgba(37, 99, 235, 0.15)' : 'rgba(37, 99, 235, 0.08)'
		},
		{
			title: 'Guruhlar soni',
			value: stats.totalGroups,
			icon: Warehouse,
			iconColor: '#F97316',
			iconBg: darkMode ? 'rgba(249, 115, 22, 0.15)' : 'rgba(249, 115, 22, 0.08)'
		},
		{
			title: 'Tushum',
			value: `${new Intl.NumberFormat('uz-UZ').format(stats.totalRevenue)} so'm`,
			icon: CheckCircle,
			iconColor: '#16A34A',
			iconBg: darkMode ? 'rgba(22, 163, 74, 0.15)' : 'rgba(22, 163, 74, 0.08)'
		},
		{
			title: 'Xodimlar soni',
			value: stats.totalStaff,
			icon: Users,
			iconColor: '#7C3AED',
			iconBg: darkMode ? 'rgba(124, 58, 237, 0.15)' : 'rgba(124, 58, 237, 0.08)'
		}
	]

	return (
		<div className='space-y-6'>
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				whileHover={{ y: -2, transition: { duration: 0.2, ease: 'easeOut' } }}
				className={`relative rounded-2xl p-6 transition-all duration-200 ${darkMode
					? 'bg-[#1E293B] border-[#334155]'
					: 'bg-white border-[#E5E7EB]'
					} border shadow-[0_6px_20px_rgba(0,0,0,0.06)]`}
				style={{
					borderTop: darkMode ? undefined : `4px solid ${themeColor}`
				}}
			>
				<h1 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'
					}`}>Direktor Panel</h1>
				<p className={`transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'
					}`}>Boshqaruv paneliga xush kelibsiz</p>
			</motion.div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				{statCards.map((stat, index) => {
					const Icon = stat.icon
					return (
						<motion.div
							key={index}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: index * 0.1 }}
							whileHover={{ y: -2, transition: { duration: 0.2, ease: 'easeOut' } }}
							className={`relative rounded-2xl p-6 transition-all duration-200 ${darkMode
								? 'bg-[#1E293B] border-[#334155]'
								: 'bg-white border-[#E5E7EB]'
								} border shadow-[0_6px_20px_rgba(0,0,0,0.06)]`}
							style={{
								borderTop: darkMode ? undefined : `4px solid ${stat.iconColor}`
							}}
						>
							<div className='flex items-center justify-between'>
								<div>
									<p className={`text-sm font-medium mb-1 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'
										}`}>
										{stat.title}
									</p>
									<p className={`text-2xl font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'
										}`}>{stat.value}</p>
								</div>
								<div className='p-3 rounded-lg' style={{ backgroundColor: stat.iconBg }}>
									<Icon className='w-6 h-6' style={{ color: stat.iconColor }} />
								</div>
							</div>
						</motion.div>
					)
				})}
			</div>

			{/* Financial section */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.2 }}
					className={`relative rounded-2xl p-6 transition-all duration-200 ${darkMode
						? 'bg-[#1E293B] border-[#334155]'
						: 'bg-white border-[#E5E7EB]'
						} border shadow-[0_6px_20px_rgba(0,0,0,0.06)]`}
				>
					<h3 className={`text-xl font-bold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'
						}`}>Moliyaviy hisobot</h3>
					<div className='w-full h-64'>
						<ResponsiveContainer width='100%' height='100%'>
							<BarChart data={financial} margin={{ top: 10, right: 20, left: -12, bottom: 0 }}>
								<XAxis dataKey='month' stroke={darkMode ? '#94A3B8' : '#374151'} />
								<YAxis stroke={darkMode ? '#94A3B8' : '#374151'} />
								<Tooltip formatter={(value) => new Intl.NumberFormat('ru-RU').format(value)} />
								<Bar dataKey='revenue' fill='#16A34A' radius={[6, 6, 0, 0]} />
								<Bar dataKey='expense' fill='#F97316' radius={[6, 6, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</div>
					<div className='mt-4 overflow-x-auto'>
						<table className='w-full text-sm'>
							<thead>
								<tr className='text-left'>
									<th className='py-2'>Oy</th>
									<th className='py-2'>Tushum</th>
									<th className='py-2'>Harajat</th>
									<th className='py-2'>Foyda</th>
								</tr>
							</thead>
							<tbody>
								{financial.map((f, i) => (
									<tr key={i} className='border-t'>
										<td className='py-2'>{f.month}</td>
										<td className='py-2'>{new Intl.NumberFormat('ru-RU').format(f.revenue)}</td>
										<td className='py-2'>{new Intl.NumberFormat('ru-RU').format(f.expense)}</td>
										<td className='py-2 font-semibold'>{new Intl.NumberFormat('ru-RU').format(f.profit)}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.3 }}
					className={`relative rounded-2xl p-6 transition-all duration-200 ${darkMode
						? 'bg-[#1E293B] border-[#334155]'
						: 'bg-white border-[#E5E7EB]'
						} border shadow-[0_6px_20px_rgba(0,0,0,0.06)]`}
				>
					<h3 className={`text-xl font-bold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'
						}`}>Filliallar statistikasi</h3>
					<div className='w-full h-56'>
						<ResponsiveContainer width='100%' height='100%'>
							<PieChart>
								<Pie data={branchStats} dataKey='children' nameKey='name' cx='50%' cy='50%' outerRadius={80} label>
									{branchStats.map((entry, idx) => (
										<Cell key={`cell-${idx}`} fill={['#2563EB', '#16A34A', '#F97316', '#7C3AED', '#F43F5E'][idx % 5]} />
									))}
								</Pie>
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</motion.div>
			</div>
		</div>
	)
}

export default DirectorDashboard
