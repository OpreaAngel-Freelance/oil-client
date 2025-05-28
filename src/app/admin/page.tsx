'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { OilResourceResponse, OilResourceCreate, OilResourceUpdate } from '@/types/oil'
import { OilTable } from '@/components/oil/oil-table'
import { OilForm } from '@/components/oil/oil-form'
import { Button } from '@/components/ui/button'
import { LoadingOverlay, LoadingContainer } from '@/app/loading'
import { Plus, RefreshCw } from 'lucide-react'
import { Pagination } from '@/components/pagination'
import { useOils, useCreateOil, useUpdateOil, useDeleteOil } from '@/hooks/use-oils'
import { ROLES } from '@/constants'
import { Footer } from '@/components/footer'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const [showForm, setShowForm] = useState(false)
  const [editingOil, setEditingOil] = useState<OilResourceResponse | null>(null)
  const [cursor, setCursor] = useState<string | undefined>()

  const isAdmin = session?.roles?.includes(ROLES.ADMIN)
  const isAuthenticated = status === 'authenticated'
  const shouldFetch = isAuthenticated && isAdmin

  const { data: oilsData, isLoading, error, refetch, isFetching } = useOils(cursor, shouldFetch)
  const createMutation = useCreateOil()
  const updateMutation = useUpdateOil()
  const deleteMutation = useDeleteOil()

  // Handle authentication - AFTER all hooks
  if (status === 'loading') {
    return <LoadingOverlay />
  }

  if (status === 'unauthenticated') {
    signIn('keycloak', { callbackUrl: '/admin' })
    return <LoadingOverlay />
  }

  if (isAuthenticated && !isAdmin) {
    redirect('/')
    return <LoadingOverlay />
  }

  const handleCreate = async (data: OilResourceCreate) => {
    await createMutation.mutateAsync(data)
    setShowForm(false)
  }

  const handleUpdate = async (data: OilResourceUpdate) => {
    if (editingOil) {
      await updateMutation.mutateAsync({ id: editingOil.id, data })
      setEditingOil(null)
    }
  }

  const handleEdit = (oil: OilResourceResponse) => {
    setEditingOil(oil)
  }

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id)
  }

  if (session?.error === 'RefreshAccessTokenError') {
    redirect('/')
    return <LoadingOverlay />
  }

  // Handle error state
  if (error) {
    return (
      <motion.div 
        className="admin-error-container container mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="admin-error-content flex h-[50vh] flex-col items-center justify-center gap-4">
          <motion.h2 
            className="admin-error-title text-2xl font-semibold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Unable to load oil resources
          </motion.h2>
          <motion.p 
            className="admin-error-message text-muted-foreground"
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
            <Button onClick={() => refetch()}>Try again</Button>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  // Show loading spinner during initial data load
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
    <div className="admin-page-wrapper min-h-screen flex flex-col">
      {/* Decorative Elements */}
      <div className="admin-decorative-elements absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="admin-decorative-orb-top absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-32 h-32 sm:w-80 sm:h-80 bg-primary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="admin-decorative-orb-bottom absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-32 h-32 sm:w-80 sm:h-80 bg-accent/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>

      {/* Main Content Area */}
      <div className="admin-main-container flex-1 flex flex-col relative">
        {/* Content Wrapper with fixed padding */}
        <div className="admin-content-area flex flex-col h-full">
          {/* Fixed top padding */}
          <div className="admin-top-padding flex-shrink-0 h-20 sm:h-24 md:h-32"></div>

          {/* Scrollable content area */}
          <div className="admin-scrollable-content flex-1 overflow-y-auto px-6 sm:px-4 lg:px-8">
            <div className="admin-centered-content container mx-auto w-full max-w-7xl animate-in space-y-12 sm:space-y-6 md:space-y-8">
              {/* Hero Section - Extra spacious on mobile */}
              <motion.div 
                className="admin-hero-section text-center space-y-8 sm:space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.h1 
                  className="admin-hero-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 sm:mb-2"
                  variants={itemVariants}
                >
                  <motion.span 
                    className="admin-hero-title-gradient gradient-text inline-block"
                    initial={{ opacity: 0, rotateX: -90 }}
                    animate={{ opacity: 1, rotateX: 0 }}
                    transition={{ duration: 0.8, type: "spring" }}
                  >
                    Admin
                  </motion.span>
                  <br />
                  <motion.span 
                    className="admin-hero-title-secondary text-foreground inline-block"
                    initial={{ opacity: 0, rotateX: 90 }}
                    animate={{ opacity: 1, rotateX: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
                  >
                    Dashboard
                  </motion.span>
                </motion.h1>

                <motion.p 
                  className="admin-hero-description text-base sm:text-base text-muted-foreground max-w-md sm:max-w-lg mx-auto leading-relaxed mb-8 sm:mb-4 px-4 sm:px-0"
                  variants={itemVariants}
                >
                  Complete control over oil resources and market data. Add, edit, and manage
                  all platform resources with real-time updates.
                </motion.p>

                <motion.div 
                  className="admin-hero-actions flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-3 pt-4 sm:pt-0"
                  variants={itemVariants}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button
                      variant="secondary"
                      size="default"
                      onClick={() => {
                        console.log('Admin refresh clicked')
                        refetch()
                      }}
                      disabled={isFetching}
                      className="admin-refresh-button w-full sm:w-auto min-w-[160px] sm:min-w-[140px] h-12 sm:h-10 hover:shadow-lg transition-shadow"
                    >
                      <RefreshCw className={`admin-refresh-icon mr-2 h-5 w-5 sm:h-4 sm:w-4 ${isFetching ? 'animate-spin' : ''}`} />
                      {isFetching ? 'Updating...' : 'Refresh Data'}
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button
                      onClick={() => setShowForm(true)}
                      size="default"
                      className="admin-add-button shadow-2xl shadow-primary/20 w-full sm:w-auto min-w-[160px] sm:min-w-[140px] h-12 sm:h-10 hover:shadow-3xl hover:shadow-primary/30 transition-shadow"
                    >
                      <Plus className="admin-add-icon mr-2 h-5 w-5 sm:h-4 sm:w-4" />
                      Add New Resource
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Main Content - Extra spacious on mobile */}
              <motion.div 
                className="admin-content-wrapper space-y-10 sm:space-y-4 md:space-y-6"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                {/* Table Section with Header - Extra spacious on mobile */}
                <div className="admin-table-section flex-1 flex flex-col min-h-0 space-y-8 sm:space-y-4">
                  <motion.div 
                    className="admin-table-header text-center sm:text-left space-y-3 sm:space-y-1 mb-8 sm:mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    <h2 className="admin-table-title text-xl sm:text-lg md:text-xl lg:text-2xl font-bold">Resource Management</h2>
                    <p className="admin-table-subtitle text-base sm:text-sm text-muted-foreground px-4 sm:px-0">Complete overview and control of all oil resources</p>
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
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          isAdmin={true}
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
                        className="admin-pagination"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>

          {/* Fixed bottom padding */}
          <div className="admin-bottom-padding flex-shrink-0 h-20 sm:h-24 md:h-32"></div>
        </div>
      </div>

      <Footer />

      <AnimatePresence>
        {showForm && (
          <OilForm
            open={showForm}
            onOpenChange={setShowForm}
            onSubmit={handleCreate}
            mode="create"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingOil && (
          <OilForm
            open={!!editingOil}
            onOpenChange={(open) => !open && setEditingOil(null)}
            onSubmit={handleUpdate}
            initialData={editingOil}
            mode="update"
          />
        )}
      </AnimatePresence>
    </div>
  )
}