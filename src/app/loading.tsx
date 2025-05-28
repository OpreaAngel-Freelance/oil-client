'use client'

import { motion } from 'framer-motion'

export function LoadingSpinner() {
  return (
    <motion.div 
      className="relative"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <motion.div 
        className="h-12 w-12 rounded-full border-2 border-primary/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        <motion.div 
          className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
      <motion.div 
        className="absolute inset-0 rounded-full bg-primary/10 blur-xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  )
}

export function LoadingOverlay() {
  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="flex flex-col items-center gap-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
      >
        <LoadingSpinner />
        <motion.p 
          className="text-sm text-muted-foreground"
          variants={textVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading...
          </motion.span>
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

export function LoadingContainer({ className = "h-64" }: { className?: string }) {
  return (
    <motion.div 
      className={`flex items-center justify-center ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <LoadingSpinner />
    </motion.div>
  )
}

export default function Loading() {
  return <LoadingOverlay />
}