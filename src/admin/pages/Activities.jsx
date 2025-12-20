import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, BookOpen, Calendar, Clock } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import { useTheme } from '../../contexts/ThemeContext'

const AdminActivities = () => {
  const { t } = useLanguage()
  const { darkMode, currentTheme } = useTheme()
  const [activities, setActivities] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingActivity, setEditingActivity] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    group: ''
  })

  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = () => {
    const stored = JSON.parse(localStorage.getItem('activities') || '[]')
    setActivities(stored)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let updated
    if (editingActivity) {
      // O'zgartirish
      updated = activities.map(act =>
        act.id === editingActivity.id ? { ...act, ...formData } : act
      )
    } else {
      // Yangi activity
      const newActivity = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString()
      }
      updated = [...activities, newActivity]
    }
    localStorage.setItem('activities', JSON.stringify(updated))
    setActivities(updated)
    setShowModal(false)
    setEditingActivity(null)
    setFormData({ title: '', description: '', date: '', time: '', group: '' })
  }

  // O'zgartirish buttoni funksiyasi
  const handleEdit = (activity) => {
    setEditingActivity(activity)
    setFormData({
      title: activity.title,
      description: activity.description,
      date: activity.date,
      time: activity.time,
      group: activity.group
    })
    setShowModal(true)
  }

  // O'chirish funksiyasi
  const handleDelete = (activityId) => {
    const updated = activities.filter(act => act.id !== activityId)
    localStorage.setItem('activities', JSON.stringify(updated))
    setActivities(updated)
  }

  // Text ranglarini dynamic qilish
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900'
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600'
  const textMuted = darkMode ? 'text-gray-500' : 'text-gray-500'
  const inputBg = darkMode ? 'bg-[#334155] border-[#475569] text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'
  const inputBgAlt = darkMode ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-white border-gray-300 text-gray-900'
  const themeColor = (currentTheme && currentTheme.primary) || '#2563EB'
  const themeHover = (currentTheme && currentTheme.primaryHover) || '#1D4ED8'

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className={`text-3xl font-bold ${textPrimary}`}>
          {t('modules.activities')}
        </h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowModal(true)}
          className='flex items-center gap-2 px-4 py-2 rounded-[14px] font-medium shadow-sm transition-all duration-300 text-white'
          style={{ backgroundColor: themeColor }}
          onMouseEnter={(e) => { e.target.style.backgroundColor = themeHover }}
          onMouseLeave={(e) => { e.target.style.backgroundColor = themeColor }}
        >
          <Plus className='w-5 h-5' />
          {t('common.add')}
        </motion.button>
      </div>

      {/* Activities grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {activities.map((activity) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2, transition: { duration: 0.2, ease: 'easeOut' } }}
            className={`relative rounded-2xl p-6 transition-all duration-200 ${darkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E5E7EB]'} border shadow-[0_6px_20px_rgba(0,0,0,0.05)]`}
            style={{ borderTop: darkMode ? undefined : `4px solid ${themeColor}` }}
          >
            <div className='flex items-start justify-between mb-4'>
              <BookOpen className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-blue-600'}`} />
              <span className={`text-xs transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{activity.date}</span>
            </div>
            <h3 className={`font-bold mb-2 transition-colors duration-300 ${textPrimary}`}>{activity.title}</h3>
            <p className={`text-sm mb-4 transition-colors duration-300 ${textSecondary}`}>{activity.description}</p>
            <div className={`flex items-center gap-4 text-sm transition-colors duration-300 ${textMuted}`}>
              <div className='flex items-center gap-1'>
                <Clock className='w-4 h-4' />
                {activity.time}
              </div>
              <div className='flex items-center gap-1'>
                <Calendar className='w-4 h-4' />
                {activity.group}
              </div>
            </div>
            <div className='flex gap-3 mt-4'>
              <button
                onClick={() => handleEdit(activity)}
                className='flex-1 px-3 py-2 text-white rounded-lg text-sm font-medium'
                style={{ backgroundColor: themeColor }}
                onMouseEnter={(e) => { e.target.style.backgroundColor = themeHover }}
                onMouseLeave={(e) => { e.target.style.backgroundColor = themeColor }}
              >
                O‘zgartirish
              </button>
              <button
                onClick={() => handleDelete(activity.id)}
                className='flex-1 px-3 py-2 text-white rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600'
              >
                O‘chirish
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 backdrop-blur-[12px] bg-black/20 flex items-center justify-center z-50 p-4' onClick={() => setShowModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={`relative rounded-2xl p-6 w-full max-w-md shadow-[0_6px_20px_rgba(0,0,0,0.05)] border ${darkMode ? 'bg-[#1F2937] border-[#334155]' : 'bg-white border-[#E5E7EB]'}`}
            style={{ borderTop: darkMode ? undefined : `4px solid ${themeColor}` }}
          >
            <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${textPrimary}`}>
              {editingActivity ? 'O‘zgartirish' : t('activities.addActivity')}
            </h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('activities.titleLabel')}
                </label>
                <input
                  type='text'
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('activities.description')}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  rows={3}
                  required
                />
              </div>
              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('activities.date')}
                  </label>
                  <input
                    type='date'
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${inputBgAlt} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('activities.time')}
                  </label>
                  <input
                    type='time'
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${inputBgAlt} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('activities.group')}
                </label>
                <input
                  type='text'
                  value={formData.group}
                  onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>
              <div className='flex gap-3'>
                <button
                  type='button'
                  onClick={() => { setShowModal(false); setEditingActivity(null) }}
                  className={`flex-1 px-4 py-2 border rounded-lg transition-colors duration-300 ${darkMode ? 'bg-[#1E293B] border-[#334155] text-white hover:bg-[#334155]' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  {t('common.cancel')}
                </button>
                <button
                  type='submit'
                  className='flex-1 px-4 py-2 text-white rounded-lg transition-all duration-300'
                  style={{ backgroundColor: themeColor }}
                  onMouseEnter={(e) => { e.target.style.backgroundColor = themeHover }}
                  onMouseLeave={(e) => { e.target.style.backgroundColor = themeColor }}
                >
                  {t('common.save')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminActivities
