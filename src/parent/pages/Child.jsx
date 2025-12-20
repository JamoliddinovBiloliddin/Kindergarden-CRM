import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Calendar, Phone } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'

const ParentChild = () => {
  const { user } = useAuth()
  const { darkMode, currentTheme } = useTheme()
  const themeColor = (currentTheme && currentTheme.primary) || '#2563EB'
  const themeHover = (currentTheme && currentTheme.primaryHover) || '#1D4ED8'

  const [child, setChild] = useState(null)

  useEffect(() => {
    const children = JSON.parse(localStorage.getItem('children') || '[]')
    const foundChild = children.find((c) => c.id === user?.childId)
    setChild(foundChild)
  }, [user])

  if (!child) {
    return (
      <div className='flex items-center justify-center h-64'>
        <p className='text-gray-500'>Bola ma'lumotlari topilmadi</p>
      </div>
    )
  }

  // Card va text ranglari
  const cardBg = darkMode ? 'bg-[#1E293B]' : 'bg-white'
  const cardBorder = darkMode ? 'border-[#334155]' : `4px solid ${themeColor}`
  const textPrimary = darkMode ? 'text-white' : 'text-gray-800'
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500'

  return (
    <div className='space-y-6'>
      {/* Sarlavha */}
      <h1 className={`text-3xl font-bold transition-colors duration-300 ${textPrimary}`}>
        Bolam
      </h1>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${cardBg} rounded-xl shadow-sm p-6`}
		style={{
			borderTop: darkMode ? undefined : `4px solid ${themeColor}`
		}}
      >
        <div className='flex items-start gap-6'>
		<div
  className='w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold'
  style={{
    backgroundColor: darkMode ? themeColor : themeColor,
    borderTop: darkMode ? '4px solid ${themeColor}' : `4px solid ${themeColor}`
  }}
>
  {child.name.charAt(0)}
</div>

          <div className='flex-1'>
            <h2 className={`text-2xl font-bold mb-4 ${textPrimary}`}>{child.name}</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='flex items-center gap-3'>
                <Calendar className='w-5 h-5 text-gray-400' />
                <div>
                  <p className={`text-sm ${textSecondary}`}>Yoshi</p>
                  <p className='font-semibold'>{child.age} yosh</p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <Users className='w-5 h-5 text-gray-400' />
                <div>
                  <p className={`text-sm ${textSecondary}`}>Guruh</p>
                  <p className='font-semibold'>{child.group}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ParentChild
