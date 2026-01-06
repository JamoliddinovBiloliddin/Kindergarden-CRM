import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Syringe, Calendar, CheckCircle, Clock } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import { useTheme } from '../../contexts/ThemeContext'

const AdminVaccination = () => {
    const { t } = useLanguage()
    const { darkMode, currentTheme } = useTheme()
    const [vaccines, setVaccines] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [editingVaccine, setEditingVaccine] = useState(null)

    const [formData, setFormData] = useState({
        groupName: '',
        vaccineName: '',
        dueDate: '',
        status: 'pending',
    })

    useEffect(() => {
        loadVaccines()
    }, [])

    const loadVaccines = () => {
        const stored = JSON.parse(localStorage.getItem('vaccines') || '[]')
        setVaccines(stored)
    }

    const handleDelete = (id) => {
        const filtered = vaccines.filter((v) => v.id !== id)
        setVaccines(filtered)
        localStorage.setItem('vaccines', JSON.stringify(filtered))
    }

    const startEdit = (vaccine) => {
        setEditingVaccine(vaccine)
        setFormData({
            groupName: vaccine.groupName,
            vaccineName: vaccine.vaccineName,
            dueDate: vaccine.dueDate,
            status: vaccine.status
        })
        setShowModal(true)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (editingVaccine) {
            const updated = vaccines.map((v) =>
                v.id === editingVaccine.id ? { ...v, ...formData } : v
            )
            setVaccines(updated)
            localStorage.setItem('vaccines', JSON.stringify(updated))
            setEditingVaccine(null)
        } else {
            const newVaccine = {
                id: Date.now(),
                ...formData,
                createdAt: new Date().toISOString()
            }
            const updated = [...vaccines, newVaccine]
            setVaccines(updated)
            localStorage.setItem('vaccines', JSON.stringify(updated))
        }

        setShowModal(false)
        setFormData({
            groupName: '',
            vaccineName: '',
            dueDate: '',
            status: 'pending'
        })
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <h1 className='text-3xl font-bold text-gray-800'>
                    {t('modules.vaccination')}
                </h1>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowModal(true)}
                    className='flex items-center gap-2 px-4 py-2 text-white rounded-[14px] font-medium shadow-sm transition-all duration-300'
                    style={{ backgroundColor: (currentTheme && currentTheme.primary) || '#2563EB' }}
                >
                    <Plus className='w-5 h-5' />
                    {t('common.add')}
                </motion.button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {vaccines.map((vaccine) => {
                    const themeColor = (currentTheme && currentTheme.primary) || '#2563EB'

                    return (
                        <motion.div
                            key={vaccine.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -2 }}
                            className={`relative rounded-2xl p-6 border shadow-sm transition-all duration-200 ${
                                darkMode
                                    ? 'bg-[#1E293B] border-[#334155]'
                                    : 'bg-white border-[#E5E7EB]'
                            }`}
                            style={{
                                borderTop: darkMode ? undefined : `4px solid ${themeColor}`
                            }}
                        >
                            <div className='flex items-start justify-between mb-4'>
                                <Syringe
                                    className={`w-6 h-6 ${
                                        vaccine.status === 'completed'
                                            ? 'text-green-500'
                                            : 'text-orange-500'
                                    }`}
                                />
                                {vaccine.status === 'completed' ? (
                                    <CheckCircle className='w-5 h-5 text-green-500' />
                                ) : (
                                    <Clock className='w-5 h-5 text-orange-500' />
                                )}
                            </div>

                            <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {vaccine.groupName || "Guruh nomi kiritilmagan"}
                            </h3>

                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2`}>
                                {vaccine.vaccineName}
                            </p>

                            <div className={`flex items-center gap-2 text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                <Calendar className='w-4 h-4' />
                                {vaccine.dueDate}
                            </div>

                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    vaccine.status === 'completed'
                                        ? darkMode
                                            ? 'bg-green-900/30 text-green-300'
                                            : 'bg-green-100 text-green-700'
                                        : darkMode
                                            ? 'bg-orange-900/30 text-orange-300'
                                            : 'bg-orange-100 text-orange-700'
                                }`}
                            >
                                {vaccine.status === 'completed' ? 'Yakunlangan' : 'Kutilmoqda'}
                            </span>

                            <div className='flex gap-3 mt-4'>
                                <button
                                    onClick={() => startEdit(vaccine)}
                                    className='flex-1 px-3 py-2 text-white rounded-lg text-sm font-medium'
                                    style={{ backgroundColor: themeColor }}
                                >
                                    O‘zgartirish
                                </button>

                                <button
                                    onClick={() => handleDelete(vaccine.id)}
                                    className='flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600'
                                >
                                    O‘chirish
                                </button>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {showModal && (
                <div
                    className='fixed inset-0 backdrop-blur-[12px] bg-black/20 flex items-center justify-center z-50 p-4'
                    onClick={() => setShowModal(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                        className={`relative rounded-2xl p-6 w-full max-w-md border shadow-sm ${
                            darkMode ? 'bg-[#1F2937] border-[#334155]' : 'bg-white border-[#E5E7EB]'
                        }`}
                        style={{
                            borderTop: darkMode ? undefined : `4px solid ${(currentTheme && currentTheme.primary) || '#2563EB'}`
                        }}
                    >
                        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {editingVaccine ? "O‘zgartirish" : t('vaccination.addVaccine')}
                        </h2>

                        <form onSubmit={handleSubmit} className='space-y-4'>
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Guruh nomi
                                </label>
                                <input
                                    type='text'
                                    value={formData.groupName}
                                    onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                                    className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-[#334155] border-[#475569] text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'}`}
                                    required
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {t('vaccination.vaccineName')}
                                </label>
                                <input
                                    type='text'
                                    value={formData.vaccineName}
                                    onChange={(e) => setFormData({ ...formData, vaccineName: e.target.value })}
                                    className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-[#334155] border-[#475569] text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'}`}
                                    required
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {t('vaccination.dueDate')}
                                </label>
                                <input
                                    type='date'
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-[#334155] border-[#475569] text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'}`}
                                    required
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {t('vaccination.status')}
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-[#334155] border-[#475569] text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'}`}
                                >
                                    <option value='pending'>Kutilmoqda</option>
                                    <option value='completed'>Yakunlangan</option>
                                </select>
                            </div>

                            <div className='flex gap-3'>
                                <button
                                    type='button'
                                    onClick={() => setShowModal(false)}
                                    className={`flex-1 px-4 py-2 border rounded-lg ${darkMode ? 'bg-[#1E293B] border-[#334155] text-white' : 'bg-white border-gray-300 text-gray-700'}`}
                                >
                                    {t('common.cancel')}
                                </button>

                                <button
                                    type='submit'
                                    className='flex-1 px-4 py-2 text-white rounded-lg'
                                    style={{ backgroundColor: (currentTheme && currentTheme.primary) || '#2563EB' }}
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

export default AdminVaccination
