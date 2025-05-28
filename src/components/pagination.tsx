'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface PaginationProps {
  nextCursor?: string | null
  previousCursor?: string | null
  itemCount: number
  onCursorChange: (cursor?: string) => void
  currentCursor?: string
  className?: string
}

export function Pagination({
  nextCursor,
  previousCursor,
  itemCount,
  onCursorChange,
  currentCursor,
  className = ''
}: PaginationProps) {
  // Track current page number based on navigation
  const [currentPage, setCurrentPage] = useState(1)
  const lastCursorRef = useRef<string | undefined>(currentCursor)
  
  useEffect(() => {
    // Detect navigation direction based on cursor changes
    if (currentCursor !== lastCursorRef.current) {
      if (!currentCursor && lastCursorRef.current) {
        // Navigated back to first page
        setCurrentPage(1)
      } else if (previousCursor === lastCursorRef.current) {
        // Navigated forward
        setCurrentPage(prev => prev + 1)
      } else if (nextCursor === lastCursorRef.current) {
        // Navigated backward
        setCurrentPage(prev => Math.max(1, prev - 1))
      }
      lastCursorRef.current = currentCursor
    }
  }, [currentCursor, nextCursor, previousCursor])
  const handlePrevious = () => {
    if (previousCursor !== null) {
      onCursorChange(previousCursor || undefined)
    }
  }

  const handleNext = () => {
    if (nextCursor) {
      onCursorChange(nextCursor)
    }
  }

  return (
    <motion.div 
      className={`pagination-wrapper glass rounded-lg border border-border/50 p-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="pagination-content flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <motion.div 
          className="pagination-info flex items-center justify-center sm:justify-start gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="pagination-label text-xs text-muted-foreground">Showing</span>
          <motion.span 
            className="pagination-count px-2 py-1 rounded-md bg-primary/10 text-xs font-medium"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {itemCount} items
          </motion.span>
          <span className="pagination-page text-xs text-muted-foreground">
            • Page {currentPage}
          </span>
        </motion.div>

        <motion.div 
          className="pagination-controls flex items-center justify-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={!previousCursor}
              className="pagination-prev-button gap-1 text-xs h-8 px-3"
            >
              <motion.div
                animate={{ x: !previousCursor ? 0 : [-2, 0, -2] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ChevronLeft className="w-3 h-3" />
              </motion.div>
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </Button>
          </motion.div>

          {/* Current page indicator */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              className="pagination-page-indicator px-3 py-1 bg-primary text-primary-foreground rounded-md text-xs font-medium"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {currentPage}
            </motion.div>
          </AnimatePresence>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={!nextCursor}
              className="pagination-next-button gap-1 text-xs h-8 px-3"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
              <motion.div
                animate={{ x: !nextCursor ? 0 : [0, 2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ChevronRight className="w-3 h-3" />
              </motion.div>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}