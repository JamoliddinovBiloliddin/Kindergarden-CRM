import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Search, User, Key, Lock, Upload, X } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { useLanguage } from '../../contexts/LanguageContext'

const AdminTeachers = () => {
    const { currentTheme, darkMode } = useTheme()
    const { t } = useLanguage()
    const [teachers, setTeachers] = useState([])
    const [groups, setGroups] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingTeacher, setEditingTeacher] = useState(null)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        birthYear: '',
        phone: '',
        photo: null,
        assignedGroups: [],
        username: '',
        password: ''
    })

    useEffect(() => {
        loadData()
        window.addEventListener('storage', loadData)
        return () => window.removeEventListener('storage', loadData)
    }, [])

    const loadData = () => {
        const storedTeachers = JSON.parse(localStorage.getItem('teachers') || '[]')
        const storedGroups = JSON.parse(localStorage.getItem('groups') || '[]')
        setTeachers(storedTeachers)
        setGroups(storedGroups)
    }

    const persistTeachers = (newTeachers) => {
        setTeachers(newTeachers)
        localStorage.setItem('teachers', JSON.stringify(newTeachers))

        // Also update auth_users for login
        const authUsers = JSON.parse(localStorage.getItem('auth_users') || '[]')
        // Filter out old entries for these teachers and add new/updated ones
        // Actually, better to sync individual user.
        // For simplicity, we regenerate auth_users for teachers

        // Strategy: We keep other roles as is, just update teachers.
        // But since we don't have a centralized DB, we have to be careful not to delete others.
        // Let's assume auth_users contains ALL users.

        const otherUsers = authUsers.filter(u => u.role !== 'teacher')
        const teacherUsers = newTeachers.map(t => ({
            id: t.id,
            username: t.username,
            password: t.password,
            name: `${t.firstName} ${t.lastName}`,
            role: 'teacher',
            teacherId: t.id
        }))

        localStorage.setItem('auth_users', JSON.stringify([...otherUsers, ...teacherUsers]))
    }

    const handleDelete = (id) => {
        if (confirm('Rostdan ham o‘chirmoqchimisiz?')) {
            const updated = teachers.filter(t => t.id !== id)
            persistTeachers(updated)

            // Allow cleaning up auth_user immediately
            const authUsers = JSON.parse(localStorage.getItem('auth_users') || '[]')
            const updatedAuth = authUsers.filter(u => u.teacherId !== id)
            localStorage.setItem('auth_users', JSON.stringify(updatedAuth))
        }
    }

    const startEdit = (teacher) => {
        setEditingTeacher(teacher)
        setFormData({
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            birthYear: teacher.birthYear,
            phone: teacher.phone,
            photo: teacher.photo,
            assignedGroups: teacher.assignedGroups || [],
            username: teacher.username,
            password: teacher.password
        })
        setShowModal(true)
    }

    const openAdd = () => {
        setEditingTeacher(null)
        setFormData({
            firstName: '',
            lastName: '',
            birthYear: '',
            phone: '',
            photo: null,
            assignedGroups: [],
            username: '',
            password: ''
        })
        setShowModal(true)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (editingTeacher) {
            const updated = teachers.map(t => t.id === editingTeacher.id ? { ...t, ...formData, id: t.id } : t)
            persistTeachers(updated)
        } else {
            const newTeacher = {
                id: 't-' + Date.now(),
                ...formData
            }
            persistTeachers([...teachers, newTeacher])
        }
        setShowModal(false)
    }

    const toggleGroupSelection = (groupId) => {
        if (formData.assignedGroups.includes(groupId)) {
            setFormData({ ...formData, assignedGroups: formData.assignedGroups.filter(id => id !== groupId) })
        } else {
            setFormData({ ...formData, assignedGroups: [...formData.assignedGroups, groupId] })
        }
    }

    const filteredTeachers = teachers.filter(t =>
        t.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    )

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
                    Tarbiyachilar
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
                    placeholder='Ism yoki familiya bo‘yicha qidirish...'
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
                {filteredTeachers.map((teacher, index) => (
                    <motion.div
                        key={teacher.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`relative rounded-2xl p-6 transition-all duration-200 ${darkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E5E7EB]'
                            } border shadow-[0_6px_20px_rgba(0,0,0,0.05)]`}
                        style={{ borderTop: darkMode ? undefined : `4px solid ${themeColor}` }}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                                {teacher.photo ? (
                                    <img src={teacher.photo} alt={teacher.firstName} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-8 h-8 text-gray-400" />
                                )}
                            </div>
                            <div>
                                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {teacher.firstName} {teacher.lastName}
                                </h3>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {teacher.phone}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2 mb-4">
                            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                <strong>Login:</strong> {teacher.username}
                            </div>
                            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                <strong>Guruhlar:</strong>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {teacher.assignedGroups && teacher.assignedGroups.length > 0 ? (
                                        teacher.assignedGroups.map(gid => {
                                            const g = groups.find(grp => grp.id === gid)
                                            return g ? (
                                                <span key={gid} className={`text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`}>
                                                    {g.name}
                                                </span>
                                            ) : null
                                        })
                                    ) : (
                                        <span className="text-gray-400 text-xs">Biriktirilmagan</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className='flex gap-3'>
                            <button
                                onClick={() => startEdit(teacher)}
                                className='flex-1 px-3 py-2 text-white rounded-lg text-sm font-medium'
                                style={{ backgroundColor: themeColor }}
                            >
                                <Edit2 className='w-4 h-4 mx-auto' />
                            </button>
                            <button
                                onClick={() => handleDelete(teacher.id)}
                                className='flex-1 px-3 py-2 text-white rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600'
                            >
                                <Trash2 className='w-4 h-4 mx-auto' />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {showModal && (
                <div className='fixed inset-0 backdrop-blur-[12px] bg-black/20 flex items-center justify-center z-50 p-4' onClick={() => setShowModal(false)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`relative rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl border ${darkMode ? 'bg-[#1F293B] border-[#334155]' : 'bg-white border-[#E5E7EB]'
                            }`}
                        onClick={(e) => e.stopPropagation()}
                        style={{ borderTop: darkMode ? undefined : `4px solid ${themeColor}` }}
                    >
                        <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {editingTeacher ? 'Tarbiyachini tahrirlash' : 'Yangi tarbiyachi qo‘shish'}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ism</label>
                                    <input
                                        required
                                        value={formData.firstName}
                                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                        className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'}`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Familiya</label>
                                    <input
                                        required
                                        value={formData.lastName}
                                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                        className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'}`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Telefon</label>
                                    <input
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'}`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Tug'ilgan yili</label>
                                    <input
                                        type="number"
                                        value={formData.birthYear}
                                        onChange={e => setFormData({ ...formData, birthYear: e.target.value })}
                                        className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'}`}
                                    />
                                </div>
                            </div>

                            <div className="border-t pt-4 border-gray-200 dark:border-gray-700">
                                <h4 className={`text-md font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Login Ma'lumotlari</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Login (Username)</label>
                                        <input
                                            required
                                            value={formData.username}
                                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                                            className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'}`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Parol</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                            className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'}`}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4 border-gray-200 dark:border-gray-700">
                                <h4 className={`text-md font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Biriktirilgan Guruhlar</h4>
                                <div className="max-h-40 overflow-y-auto border rounded-lg p-2 dark:border-gray-600">
                                    {groups.length > 0 ? (
                                        groups.map(group => (
                                            <div key={group.id} className="flex items-center gap-2 mb-2 last:mb-0">
                                                <input
                                                    type="checkbox"
                                                    id={`g-${group.id}`}
                                                    checked={formData.assignedGroups.includes(group.id)}
                                                    onChange={() => toggleGroupSelection(group.id)}
                                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <label htmlFor={`g-${group.id}`} className={`text-sm cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {group.name}
                                                </label>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">Guruhlar mavjud emas.</p>
                                    )}
                                </div>
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

export default AdminTeachers
