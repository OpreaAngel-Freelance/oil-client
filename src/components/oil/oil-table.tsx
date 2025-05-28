'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { OilResourceResponse, OilType } from '@/types/oil'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, FileText } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { motion, AnimatePresence } from 'framer-motion'

interface OilTableProps {
  oils: OilResourceResponse[]
  onEdit: (oil: OilResourceResponse) => void
  onDelete: (id: string) => void
  isAdmin: boolean
}

export function OilTable({ oils, onEdit, onDelete, isAdmin }: OilTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedOilId, setSelectedOilId] = useState<string | null>(null)

  const handleDeleteClick = (id: string) => {
    setSelectedOilId(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (selectedOilId) {
      setDeletingId(selectedOilId)
      try {
        await onDelete(selectedOilId)
      } finally {
        setDeletingId(null)
        setDeleteDialogOpen(false)
        setSelectedOilId(null)
      }
    }
  }

  const getTypeLabel = (type: OilType) => {
    switch (type) {
      case OilType.PETROL:
        return 'Petrol'
      case OilType.DIESEL:
        return 'Diesel'
      case OilType.CRUDE:
        return 'Crude'
      default:
        return type
    }
  }

  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  }

  return (
    <div className="oil-table-wrapper glass rounded-lg border border-border/50 overflow-hidden">
      <div className="oil-table-scroll-container overflow-x-auto">
        <table className="oil-table w-full min-w-[500px]">
          <thead className="oil-table-header">
            <tr className="oil-table-header-row border-b border-border/50 bg-gradient-to-r from-card/50 to-card/30">
              <th className="oil-table-header-cell oil-table-date-header h-16 sm:h-12 md:h-14 px-4 sm:px-3 md:px-6 text-left align-middle font-semibold text-foreground/80 text-sm sm:text-xs uppercase tracking-wider">
                Date
              </th>
              <th className="oil-table-header-cell oil-table-type-header h-16 sm:h-12 md:h-14 px-4 sm:px-3 md:px-6 text-left align-middle font-semibold text-foreground/80 text-sm sm:text-xs uppercase tracking-wider">
                Type
              </th>
              <th className="oil-table-header-cell oil-table-price-header h-16 sm:h-12 md:h-14 px-4 sm:px-3 md:px-6 text-left align-middle font-semibold text-foreground/80 text-sm sm:text-xs uppercase tracking-wider">
                Price
              </th>
              <th className="oil-table-header-cell oil-table-document-header hidden sm:table-cell h-16 sm:h-12 md:h-14 px-4 sm:px-3 md:px-6 text-left align-middle font-semibold text-foreground/80 text-sm sm:text-xs uppercase tracking-wider">
                Document
              </th>
              {isAdmin && (
                <th className="oil-table-header-cell oil-table-actions-header h-12 sm:h-14 px-3 sm:px-4 md:px-6 text-center sm:text-left align-middle font-semibold text-foreground/80 text-xs uppercase tracking-wider">
                  <span className="hidden sm:inline">Actions</span>
                  <span className="sm:hidden">Act</span>
                </th>
              )}
            </tr>
          </thead>
          <motion.tbody 
            className="oil-table-body divide-y divide-border/30"
            variants={tableVariants}
            initial="hidden"
            animate="visible"
          >
            {oils.length === 0 ? (
              <motion.tr 
                className="oil-table-empty-row"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <td colSpan={isAdmin ? 5 : 4} className="oil-table-empty-cell h-24 sm:h-32 text-center">
                  <div className="oil-table-empty-content flex flex-col items-center justify-center gap-2">
                    <motion.div 
                      className="oil-table-empty-icon-wrapper w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      <svg className="oil-table-empty-icon w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </motion.div>
                    <p className="oil-table-empty-message text-sm sm:text-base text-muted-foreground">No oil resources found</p>
                  </div>
                </td>
              </motion.tr>
            ) : (
              oils.map((oil, index) => (
                <motion.tr
                  key={oil.id}
                  className="oil-table-row group hover:bg-accent/5 transition-colors"
                  variants={rowVariants}
                  whileHover={{ backgroundColor: "rgba(var(--accent-rgb), 0.05)" }}
                  transition={{ duration: 0.2 }}
                >
                  <td className="oil-table-cell oil-table-date-cell px-4 sm:px-3 md:px-6 py-5 sm:py-3 align-middle">
                    <div className="oil-table-date-content flex items-center gap-3 sm:gap-2">
                      <motion.div 
                        className="oil-table-date-indicator w-2 h-2 sm:w-1.5 sm:h-1.5 rounded-full bg-gradient-to-r from-primary to-accent hidden sm:block"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="oil-table-date-text font-medium text-sm sm:text-xs">
                        {format(new Date(oil.date), 'dd/MM/yy')}
                      </span>
                    </div>
                  </td>
                  <td className="oil-table-cell oil-table-type-cell px-4 sm:px-3 md:px-6 py-5 sm:py-3 align-middle">
                    <motion.span 
                      className={`oil-table-type-badge inline-flex items-center rounded-lg sm:rounded-md px-3 py-1.5 sm:px-2 sm:py-1 text-sm sm:text-xs font-semibold
                        ${oil.type === OilType.PETROL ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 border border-blue-500/20' : ''}
                        ${oil.type === OilType.DIESEL ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-400 border border-emerald-500/20' : ''}
                        ${oil.type === OilType.CRUDE ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-400 border border-amber-500/20' : ''}
                      `}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                      {getTypeLabel(oil.type)}
                    </motion.span>
                  </td>
                  <td className="oil-table-cell oil-table-price-cell px-4 sm:px-3 md:px-6 py-5 sm:py-3 align-middle">
                    <motion.span 
                      className="oil-table-price-value text-base sm:text-sm md:text-lg font-bold gradient-text inline-block"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.05 + 0.2 }}
                    >
                      ${oil.price.toFixed(2)}
                    </motion.span>
                  </td>
                  <td className="oil-table-cell oil-table-document-cell hidden sm:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 align-middle">
                    {oil.oil_document_url ? (
                      <motion.a
                        href={oil.oil_document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="oil-table-document-link inline-flex items-center gap-2 text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors group/link"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div 
                          className="oil-table-document-icon-wrapper p-1.5 rounded-lg bg-primary/10 group-hover/link:bg-primary/20 transition-colors"
                          whileHover={{ rotate: 5 }}
                        >
                          <FileText className="oil-table-document-icon h-3 w-3 sm:h-4 sm:w-4" />
                        </motion.div>
                        <span className="oil-table-document-text font-medium">View Document</span>
                      </motion.a>
                    ) : (
                      <span className="oil-table-no-document text-xs sm:text-sm text-muted-foreground">No document</span>
                    )}
                  </td>
                  {isAdmin && (
                    <td className="oil-table-cell oil-table-actions-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 align-middle">
                      <motion.div 
                        className="oil-table-actions-wrapper flex items-center justify-center sm:justify-start gap-1"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(oil)}
                            className="oil-table-edit-button hover:bg-primary/10 hover:text-primary h-8 w-8"
                          >
                            <Pencil className="oil-table-edit-icon h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(oil.id)}
                            disabled={deletingId === oil.id}
                            className="oil-table-delete-button hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                          >
                            <Trash2 className="oil-table-delete-icon h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </motion.div>
                      </motion.div>
                    </td>
                  )}
                </motion.tr>
              ))
            )}
          </motion.tbody>
        </table>
      </div>

      <AnimatePresence>
        {deleteDialogOpen && (
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent className="oil-table-delete-dialog">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <AlertDialogHeader className="oil-table-delete-dialog-header">
                  <AlertDialogTitle className="oil-table-delete-dialog-title">Delete Oil Resource</AlertDialogTitle>
                  <AlertDialogDescription className="oil-table-delete-dialog-description">
                    Are you sure you want to delete this oil resource? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="oil-table-delete-dialog-footer">
                  <AlertDialogCancel className="oil-table-delete-cancel-button">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteConfirm} className="oil-table-delete-confirm-button">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </motion.div>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </AnimatePresence>
    </div>
  )
}