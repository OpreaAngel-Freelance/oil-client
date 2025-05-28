'use client'

import { useState } from 'react'
import { OilTable } from '@/components/oil/oil-table'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { Pagination } from '@/components/pagination'
import { useOilsPublic } from '@/hooks/use-oils'
import { LoadingOverlay } from '@/app/loading'
import { Footer } from '@/components/footer'
import { ParticleBackground } from '@/components/particle-background'
import { motion, AnimatePresence } from 'framer-motion'

export default function HomePage() {
  const [cursor, setCursor] = useState<string | undefined>()
  const { data: oilsData, isLoading, error, refetch, isFetching } = useOilsPublic(cursor)

  if (error) {
    return (
      <motion.div 
        className="home-error-container container mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="home-error-content flex h-[50vh] flex-col items-center justify-center gap-4">
          <motion.h2 
            className="home-error-title text-2xl font-semibold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Unable to load oil resources
          </motion.h2>
          <motion.p 
            className="home-error-message text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {error.message}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button onClick={() => refetch()} className="home-error-retry-button">Try again</Button>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  // Show loading spinner during initial load
  if (isLoading && !oilsData) {
    return <LoadingOverlay />
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  }


  return (
    <div className="home-page-wrapper min-h-screen flex flex-col">
      {/* Clean Particle Background - only on home page */}
      <ParticleBackground />

      {/* Main Content Area */}
      <div className="home-main-container flex-1 flex flex-col relative">
        {/* Content Wrapper with fixed padding */}
        <div className="home-content-area flex flex-col h-full">
          {/* Fixed top padding */}
          <div className="home-top-padding flex-shrink-0 h-20 sm:h-24 md:h-32"></div>

          {/* Scrollable content area */}
          <div className="home-scrollable-content flex-1 overflow-y-auto px-6 sm:px-4 lg:px-8">
            <div className="home-centered-content container mx-auto w-full max-w-7xl animate-in space-y-12 sm:space-y-6 md:space-y-8">
              {/* Hero Section - Extra spacious on mobile */}
              <motion.div 
                className="home-hero-section text-center space-y-8 sm:space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.h1 
                  className="home-hero-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 sm:mb-2"
                  variants={itemVariants}
                >
                  <motion.span 
                    className="home-hero-title-gradient gradient-text inline-block"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, type: "spring" }}
                  >
                    Global Oil
                  </motion.span>
                  <br />
                  <motion.span 
                    className="home-hero-title-secondary text-foreground inline-block"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
                  >
                    Market Intelligence
                  </motion.span>
                </motion.h1>

                <motion.p 
                  className="home-hero-description text-base sm:text-base text-muted-foreground max-w-md sm:max-w-lg mx-auto leading-relaxed mb-8 sm:mb-4 px-4 sm:px-0"
                  variants={itemVariants}
                >
                  Track real-time oil prices, analyze market trends, and make informed decisions
                  with our comprehensive resource management platform.
                </motion.p>

                <motion.div 
                  className="home-hero-actions flex items-center justify-center pt-4 sm:pt-0"
                  variants={itemVariants}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button
                      size="default"
                      onClick={() => {
                        console.log('Refresh clicked')
                        refetch()
                      }}
                      disabled={isFetching}
                      className="home-refresh-button min-w-[160px] sm:min-w-[140px] shadow-2xl shadow-primary/20 h-12 sm:h-10 hover:shadow-3xl hover:shadow-primary/30 transition-shadow"
                    >
                      <RefreshCw className={`home-refresh-icon mr-2 h-5 w-5 sm:h-4 sm:w-4 ${isFetching ? 'animate-spin' : ''}`} />
                      {isFetching ? 'Updating...' : 'Refresh Data'}
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Main Content - Extra spacious on mobile */}
              <motion.div 
                className="home-content-wrapper space-y-10 sm:space-y-4 md:space-y-6"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                {/* Table Section with Header - Extra spacious on mobile */}
                <div className="home-table-section flex-1 flex flex-col min-h-0 space-y-8 sm:space-y-4">
                  <motion.div 
                    className="home-table-header text-center sm:text-left space-y-3 sm:space-y-1 mb-8 sm:mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    <h2 className="home-table-title text-xl sm:text-lg md:text-xl lg:text-2xl font-bold">Resource Overview</h2>
                    <p className="home-table-subtitle text-base sm:text-sm text-muted-foreground px-4 sm:px-0">Comprehensive list of all oil resources and pricing data</p>
                  </motion.div>

                  {/* Table container */}
                  <motion.div 
                    className="table-container rounded-lg overflow-hidden glass border border-border/50"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    whileHover={{ 
                      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                      transition: { duration: 0.3 }
                    }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={cursor || 'initial'}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <OilTable
                          oils={oilsData?.items || []}
                          onEdit={() => {}}
                          onDelete={() => {}}
                          isAdmin={false}
                        />
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Pagination */}
                <AnimatePresence>
                  {oilsData && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: 1.4, duration: 0.4 }}
                    >
                      <Pagination
                        nextCursor={oilsData.next_cursor}
                        previousCursor={oilsData.previous_cursor}
                        itemCount={oilsData.items.length}
                        onCursorChange={setCursor}
                        currentCursor={cursor}
                        className="home-pagination"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>

          {/* Fixed bottom padding */}
          <div className="home-bottom-padding flex-shrink-0 h-20 sm:h-24 md:h-32"></div>
        </div>
      </div>

      <Footer />
    </div>
  )
}