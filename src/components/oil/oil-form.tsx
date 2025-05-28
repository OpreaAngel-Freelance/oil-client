'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { OilType, OilResourceCreate, OilResourceUpdate } from '@/types/oil'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { motion, AnimatePresence } from 'framer-motion'

const formSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  price: z.number().positive('Price must be greater than 0'),
  type: z.nativeEnum(OilType),
  oil_document_url: z.string().url().optional().or(z.literal('')),
})

type OilFormData = OilResourceCreate | OilResourceUpdate

interface OilFormProps<T extends OilFormData> {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: T) => Promise<void>
  initialData?: Partial<OilResourceCreate>
  mode: 'create' | 'update'
}

export function OilForm<T extends OilFormData>({ open, onOpenChange, onSubmit, initialData, mode }: OilFormProps<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: initialData?.date || format(new Date(), 'yyyy-MM-dd'),
      price: initialData?.price || 0,
      type: initialData?.type || OilType.PETROL,
      oil_document_url: initialData?.oil_document_url || '',
    },
  })

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      const data = {
        ...values,
        oil_document_url: values.oil_document_url || null,
      }
      await onSubmit(data as T)
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0, y: -20 }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="oil-form-dialog w-[calc(100vw-2rem)] max-w-[425px] mx-4 sm:mx-auto">
        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <DialogHeader>
            <motion.div variants={itemVariants}>
              <DialogTitle className="oil-form-title">{mode === 'create' ? 'Create Oil Resource' : 'Update Oil Resource'}</DialogTitle>
            </motion.div>
            <motion.div variants={itemVariants}>
              <DialogDescription className="oil-form-description">
                {mode === 'create' ? 'Add a new oil resource record' : 'Update oil resource details'}
              </DialogDescription>
            </motion.div>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="oil-form-container space-y-4">
            <motion.div className="oil-form-field-group space-y-2" variants={itemVariants}>
              <Label htmlFor="date" className="oil-form-label">Date</Label>
              <motion.div
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Input
                  id="date"
                  type="date"
                  {...form.register('date')}
                  className={`oil-form-date-input ${form.formState.errors.date ? 'border-destructive' : ''}`}
                />
              </motion.div>
              <AnimatePresence>
                {form.formState.errors.date && (
                  <motion.p 
                    className="oil-form-error-message text-sm text-destructive"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {form.formState.errors.date.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          
            <motion.div className="oil-form-field-group space-y-2" variants={itemVariants}>
              <Label htmlFor="price" className="oil-form-label">Price</Label>
              <motion.div
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  {...form.register('price', { valueAsNumber: true })}
                  className={`oil-form-price-input ${form.formState.errors.price ? 'border-destructive' : ''}`}
                />
              </motion.div>
              <AnimatePresence>
                {form.formState.errors.price && (
                  <motion.p 
                    className="oil-form-error-message text-sm text-destructive"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {form.formState.errors.price.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          
            <motion.div className="oil-form-field-group space-y-2" variants={itemVariants}>
              <Label htmlFor="type" className="oil-form-label">Type</Label>
              <motion.div
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Select
                  value={form.watch('type')}
                  onValueChange={(value) => form.setValue('type', value as OilType)}
                >
                  <SelectTrigger id="type" className="oil-form-type-select">
                    <SelectValue placeholder="Select oil type" />
                  </SelectTrigger>
                  <SelectContent className="oil-form-select-content">
                    <SelectItem value={OilType.PETROL} className="oil-form-select-item">Petrol</SelectItem>
                    <SelectItem value={OilType.DIESEL} className="oil-form-select-item">Diesel</SelectItem>
                    <SelectItem value={OilType.CRUDE} className="oil-form-select-item">Crude</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            </motion.div>
          
            <motion.div className="oil-form-field-group space-y-2" variants={itemVariants}>
              <Label htmlFor="oil_document_url" className="oil-form-label">Document URL (optional)</Label>
              <motion.div
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Input
                  id="oil_document_url"
                  type="url"
                  {...form.register('oil_document_url')}
                  placeholder="https://..."
                  className="oil-form-url-input"
                />
              </motion.div>
            </motion.div>
          
            <motion.div variants={itemVariants}>
              <DialogFooter className="oil-form-footer">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="oil-form-cancel-button">
                    Cancel
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button type="submit" disabled={isSubmitting} className="oil-form-submit-button">
                    <motion.span
                      key={isSubmitting ? 'saving' : 'idle'}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
                    </motion.span>
                  </Button>
                </motion.div>
              </DialogFooter>
            </motion.div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}