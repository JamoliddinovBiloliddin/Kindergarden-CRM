import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, UtensilsCrossed, Clock, Trash2, Edit } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import { useTheme } from '../../contexts/ThemeContext'

const TeacherMeals = () => {
    const { t } = useLanguage()
    const { darkMode, currentTheme } = useTheme()
    const [meals, setMeals] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [editId, setEditId] = useState(null)

    const [formData, setFormData] = useState({
        mealName: '',
        mealType: 'breakfast',
        menu: '',
        days: [],
        time: ''
    })

    const weekDays = [
        { key: 'monday', label: 'Dushanba' },
        { key: 'tuesday', label: 'Seshanba' },
        { key: 'wednesday', label: 'Chorshanba' },
        { key: 'thursday', label: 'Payshanba' },
        { key: 'friday', label: 'Juma' },
        { key: 'saturday', label: 'Shanba' },
        { key: 'sunday', label: 'Yakshanba' }
    ]

    useEffect(() => {
        loadMeals()
    }, [])

    const loadMeals = () => {
        const stored = JSON.parse(localStorage.getItem('meals') || '[]')
        setMeals(stored)
    }

    const saveMeals = (updated) => {
        localStorage.setItem('meals', JSON.stringify(updated))
        setMeals(updated)
    }

    /* ADD & UPDATE */
    const handleSubmit = (e) => {
        e.preventDefault()

        if (editId) {
            const updatedMeals = meals.map((m) =>
                m.id === editId ? { ...m, ...formData } : m
            )
            saveMeals(updatedMeals)
        } else {
            const newMeal = {
                id: Date.now(),
                ...formData,
                date: new Date().toISOString().split('T')[0]
            }
            saveMeals([...meals, newMeal])
        }

        closeModal()
    }

    /* DELETE */
    const deleteMeal = (id) => {
        const updated = meals.filter((meal) => meal.id !== id)
        saveMeals(updated)
    }

    /* EDIT */
    const editMeal = (meal) => {
        setEditId(meal.id)
        setFormData({
            mealName: meal.mealName,
            mealType: meal.mealType,
            menu: meal.menu,
            days: meal.days || [],
            time: meal.time
        })
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setEditId(null)
        setFormData({
            mealName: '',
            mealType: 'breakfast',
            menu: '',
            days: [],
            time: ''
        })
    }

    const themeColor = (currentTheme && currentTheme.primary) || '#2563EB'

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <motion.h1 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}
                >
                    {t('modules.meals')}
                </motion.h1>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowModal(true)}
                    className='flex items-center gap-2 px-4 py-2 text-white rounded-[14px]'
                    style={{ backgroundColor: themeColor }}
                >
                    <Plus className='w-5 h-5' />
                    {t('meals.addMeal')}
                </motion.button>
            </div>

            {/* Cards */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' >
                {meals.map((meal, index) => {
                    const typeColors = { breakfast: '#2563EB', lunch: '#16A34A', snack: '#F97316' }
                    const mealColor = typeColors[meal.mealType]

                    return (
                        <motion.div
                            key={meal.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
							style={{
								borderTop: darkMode ? undefined : `4px solid ${themeColor}`
							}}
                            className={`rounded-2xl p-6 shadow ${
                                darkMode ? 'bg-[#1E293B]' : 'bg-white'
                            }`}
                        >       
                            <div className='flex justify-between mb-3' >
                                <div className='flex items-center gap-2'>
                                    <UtensilsCrossed className='w-5 h-5' style={{ color: mealColor }} />
                                    <span className='font-semibold text-xl' style={{ color: mealColor }}>
                                        {meal.mealName}
                                    </span>
                                </div>
                                <span className='text-xs text-gray-500 font-medium'>{meal.date}</span>
                            </div>

                            <p className={`text-sm mb-2 font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {meal.menu}
                            </p>

                            <p className='text-xs font-medium mt-2 text-gray-500'>
                                🗓 Kunlar: {meal.days?.map((d) => weekDays.find((w) => w.key === d)?.label).join(', ')}
                            </p>

                            <div className='flex items-center gap-2 text-sm text-gray-500 mt-2'>
                                <Clock className='w-4 h-4' /> {meal.time}
                            </div>

                            <div className='flex gap-3 mt-4'>
                                <button
                                    onClick={() => editMeal(meal)}
                                    className='flex-1 py-2 bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2'
									style={{ backgroundColor: themeColor }}
									onMouseEnter={(e) => {
										e.target.style.backgroundColor = (currentTheme && currentTheme.primaryHover) || '#1D4ED8'
									}}
									onMouseLeave={(e) => {
										e.target.style.backgroundColor = themeColor
									}}
                                >
                                    <Edit size={16} /> {t('common.edit')}
                                </button>

                                <button
                                    onClick={() => deleteMeal(meal.id)}
                                    className='flex-1 py-2 bg-red-500 text-white rounded-lg flex items-center justify-center gap-2'
                                >
                                    <Trash2 size={16} /> {t('common.delete')}
                                </button>
                            </div>

                        </motion.div>
                    )
                })}
            </div>

            {/* MODAL */}
            {showModal && (
                <div className='fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4'>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`rounded-2xl p-6 w-full max-w-md shadow-xl ${
                            darkMode ? 'bg-[#0F172A] text-white' : 'bg-white text-gray-900'
                        }`}
                        style={{
                            boxShadow: '0 8px 25px rgba(0,0,0,0.20)',
                        }}
                    >
                        <h2 className='text-2xl font-bold mb-4'>
                            {editId ? t('common.edit') : t('meals.addMeal')}
                        </h2>

                        <form onSubmit={handleSubmit} className='space-y-4'>
                            
                            {/* Ovqat nomi */}
                            <input
                                type='text'
                                placeholder='Ovqat nomi'
                                value={formData.mealName}
                                onChange={(e) => setFormData({ ...formData, mealName: e.target.value })}
                                className={`w-full px-4 py-2 rounded-lg outline-none border ${
                                    darkMode
                                        ? 'bg-[#1E293B] text-white border-[#475569] placeholder-gray-400 focus:bg-[#243447]'
                                        : 'bg-[#F9FAFB] border-[#E5E7EB] focus:bg-white'
                                }`}
                                required
                            />

                            {/* Meals type */}
                            <select
                                value={formData.mealType}
                                onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
                                className={`w-full px-4 py-2 rounded-lg outline-none border ${
                                    darkMode
                                        ? 'bg-[#334155] text-white border-[#475569] focus:bg-[#243447]'
                                        : 'bg-[#F9FAFB] border-[#E5E7EB] focus:bg-white'
                                }`}
                            >
                                <option value='breakfast'>Nonushta</option>
                                <option value='lunch'>Tushlik</option>
                                <option value='snack'>Yengil ovqat</option>
                            </select>

                            {/* Menu */}
                            <textarea
                                value={formData.menu}
                                onChange={(e) => setFormData({ ...formData, menu: e.target.value })}
                                rows={3}
                                required
                                className={`w-full px-4 py-2 rounded-lg outline-none border ${
                                    darkMode
                                        ? 'bg-[#334155] text-white border-[#475569] focus:bg-[#243447]'
                                        : 'bg-[#F9FAFB] border-[#E5E7EB] focus:bg-white'
                                }`}
                            />

                            {/* Kunlar */}
                            <div>
                                <p className='text-sm font-medium mb-2'>Qaysi kunlar beriladi?</p>
                                <div className='grid grid-cols-2 gap-2'>
                                    {weekDays.map((day) => (
                                        <label key={day.key} className='flex items-center gap-2 text-sm'>
                                            <input
                                                type='checkbox'
                                                checked={formData.days.includes(day.key)}
                                                onChange={(e) => {
                                                    let updatedDays = [...formData.days]
                                                    if (e.target.checked) updatedDays.push(day.key)
                                                    else updatedDays = updatedDays.filter((d) => d !== day.key)
                                                    setFormData({ ...formData, days: updatedDays })
                                                }}
                                            />
                                            {day.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Time */}
                            <input
                                type='time'
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                required
                                className={`w-full px-4 py-2 rounded-lg outline-none border ${
                                    darkMode
                                        ? 'bg-[#1E293B] text-white border-[#475569] focus:bg-[#243447]'
                                        : 'bg-[#F9FAFB] border-[#E5E7EB] focus:bg-white'
                                }`}
                            />

                            <div className='flex gap-3 pt-2'>
                                <button
                                    type='button'
                                    onClick={closeModal}
                                    className={`flex-1 py-2 rounded-lg transition ${
                                        darkMode
                                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                            : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                                >
                                    {t('common.cancel')}
                                </button>

                                <button
                                    type='submit'
                                    className='flex-1 py-2 text-white rounded-lg'
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

export default TeacherMeals
