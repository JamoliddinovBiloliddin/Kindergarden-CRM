import { useEffect, useState, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Search, Warehouse, MapPin, Phone, Users, Layers, Maximize } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'

const STORAGE_KEY = 'branches'
const GOOGLE_MAPS_API_KEY = '' // PLACEHOLDER: Replace with valid API Key

const defaultBranches = [
  { id: 'b1', name: 'Markaziy Fillial', address: 'Toshkent, Shayxontohur', phone: '+998901234567', childrenCount: 48, groupsCount: 5, groups: ['A', 'B', 'C'], capacity: 100, lat: 41.311081, lng: 69.240562 },
  { id: 'b2', name: 'Denov Fillial', address: 'Sirdaryo, Denov', phone: '+998902345678', childrenCount: 32, groupsCount: 3, groups: ['A', 'B'], capacity: 50, lat: 41.2, lng: 69.2 }
]

function uid(prefix = '') {
  return prefix + Math.random().toString(36).slice(2, 9)
}

const mapContainerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '0.75rem'
}

const defaultCenter = {
  lat: 41.2995,
  lng: 69.2401
}

const Filial = () => {
  const { currentTheme, darkMode } = useTheme()
  const { t } = useLanguage()

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  })

  const [branches, setBranches] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : defaultBranches
    } catch (e) {
      console.warn(e)
      return defaultBranches
    }
  })

  const [query, setQuery] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [editing, setEditing] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '', address: '', phone: '',
    childrenCount: 0, groupsCount: 0, groups: '', capacity: 0,
    lat: defaultCenter.lat, lng: defaultCenter.lng
  })

  // Derive all unique groups for filter
  const allGroups = Array.from(new Set(branches.flatMap(b => b.groups || []))).sort()

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        try {
          setBranches(JSON.parse(e.newValue || '[]'))
        } catch (err) {
          console.error(err)
          setBranches([])
        }
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const persist = (next) => {
    setBranches(next)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch (e) { console.error(e) }
    window.dispatchEvent(new Event('branches:updated'))
  }

  const filtered = branches.filter(b => {
    const matchesName = b.name.toLowerCase().includes(query.toLowerCase())
    const matchesGroup = selectedGroup ? (b.groups || []).includes(selectedGroup) : true
    return matchesName && matchesGroup
  })

  const openAdd = () => {
    setEditing(null)
    setFormData({
      name: '', address: '', phone: '',
      childrenCount: 0, groupsCount: 0, groups: '', capacity: 0,
      lat: defaultCenter.lat, lng: defaultCenter.lng
    })
    setShowModal(true)
  }

  const openEdit = (b) => {
    setEditing(b.id)
    setFormData({
      name: b.name,
      address: b.address,
      phone: b.phone,
      childrenCount: b.childrenCount || 0,
      groupsCount: b.groupsCount || 0,
      groups: (b.groups || []).join(', '),
      capacity: b.capacity || 0,
      lat: b.lat || defaultCenter.lat,
      lng: b.lng || defaultCenter.lng
    })
    setShowModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return alert('Filial nomi kiriting')

    // Convert groups string to array
    const groupsArray = formData.groups.split(',').map(s => s.trim()).filter(Boolean)
    const finalData = {
      ...formData,
      groups: groupsArray,
      childrenCount: Number(formData.childrenCount),
      groupsCount: Number(formData.groupsCount),
      capacity: Number(formData.capacity),
      lat: Number(formData.lat),
      lng: Number(formData.lng)
    }

    if (editing) {
      const next = branches.map(b => b.id === editing ? { ...b, ...finalData } : b)
      persist(next)
    } else {
      const newItem = { id: uid('b'), ...finalData }
      const next = [newItem, ...branches]
      persist(next)
    }
    setShowModal(false)
  }

  const remove = (id) => {
    if (!confirm('Haqiqatdan ham o‘chirmoqchimisiz?')) return
    const next = branches.filter(b => b.id !== id)
    persist(next)
  }

  // Google Maps Handlers
  const onMapClick = useCallback((e) => {
    if (e.latLng) {
      const lat = e.latLng.lat()
      const lng = e.latLng.lng()
      setFormData(prev => ({
        ...prev,
        lat,
        lng,
        // Mock address update if no API key for geocoding
        address: prev.address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      }))
    }
  }, [])

  const themeColor = (currentTheme && currentTheme.primary) || '#2563EB'
  const themeHover = (currentTheme && currentTheme.primaryHover) || '#1D4ED8'

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`text-3xl font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}
        >
          {t('modules.filial')} <span className="ml-2 text-lg opacity-60">({branches.length})</span>
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

      <div className='flex flex-wrap items-center gap-4'>
        <div className='flex-1 relative min-w-[200px]'>
          <input
            type='text'
            placeholder='Fillial nomi bo‘yicha qidirish...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-2xl transition-colors duration-300 focus:outline-none focus:ring-2 ${darkMode
              ? 'bg-[#334155] border-[#475569] text-white focus:ring-blue-500'
              : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900 focus:ring-blue-500'
              }`}
          />
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>

        <div className='relative min-w-[200px]'>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className={`w-full px-4 py-2 border rounded-2xl appearance-none transition-colors duration-300 focus:outline-none focus:ring-2 ${darkMode
              ? 'bg-[#334155] border-[#475569] text-white focus:ring-blue-500'
              : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900 focus:ring-blue-500'
              }`}
          >
            <option value="">Barcha guruhlar</option>
            {allGroups.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Layers className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filtered.map((b, index) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -2, transition: { duration: 0.2, ease: 'easeOut' } }}
            className={`relative rounded-2xl p-6 transition-all duration-200 ${darkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E5E7EB]'
              } border shadow-[0_6px_20px_rgba(0,0,0,0.05)]`}
            style={{ borderTop: darkMode ? undefined : `4px solid ${themeColor}` }}
          >
            <div className='flex items-center justify-between mb-4'>
              <Warehouse className='w-6 h-6' style={{ color: themeColor }} />
              <div className='flex gap-2 text-xs'>
                <span className={`px-2 py-1 rounded-lg ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
                  {b.childrenCount} bolalar
                </span>
                <span className={`px-2 py-1 rounded-lg ${darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-700'}`}>
                  {b.capacity} sig'im
                </span>
              </div>
            </div>

            <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{b.name}</h3>

            <div className='space-y-2 mb-6'>
              <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
                <MapPin className='w-4 h-4' />
                <span>{b.address}</span>
              </div>
              <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
                <Phone className='w-4 h-4' />
                <span>{b.phone}</span>
              </div>
              <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
                <Layers className='w-4 h-4' />
                <span>{b.groupsCount} ta guruh</span>
              </div>
            </div>

            <div className='flex gap-3'>
              <button
                onClick={() => openEdit(b)}
                className='flex-1 px-3 py-2 text-white rounded-lg text-sm font-medium'
                style={{ backgroundColor: themeColor }}
                onMouseEnter={(e) => { e.target.style.backgroundColor = themeHover }}
                onMouseLeave={(e) => { e.target.style.backgroundColor = themeColor }}
              >
                <div className='flex items-center justify-center gap-2'>
                  <Edit2 className='w-4 h-4' />
                  {t('common.edit')}
                </div>
              </button>

              <button
                onClick={() => remove(b.id)}
                className='flex-1 px-3 py-2 text-white rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600 transition-colors'
              >
                <div className='flex items-center justify-center gap-2'>
                  <Trash2 className='w-4 h-4' />
                  {t('common.delete')}
                </div>
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
            className={`relative rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-[0_6px_20px_rgba(0,0,0,0.05)] border ${darkMode ? 'bg-[#1F293B] border-[#334155]' : 'bg-white border-[#E5E7EB]'
              }`}
            style={{ borderTop: darkMode ? undefined : `4px solid ${themeColor}` }}
          >
            <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {editing ? 'Fillialni tahrirlash' : "Yangi fillial qo'shish"}
            </h3>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='md:col-span-2'>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Xarita (Manzilni tanlang)</label>
                  <div className='rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600'>
                    {isLoaded ? (
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={{ lat: formData.lat, lng: formData.lng }}
                        zoom={12}
                        onClick={onMapClick}
                      >
                        <Marker position={{ lat: formData.lat, lng: formData.lng }} />
                      </GoogleMap>
                    ) : (
                      <div className='h-[300px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500'>
                        Loading Google Maps...
                      </div>
                    )}
                  </div>
                  <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Tanlangan manzil: <strong>{formData.address || "Xaritadan tanlang"}</strong>
                  </p>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nomi</label>
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${darkMode ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'}`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Telefon</label>
                  <input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${darkMode ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Manzil (Matn)</label>
                  <input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${darkMode ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sig'im</label>
                  <input
                    type='number'
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${darkMode ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Bolalar soni</label>
                  <input
                    type='number'
                    value={formData.childrenCount}
                    onChange={(e) => setFormData({ ...formData, childrenCount: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${darkMode ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Guruhlar soni</label>
                  <input
                    type='number'
                    value={formData.groupsCount}
                    onChange={(e) => setFormData({ ...formData, groupsCount: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${darkMode ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'}`}
                  />
                </div>
                <div className='md:col-span-2'>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Guruhlar (vergul bilan)</label>
                  <input
                    value={formData.groups}
                    onChange={(e) => setFormData({ ...formData, groups: e.target.value })}
                    placeholder='A, B, C'
                    className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${darkMode ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'}`}
                  />
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

export default Filial
