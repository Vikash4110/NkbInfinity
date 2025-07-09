'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function InitialLoader() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + (10 + Math.random() * 15)
      })
    }, 100)

    const handleLoad = () => {
      setProgress(100)
      setTimeout(() => setIsLoading(false), 2000)
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
      return () => window.removeEventListener('load', handleLoad)
    }

    return () => clearInterval(interval)
  }, [])

  if (!isLoading) return null

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-blue-900"
    >
      {/* Animated Typography */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200 mb-2">
          NKBIIINFINITY
        </h1>
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
        />
      </motion.div>

      {/* Tech-inspired Progress Bar */}
      <div className="w-72 max-w-full h-2 bg-gray-700 rounded-full overflow-hidden mt-8 mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
          className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 relative"
        >
          <motion.div
            className="absolute right-0 top-0 h-full w-1 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        </motion.div>
      </div>

      {/* Percentage with digital font */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-blue-300 font-mono font-medium text-xl mb-6"
      >
        {progress.toFixed(0)}%
      </motion.p>

      {/* Animated dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex space-x-2"
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-blue-400 rounded-full"
            animate={{
              y: [0, -5, 0],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </motion.div>

      {/* Subtle tech message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-center"
      >
        <p className="text-blue-400 text-sm font-light tracking-wider">
          INITIALIZING SYSTEMS
        </p>
      </motion.div>
    </motion.div>
  )
}