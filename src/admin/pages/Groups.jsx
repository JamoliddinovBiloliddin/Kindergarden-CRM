import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Search, Users, User } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { useLanguage } from '../../contexts/LanguageContext'

const AdminGroups = () => {
    const { currentTheme, darkMode } = useTheme()
    const { t } = useLanguage()
    const [groups, setGroups] = useState([])
    const [teachers, setTeachers] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingGroup, setEditingGroup] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        capacity: '',
        teacherId: ''
    })

    useEffect(() => {
        loadData()
        window.addEventListener('storage', loadData)
        return () => window.removeEventListener('storage', loadData)
    }, [])

    const loadData = () => {
        const storedGroups = JSON.parse(localStorage.getItem('groups') || '[]')
        const storedTeachers = JSON.parse(localStorage.getItem('teachers') || '[]')
        setGroups(storedGroups)
        setTeachers(storedTeachers)
    }

    const persistGroups = (newGroups) => {
        setGroups(newGroups)
        localStorage.setItem('groups', JSON.stringify(newGroups))
    }

    const handleDelete = (id) => {
        if (confirm('Guruhni o‘chirmoqchimisiz?')) {
            const updated = groups.filter(g => g.id !== id)
            persistGroups(updated)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (editingGroup) {
            const updated = groups.map(g => g.id === editingGroup.id ? { ...g, ...formData } : g)
            persistGroups(updated)
        } else {
            const newGroup = {
                id: 'g-' + Date.now(),
                ...formData,
                createdAt: new Date().toISOString()
            }
            persistGroups([...groups, newGroup])
        }
        setShowModal(false)
    }

    const startEdit = (group) => {
        setEditingGroup(group)
        setFormData({
            name: group.name,
            capacity: group.capacity,
            teacherId: group.teacherId || ''
        })
        setShowModal(true)
    }

    const openAdd = () => {
        setEditingGroup(null)
        setFormData({
            name: '',
            capacity: '',
            teacherId: ''
        })
        setShowModal(true)
    }

    const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const themeColor = (currentTheme && currentTheme.primary) || '#2563EB'
    const themeHover = (currentTheme && currentTheme.primaryHover) || '#1D4ED8'

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`text-3xl font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'
                        }`}
                >
                    Guruhlar
                </motion.h1>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={openAdd}
                    className='flex items-center gap-2 px-4 py-2 text-white rounded-[14px] font-medium shadow-sm transition-all duration-300'
                    style={{ backgroundColor: themeColor }}
                    onMouseEnter={(e) => { e.target.style.backgroundColor = themeHover }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = themeColor }}
                >
                    <Plus className='w-5 h-5' />
                    {t('common.add')}
                </motion.button>
            </div>

            <div className='relative'>
                <input
                    type='text'
                    placeholder='Guruh nomi bo‘yicha qidirish...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border rounded-2xl transition-colors duration-300 focus:outline-none focus:ring-2 ${darkMode
                            ? 'bg-[#334155] border-[#475569] text-white focus:ring-blue-500'
                            : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900 focus:ring-blue-500'
                        }`}
                />
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filteredGroups.map((group, index) => {
                    const assignedTeacher = teachers.find(t => t.id === group.teacherId)
                    return (
                        <motion.div
                            key={group.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`relative rounded-2xl p-6 transition-all duration-200 ${darkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E5E7EB]'
                                } border shadow-[0_6px_20px_rgba(0,0,0,0.05)]`}
                            style={{ borderTop: darkMode ? undefined : `4px solid ${themeColor}` }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <Users className={`w-8 h-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                <span className={`text-sm px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`}>
                                    Sig'im: {group.capacity}
                                </span>
                            </div>

                            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{group.name}</h3>

                            <div className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span>
                                        {assignedTeacher ? `${assignedTeacher.firstName} ${assignedTeacher.lastName}` : 'Tarbiyachi biriktirilmagan'}
                                    </span>
                                </div>
                            </div>

                            <div className='flex gap-3'>
                                <button
                                    onClick={() => startEdit(group)}
                                    className='flex-1 px-3 py-2 text-white rounded-lg text-sm font-medium'
                                    style={{ backgroundColor: themeColor }}
                                >
                                    <Edit2 className='w-4 h-4 mx-auto' />
                                </button>
                                <button
                                    onClick={() => handleDelete(group.id)}
                                    className='flex-1 px-3 py-2 text-white rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600'
                                >
                                    <Trash2 className='w-4 h-4 mx-auto' />
                                </button>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {showModal && (
                <div className='fixed inset-0 backdrop-blur-[12px] bg-black/20 flex items-center justify-center z-50 p-4' onClick={() => setShowModal(false)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`relative rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl border ${darkMode ? 'bg-[#1F293B] border-[#334155]' : 'bg-white border-[#E5E7EB]'
                            }`}
                        onClick={(e) => e.stopPropagation()}
                        style={{ borderTop: darkMode ? undefined : `4px solid ${themeColor}` }}
                    >
                        <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {editingGroup ? 'Guruhni tahrirlash' : 'Yangi guruh qo‘shish'}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Guruh Nomi</label>
                                <input
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'}`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sig'im</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.capacity}
                                    onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                                    className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'}`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Tarbiyachi</label>
                                <select
                                    value={formData.teacherId}
                                    onChange={e => setFormData({ ...formData, teacherId: e.target.value })}
                                    className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'}`}
                                >
                                    <option value="">Tanlang...</option>
                                    {teachers.map(t => (
                                        <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className='flex gap-3 pt-4'>
                                <button
                                    type='button'
                                    onClick={() => setShowModal(false)}
                                    className={`flex-1 px-4 py-2 border rounded-lg transition-colors duration-300 ${darkMode ? 'bg-[#1E293B] border-[#334155] text-white hover:bg-[#334155]' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                >
                                    {t('common.cancel')}
                                </button>
                                <button
                                    type='submit'
                                    className='flex-1 px-4 py-2 text-white rounded-lg transition-all duration-300'
                                    style={{ backgroundColor: themeColor }}
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

export default AdminGroups
