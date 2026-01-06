import { useState, useEffect } from 'react'
import { FileText, Plus, Calendar, Image as ImageIcon, X } from 'lucide-react'

const Reports = () => {
	const [showForm, setShowForm] = useState(false)
	const [reports, setReports] = useState([])
	const [formData, setFormData] = useState({
		date: new Date().toISOString().split('T')[0],
		notes: '',
		eating: 'good',
		sleep: 'good',
		image: null
	})

	useEffect(() => {
		// Load reports
		const storedReports = JSON.parse(localStorage.getItem('reports') || '[]')
		setReports(storedReports.sort((a, b) => new Date(b.date) - new Date(a.date)))
	}, [])

	const handleImageChange = (e) => {
		const file = e.target.files[0]
		if (file) {
			const reader = new FileReader()
			reader.onloadend = () => {
				setFormData({ ...formData, image: reader.result })
			}
			reader.readAsDataURL(file)
		}
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		const newReport = {
			id: Date.now(),
			...formData,
			createdAt: new Date().toISOString()
		}
		const updatedReports = [newReport, ...reports]
		localStorage.setItem('reports', JSON.stringify(updatedReports))
		setReports(updatedReports)
		setFormData({
			date: new Date().toISOString().split('T')[0],
			notes: '',
			eating: 'good',
			sleep: 'good',
			image: null
		})
		setShowForm(false)
	}

	const deleteReport = (id) => {
		if (confirm('Are you sure you want to delete this report?')) {
			const updatedReports = reports.filter((r) => r.id !== id)
			localStorage.setItem('reports', JSON.stringify(updatedReports))
			setReports(updatedReports)
		}
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h3 className="text-2xl font-bold text-gray-800">Daily Reports</h3>
				<button
					onClick={() => setShowForm(!showForm)}
					className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
				>
					<Plus className="w-5 h-5" />
					Create Report
				</button>
			</div>

			{showForm && (
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Date
							</label>
							<input
								type="date"
								value={formData.date}
								onChange={(e) => setFormData({ ...formData, date: e.target.value })}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Notes
							</label>
							<textarea
								value={formData.notes}
								onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
								rows={4}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
								placeholder="Write daily notes about activities, behavior, or important events..."
								required
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Eating
								</label>
								<select
									value={formData.eating}
									onChange={(e) => setFormData({ ...formData, eating: e.target.value })}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
								>
									<option value="good">Good</option>
									<option value="average">Average</option>
									<option value="poor">Poor</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Sleep
								</label>
								<select
									value={formData.sleep}
									onChange={(e) => setFormData({ ...formData, sleep: e.target.value })}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
								>
									<option value="good">Good</option>
									<option value="average">Average</option>
									<option value="poor">Poor</option>
								</select>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Image (Optional)
							</label>
							<div className="flex items-center gap-4">
								<label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
									<ImageIcon className="w-5 h-5 text-gray-600" />
									<span className="text-sm text-gray-700">Choose Image</span>
									<input
										type="file"
										accept="image/*"
										onChange={handleImageChange}
										className="hidden"
									/>
								</label>
								{formData.image && (
									<div className="relative">
										<img
											src={formData.image}
											alt="Preview"
											className="w-20 h-20 object-cover rounded-lg"
										/>
										<button
											type="button"
											onClick={() => setFormData({ ...formData, image: null })}
											className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
										>
											<X className="w-4 h-4" />
										</button>
									</div>
								)}
							</div>
						</div>

						<div className="flex gap-3">
							<button
								type="submit"
								className="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
							>
								Save Report
							</button>
							<button
								type="button"
								onClick={() => {
									setShowForm(false)
									setFormData({
										date: new Date().toISOString().split('T')[0],
										notes: '',
										eating: 'good',
										sleep: 'good',
										image: null
									})
								}}
								className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			)}

			<div className="space-y-4">
				{reports.length > 0 ? (
					reports.map((report) => (
						<div
							key={report.id}
							className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
						>
							<div className="flex items-start justify-between mb-4">
								<div className="flex items-center gap-3">
									<Calendar className="w-5 h-5 text-purple-500" />
									<div>
										<p className="font-semibold text-gray-800">
											{new Date(report.date).toLocaleDateString('en-US', {
												weekday: 'long',
												year: 'numeric',
												month: 'long',
												day: 'numeric'
											})}
										</p>
										<p className="text-sm text-gray-500">
											Created:{' '}
											{new Date(report.createdAt).toLocaleString('en-US', {
												month: 'short',
												day: 'numeric',
												hour: '2-digit',
												minute: '2-digit'
											})}
										</p>
									</div>
								</div>
								<button
									onClick={() => deleteReport(report.id)}
									className="text-red-500 hover:text-red-700 transition-colors"
								>
									<X className="w-5 h-5" />
								</button>
							</div>

							<p className="text-gray-700 mb-4 whitespace-pre-wrap">{report.notes}</p>

							<div className="flex items-center gap-6 mb-4">
								<div>
									<span className="text-sm text-gray-500">Eating: </span>
									<span
										className={`font-medium ${
											report.eating === 'good'
												? 'text-green-600'
												: report.eating === 'average'
													? 'text-yellow-600'
													: 'text-red-600'
										}`}
									>
										{report.eating.charAt(0).toUpperCase() + report.eating.slice(1)}
									</span>
								</div>
								<div>
									<span className="text-sm text-gray-500">Sleep: </span>
									<span
										className={`font-medium ${
											report.sleep === 'good'
												? 'text-green-600'
												: report.sleep === 'average'
													? 'text-yellow-600'
													: 'text-red-600'
										}`}
									>
										{report.sleep.charAt(0).toUpperCase() + report.sleep.slice(1)}
									</span>
								</div>
							</div>

							{report.image && (
								<div className="mt-4">
									<img
										src={report.image}
										alt="Report"
										className="w-full max-w-md rounded-lg object-cover"
									/>
								</div>
							)}
						</div>
					))
				) : (
					<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
						<FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
						<p className="text-gray-500 text-lg">No reports yet</p>
						<p className="text-gray-400 text-sm mt-2">
							Create your first daily report to get started
						</p>
					</div>
				)}
			</div>
		</div>
	)
}

export default Reports

