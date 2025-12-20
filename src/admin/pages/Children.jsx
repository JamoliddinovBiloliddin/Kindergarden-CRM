import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, User, User2 } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useTheme } from '../../contexts/ThemeContext'
import { useLanguage } from '../../contexts/LanguageContext'

const AdminChildren = () => {
    const { currentTheme, darkMode } = useTheme()
    const { t } = useLanguage()
    const [children, setChildren] = useState([])
    const [groups, setGroups] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingChild, setEditingChild] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        group: '',
        groupId: '',
        gender: 'male', // default male
        login: '',
        password: ''
    })

    useEffect(() => {
        loadData()
        window.addEventListener('storage', loadData)
        return () => window.removeEventListener('storage', loadData)
    }, [])

    const loadData = () => {
        const storedChildren = JSON.parse(localStorage.getItem('children') || '[]')
        const storedGroups = JSON.parse(localStorage.getItem('groups') || '[]')
        setChildren(storedChildren)
        setGroups(storedGroups)
    }

    const persistChildren = (newChildren) => {
        setChildren(newChildren)
        localStorage.setItem('children', JSON.stringify(newChildren))

        // Also update students storage which seems to be used elsewhere or legacy?
        // Let's keep 'children' as the source for Admin.
        // Teacher component uses 'mock/students' initially but we need it to use localStorage.
        // We probably need to ensure consistency. 
        // For now, updating 'children' key.
    }

    const handleDelete = (id) => {
        if (confirm('O‘chirmoqchimisiz?')) {
            const updated = children.filter((c) => c.id !== id)
            persistChildren(updated)
        }
    }

    const startEdit = (child) => {
        setEditingChild(child)
        setFormData({
            name: child.name,
            age: child.age,
            group: child.group,
            groupId: child.groupId || groups.find(g => g.name === child.group)?.id || '', // Attempt to recover ID if missing
            gender: child.gender,
            login: child.login || '',
            password: child.password || ''
        })
        setShowModal(true)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Find group ID/Name consistency. 
        // formData.group stores the Group Name or ID?
        // Previously it was text input. Now strict.
        // Let's store Group Name for display simplicity, OR ID.
        // Ideally should be ID, but legacy mock data used Name. 
        // Prompt says: "Selectda faqat Admin tomonidan yaratilgan guruhlar chiqsin"
        // Let's store Group Name as the value for now to keep backward compatibility with cards display
        // Or better: Store ID, display Name. 
        // The existing cards display `child.group` directly. Let's assume we store Name for now to avoid refactoring everything.
        // Wait, "Bola -> Guruh -> Teacher bog'lanishi avtomatik ishlasin."
        // If we store Group Name, we can lookup Group -> Teacher.

        if (editingChild) {
            const updated = children.map((c) =>
                c.id === editingChild.id ? { ...c, ...formData } : c
            )
            persistChildren(updated)
            setEditingChild(null)
        } else {
            const newChild = {
                id: Date.now(),
                ...formData,
                qrCode: `CHILD${Date.now()}`,
                createdAt: new Date().toISOString()
            }
            // Update auth_user for child login (Parent Login)
            if (newChild.login && newChild.password) {
                const authUsers = JSON.parse(localStorage.getItem('auth_users') || '[]')
                // Remove existing user with same username if any (to avoid duplicates/conflicts)
                const filteredUsers = authUsers.filter(u => u.username !== newChild.login)

                const newUser = {
                    id: `parent-${newChild.id}`,
                    username: newChild.login,
                    password: newChild.password, // In real app, hash this!
                    role: 'parent',
                    name: `Parent of ${newChild.name}`,
                    childId: newChild.id,
                    childName: newChild.name,
                    groupId: newChild.groupId || groups.find(g => g.name === newChild.group)?.id
                }

                localStorage.setItem('auth_users', JSON.stringify([...filteredUsers, newUser]))
            }

            persistChildren([...children, newChild])
        }

        setShowModal(false)
        setFormData({
            name: '',
            age: '',
            group: '',
            groupId: '',
            gender: 'male',
            login: '',
            password: ''
        })
    }

    const filteredChildren = children.filter(
        (child) =>
            child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            child.group.toLowerCase().includes(searchTerm.toLowerCase())
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
                    {t('modules.children')}
                </motion.h1>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowModal(true)}
                    className='flex items-center gap-2 px-4 py-2 text-white rounded-[14px] font-medium shadow-sm transition-all duration-300'
                    style={{ backgroundColor: themeColor }}
                    onMouseEnter={(e) => { e.target.style.backgroundColor = themeHover }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = themeColor }}
                >
                    <Plus className='w-5 h-5' />
                    {t('common.add')}
                </motion.button>
            </div>

            <div className='flex items-center gap-4'>
                <div className='flex-1 relative'>
                    <input
                        type='text'
                        placeholder='Qidirish...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-4 pr-4 py-2 border rounded-2xl transition-colors duration-300 focus:outline-none focus:ring-2 ${darkMode
                            ? 'bg-[#334155] border-[#475569] text-white focus:ring-blue-500'
                            : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900 focus:ring-blue-500'
                            }`}
                    />
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filteredChildren.map((child, index) => (
                    <motion.div
                        key={child.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -2, transition: { duration: 0.2, ease: 'easeOut' } }}
                        className={`relative rounded-2xl p-6 transition-all duration-200 ${darkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E5E7EB]'
                            } border shadow-[0_6px_20px_rgba(0,0,0,0.05)]`}
                        style={{ borderTop: darkMode ? undefined : `4px solid ${themeColor}` }}
                    >
                        <div className='flex items-center justify-between mb-4'>
                            {child.gender === 'male' ? (
                                <User className='w-6 h-6' style={{ color: themeColor }} />
                            ) : (
                                <User2 className='w-6 h-6' style={{ color: themeColor }} />
                            )}
                            <span className='text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300'>{child.group}</span>
                        </div>

                        <h3 className='font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300' style={{ color: themeColor }}>{child.name}</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-300'>Yoshi: {child.age}</p>

                        <div className='flex justify-center p-2 rounded-[14px] mb-3'>
                            <div className={`p-2 rounded-lg transition-colors duration-300 ${darkMode ? 'bg-[#334155]' : 'bg-white'
                                }`}>
                                <QRCodeSVG
                                    value={child.qrCode || 'NO_QR'}
                                    size={80}
                                    bgColor='transparent'
                                    fgColor={darkMode ? '#FFFFFF' : '#000000'}
                                />
                            </div>
                        </div>

                        <div className='flex gap-3'>
                            <button
                                onClick={() => startEdit(child)}
                                className='flex-1 px-3 py-2 text-white rounded-lg text-sm font-medium'
                                style={{ backgroundColor: themeColor }}
                                onMouseEnter={(e) => { e.target.style.backgroundColor = themeHover }}
                                onMouseLeave={(e) => { e.target.style.backgroundColor = themeColor }}
                            >
                                <Edit2 className='w-4 h-4 mx-auto' />
                            </button>

                            <button
                                onClick={() => handleDelete(child.id)}
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
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                        className={`relative rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_6px_20px_rgba(0,0,0,0.05)] border ${darkMode ? 'bg-[#1F293B] border-[#334155]' : 'bg-white border-[#E5E7EB]'
                            }`}
                        style={{ borderTop: darkMode ? undefined : `4px solid ${themeColor}` }}
                    >
                        <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {editingChild ? 'O‘zgartirish' : t('common.addChild')}
                        </h2>

                        <form onSubmit={handleSubmit} className='space-y-4'>
                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('common.name')}</label>
                                <input
                                    type='text'
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${darkMode ? 'bg-[#334155] border-[#475569] text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'}`}
                                    required
                                />
                            </div>

                            <div className='grid grid-cols-2 gap-3'>
                                <div>
                                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('common.age')}</label>
                                    <input
                                        type='number'
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${darkMode ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('common.group')}</label>
                                    <select
                                        value={formData.groupId}
                                        onChange={(e) => {
                                            const gId = e.target.value
                                            const gName = groups.find(g => g.id === gId)?.name || ''
                                            setFormData({ ...formData, groupId: gId, group: gName })
                                        }}
                                        className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${darkMode ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                        required
                                    >
                                        <option value="">Tanlang...</option>
                                        {groups.map(g => (
                                            <option key={g.id} value={g.id}>{g.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Jins</label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${darkMode ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                >
                                    <option value='male'>O‘g‘il bola</option>
                                    <option value='female'>Qiz bola</option>
                                </select>
                            </div>

                            <div className={`border-t pt-4 mt-4 transition-colors duration-300 ${darkMode ? 'border-[#334155]' : 'border-gray-200'}`}>
                                <h3 className={`text-lg font-semibold mb-3 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('common.childLoginInfo')}</h3>
                                <div>
                                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('common.login')}</label>
                                    <input
                                        type='text'
                                        value={formData.login}
                                        onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                                        className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${darkMode ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-white border-gray-300 text-gray-900'}`}

                                    />
                                </div>
                                <div className='mt-3'>
                                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('common.password')}</label>
                                    <input
                                        type='password'
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${darkMode ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-white border-gray-300 text-gray-900'}`}

                                    />
                                </div>
                            </div>

                            <div className='flex gap-3'>
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

export default AdminChildren
