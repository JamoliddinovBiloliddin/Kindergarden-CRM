import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Warehouse, AlertTriangle } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import { useTheme } from '../../contexts/ThemeContext'

const DirectorStorage = () => {
  const { t } = useLanguage()
  const { darkMode, currentTheme } = useTheme()
  const themeColor = (currentTheme && currentTheme.primary) || '#2563EB'
  const themeHover = (currentTheme && currentTheme.primaryHover) || '#1D4ED8'

  const [items, setItems] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    unit: 'kg',
    minAmount: ''
  })

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = () => {
    const stored = JSON.parse(localStorage.getItem('storage') || '[]')
    if (stored.length === 0) {
      const sample = [
        { id: 1, name: 'Guruch', amount: 50, unit: 'kg', minAmount: 20 },
        { id: 2, name: 'Kartoshka', amount: 15, unit: 'kg', minAmount: 20 }
      ]
      localStorage.setItem('storage', JSON.stringify(sample))
      setItems(sample)
    } else {
      setItems(stored)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingItem) {
      const updatedItems = items.map(i =>
        i.id === editingItem.id
          ? { ...i, ...formData, amount: parseFloat(formData.amount), minAmount: parseFloat(formData.minAmount) }
          : i
      )
      setItems(updatedItems)
      localStorage.setItem('storage', JSON.stringify(updatedItems))
    } else {
      const newItem = { id: Date.now(), ...formData, amount: parseFloat(formData.amount), minAmount: parseFloat(formData.minAmount) }
      const updatedItems = [...items, newItem]
      setItems(updatedItems)
      localStorage.setItem('storage', JSON.stringify(updatedItems))
    }
    setShowModal(false)
    setEditingItem(null)
    setFormData({ name: '', amount: '', unit: 'kg', minAmount: '' })
  }

  const handleDelete = (id) => {
    const updatedItems = items.filter(i => i.id !== id)
    setItems(updatedItems)
    localStorage.setItem('storage', JSON.stringify(updatedItems))
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({ name: item.name, amount: item.amount, unit: item.unit, minAmount: item.minAmount })
    setShowModal(true)
  }

  const updateAmount = (id, delta) => {
    const updated = items.map((item) =>
      item.id === id
        ? { ...item, amount: Math.max(0, item.amount + delta) }
        : item
    )
    localStorage.setItem('storage', JSON.stringify(updated))
    setItems(updated)
  }

  const cardBorder = (item) => darkMode ? 'border-[#334155]' : `4px solid ${themeColor}`
  const cardBg = darkMode ? 'bg-[#1E293B]' : 'bg-white'
  const textPrimary = darkMode ? 'text-white' : 'text-gray-800'
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500'

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className={`text-3xl font-bold transition-colors duration-300 ${textPrimary}`}>
          {t('modules.storage')}
        </h1>
        <div className='flex gap-2'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setEditingItem(null); setFormData({ name: '', amount: '', unit: 'kg', minAmount: '' }); setShowModal(true) }}
            className='flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium'
            style={{ backgroundColor: themeColor }}
            onMouseEnter={e => e.target.style.backgroundColor = themeHover}
            onMouseLeave={e => e.target.style.backgroundColor = themeColor}
          >
            <Plus className='w-5 h-5' />
            {t('storage.addItem')}
          </motion.button>
        </div>
      </div>

      {/* Storage Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {items.map(item => {
          const isLowStock = item.amount < item.minAmount
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${cardBg} rounded-xl shadow-sm border-t p-6 relative`}
              style={{ borderTop: cardBorder(item) }}
            >
              {/* Edit/Delete Buttons */}
              <div className='absolute top-3 right-3 flex gap-2'>
                <button
                  onClick={() => handleEdit(item)}
                  className='px-3 py-1 rounded font-medium text-white'
                  style={{ backgroundColor: themeColor }}
                  onMouseEnter={e => e.target.style.backgroundColor = themeHover}
                  onMouseLeave={e => e.target.style.backgroundColor = themeColor}
                >
                  O'zgartirish
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className='px-3 py-1 rounded font-medium text-white bg-red-500 hover:bg-red-600 transition-colors'
                >
                  O'chirish
                </button>
              </div>

              <div className='flex items-start justify-between mb-4'>
                <Warehouse className='w-6 h-6 text-green-500' />
                {isLowStock && <AlertTriangle className='w-5 h-5 text-orange-500' />}
              </div>
              <h3 className={`font-bold mb-2 ${textPrimary}`}>{item.name}</h3>
              <p className={`text-2xl font-bold mb-1 ${textPrimary}`}>
                {item.amount} {item.unit}
              </p>
              <p className={`text-sm mb-4 ${textSecondary}`}>
                Minimal: {item.minAmount} {item.unit}
              </p>
              {isLowStock && (
                <div className='mb-4 p-2 bg-orange-50 rounded-lg'>
                  <p className='text-xs text-orange-700 font-semibold'>
                    {t('storage.lowStock')}
                  </p>
                </div>
              )}
              <div className='flex gap-2'>
                <button
                  onClick={() => updateAmount(item.id, -1)}
                  className='flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200'
                >-</button>
                <button
                  onClick={() => updateAmount(item.id, 1)}
                  className='flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200'
                >+</button>
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
            className={`rounded-[20px] p-6 w-full max-w-md shadow-2xl border ${darkMode ? 'bg-[#1F2937] border-[#334155]' : 'bg-white border-gray-200'}`}
            style={{ borderTop: darkMode ? undefined : `4px solid ${themeColor}` }}
          >
            <h2 className='text-2xl font-bold mb-4'>
              {editingItem ? t('storage.editItem') : t('storage.addItem')}
            </h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-2'>{t('storage.foodItem')}</label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'dark:bg-[#334155] dark:border-[#475569] dark:text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  required
                />
              </div>
              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className='block text-sm font-medium mb-2'>{t('storage.amount')}</label>
                  <input
                    type='number'
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'dark:bg-[#334155] dark:border-[#475569] dark:text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2'>Birlik</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'dark:bg-[#334155] dark:border-[#475569] dark:text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  >
                    <option value='kg'>kg</option>
                    <option value='litr'>litr</option>
                    <option value='dona'>dona</option>
                  </select>
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium mb-2'>Minimal miqdor</label>
                <input
                  type='number'
                  value={formData.minAmount}
                  onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'dark:bg-[#334155] dark:border-[#475569] dark:text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  required
                />
              </div>
              <div className='flex gap-3'>
                <button
                  type='button'
                  onClick={() => setShowModal(false)}
                  className='flex-1 px-4 py-2 border rounded-lg'
                >
                  {t('common.cancel')}
                </button>
                <button
                  type='submit'
                  className='flex-1 px-4 py-2 rounded-lg text-white font-medium'
                  style={{ backgroundColor: themeColor }}
                  onMouseEnter={e => e.target.style.backgroundColor = themeHover}
                  onMouseLeave={e => e.target.style.backgroundColor = themeColor}
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

export default DirectorStorage
