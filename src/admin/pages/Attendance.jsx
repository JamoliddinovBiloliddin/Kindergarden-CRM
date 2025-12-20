import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle } from 'lucide-react'
import { FiEdit, FiTrash2 } from 'react-icons/fi'
import { useLanguage } from '../../contexts/LanguageContext'
import { useTheme } from '../../contexts/ThemeContext'

const AdminAttendance = () => {
  const { t } = useLanguage()
  const { darkMode, currentTheme } = useTheme()
  const [attendance, setAttendance] = useState({})
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [children, setChildren] = useState(() => JSON.parse(localStorage.getItem('children') || '[]'))
  const [showModal, setShowModal] = useState(false)
  const [editingChild, setEditingChild] = useState(null)
  const [formData, setFormData] = useState({ name: '', group: '' })

  useEffect(() => {
    loadAttendance()
  }, [selectedDate])

  const loadAttendance = () => {
    const stored = JSON.parse(localStorage.getItem('attendance') || '{}')
    setAttendance(stored[selectedDate] || {})
  }

  const markAttendance = (childId, status) => {
    const stored = JSON.parse(localStorage.getItem('attendance') || '{}')
    if (!stored[selectedDate]) stored[selectedDate] = {}
    stored[selectedDate][childId] = status
    localStorage.setItem('attendance', JSON.stringify(stored))
    setAttendance(stored[selectedDate])
  }

  const handleDelete = (childId) => {
    // alert chiqmaydi, faqat o'chadi
    const updatedChildren = children.filter(c => c.id !== childId)
    setChildren(updatedChildren)
    localStorage.setItem('children', JSON.stringify(updatedChildren))

    const storedAttendance = JSON.parse(localStorage.getItem('attendance') || '{}')
    if (storedAttendance[selectedDate]) delete storedAttendance[selectedDate][childId]
    localStorage.setItem('attendance', JSON.stringify(storedAttendance))
    setAttendance(storedAttendance[selectedDate] || {})
  }

  const handleEdit = (child) => {
    setEditingChild(child)
    setFormData({ name: child.name, group: child.group })
    setShowModal(true)
  }

  const handleAdd = () => {
    setEditingChild(null)
    setFormData({ name: '', group: '' })
    setShowModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingChild) {
      // O'zgartirish
      const updatedChildren = children.map(c => c.id === editingChild.id ? { ...c, ...formData } : c)
      setChildren(updatedChildren)
      localStorage.setItem('children', JSON.stringify(updatedChildren))
    } else {
      // Qo'shish
      const newChild = { id: Date.now(), ...formData }
      const updatedChildren = [...children, newChild]
      setChildren(updatedChildren)
      localStorage.setItem('children', JSON.stringify(updatedChildren))
    }
    setShowModal(false)
  }

  const textPrimary = darkMode ? 'text-white' : 'text-gray-900'
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600'
  const inputBg = darkMode ? 'bg-[#334155] border-[#475569] text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'
  const themeColor = (currentTheme && currentTheme.primary) || '#2563EB'

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className={`text-3xl font-bold transition-colors duration-300 ${textPrimary}`}>
          {t('modules.attendance')}
        </h1>
        <div className='flex gap-2'>
          <input
            type='date'
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={`px-4 py-2 border rounded-lg transition-colors duration-300 ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <button
            onClick={handleAdd}
            className='px-4 py-2 text-white rounded-lg font-medium'
            style={{ backgroundColor: themeColor }}
          >
            {t('common.add')}
          </button>
        </div>
      </div>

      {/* Attendance grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {children.map((child) => {
          const status = attendance[child.id] || 'absent'

          return (
            <motion.div
              key={child.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2, transition: { duration: 0.2, ease: 'easeOut' } }}
              className={`relative rounded-2xl p-6 transition-all duration-200 ${darkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E5E7EB]'} border shadow-[0_6px_20px_rgba(0,0,0,0.05)]`}
              style={{ borderTop: darkMode ? undefined : `4px solid ${themeColor}` }}
            >

              <div className='flex items-center justify-between mb-4'>
                <h3 className={`font-bold transition-colors duration-300 ${textPrimary}`}>{child.name}</h3>
                {status === 'present' ? (
                  <CheckCircle className='w-6 h-6 text-green-500' />
                ) : (
                  <XCircle className='w-6 h-6 text-red-500' />
                )}
              </div>
                <div className='flex justify-between py-2 items-center'>
                <p className={`text-sm mb-4 transition-colors duration-300 ${textSecondary}`}>{child.group}</p>
                <div>
                <div className=' top-3 right-3 flex gap-2'>
                <button
                  onClick={() => handleEdit(child)}
                  className='p-1 rounded hover:bg-green-500 hover:text-white transition-colors'
                  title='O‘zgartirish'
                >
                  <FiEdit className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
                </button>
                <button
                  onClick={() => handleDelete(child.id)}
                  className='p-1 rounded bg-red-500 hover:bg-red-600 transition-colors'
                  title='O‘chirish'
                >
                  <FiTrash2 className='w-5 h-5 text-white' />
                </button>
              </div>
                </div>
                </div>
              <div className='flex gap-2'>
                <button
                  onClick={() => markAttendance(child.id, 'present')}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors duration-300 ${
                    status === 'present'
                      ? 'bg-green-500 text-white'
                      : darkMode
                        ? 'bg-green-900/30 text-green-300 hover:bg-green-900/50'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  {t('attendance.present')}
                </button>
                <button
                  onClick={() => markAttendance(child.id, 'absent')}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors duration-300 ${
                    status === 'absent'
                      ? 'bg-red-500 text-white'
                      : darkMode
                        ? 'bg-red-900/30 text-red-300 hover:bg-red-900/50'
                        : 'bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                >
                  {t('attendance.absent')}
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 backdrop-blur-[12px] bg-black/20 flex items-center justify-center z-50 p-4' onClick={() => setShowModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative rounded-2xl p-6 w-full max-w-md shadow-[0_6px_20px_rgba(0,0,0,0.05)] border ${darkMode ? 'bg-[#1F2937] border-[#334155]' : 'bg-white border-[#E5E7EB]'}`}
            style={{ borderTop: darkMode ? undefined : `4px solid ${themeColor}` }}
          >
            <h2 className={`text-2xl font-bold mb-4 ${textPrimary}`}>{editingChild ? 'O‘zgartirish' : 'Yangi bola qo‘shish'}</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ism</label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg ${inputBg}`}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Guruh</label>
                <input
                  type='text'
                  value={formData.group}
                  onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg ${inputBg}`}
                  required
                />
              </div>
              <div className='flex gap-3'>
                <button
                  type='button'
                  onClick={() => setShowModal(false)}
                  className={`flex-1 px-4 py-2 border rounded-lg ${darkMode ? 'bg-[#1E293B] border-[#334155] text-white hover:bg-[#334155]' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  Bekor qilish
                </button>
                <button
                  type='submit'
                  className='flex-1 px-4 py-2 text-white rounded-lg'
                  style={{ backgroundColor: themeColor }}
                >
                  Saqlash
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminAttendance
