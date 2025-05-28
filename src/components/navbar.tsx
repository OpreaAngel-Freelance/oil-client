'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogOut, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface NavbarProps {
  userEmail?: string | null
  roles?: string[] | null
}

export function Navbar({ userEmail, roles }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isAdmin = roles?.includes('ROLE_ADMIN')

  const handleSignOut = () => {
    // Redirect to our custom logout endpoint that handles both NextAuth and Keycloak
    window.location.href = '/api/logout'
  }

  return (
    <>
      <motion.nav 
        className="navbar-wrapper sticky top-0 z-50 glass border-b border-border/50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="navbar-container container mx-auto px-6 sm:px-8">
          <div className="navbar-content flex h-16 sm:h-18 md:h-20 items-center justify-between">
            <div className="navbar-left-section flex items-center gap-2 sm:gap-4 md:gap-8">
              <Link
                href="/"
                className="navbar-brand-link group flex items-center gap-2 transition-all duration-300"
              >
                <motion.div 
                  className="navbar-logo-wrapper relative"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <motion.div 
                    className="navbar-logo-glow absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/30 transition-colors"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.3, 0.2]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                  <motion.div 
                    className="navbar-logo-container relative bg-gradient-to-br from-primary to-accent rounded-lg p-1.5"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <svg className="navbar-logo-icon w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C11.5 2 11 2.19 10.59 2.59L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41L10.59 21.41C11.37 22.2 12.63 22.2 13.41 21.41L21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L13.41 2.59C13 2.19 12.5 2 12 2M12 4L20 12L12 20L4 12L12 4M7 12C7 14.76 9.24 17 12 17S17 14.76 17 12H7Z" />
                    </svg>
                  </motion.div>
                </motion.div>
                <motion.span 
                  className="navbar-brand-text text-base sm:text-lg md:text-xl font-bold gradient-text"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Oil Management
                </motion.span>
              </Link>
              <AnimatePresence>
                {isAdmin && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      href="/admin"
                      className="navbar-admin-link hidden sm:flex relative px-4 py-2 text-sm font-medium text-white rounded-lg overflow-hidden group"
                    >
                      <motion.span 
                        className="navbar-admin-link-bg absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                      <span className="navbar-admin-link-content relative flex items-center gap-2">
                        <motion.svg 
                          className="navbar-admin-icon w-4 h-4" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                          whileHover={{ rotate: 180 }}
                          transition={{ duration: 0.3 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </motion.svg>
                        Admin Panel
                      </span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Menu */}
            <div className="navbar-right-section hidden sm:flex items-center gap-4">
              <AnimatePresence>
                {userEmail && (
                  <>
                    <motion.div 
                      className="navbar-user-info flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <motion.div 
                        className="navbar-user-status w-2 h-2 bg-green-400 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="navbar-user-email text-sm text-muted-foreground">{userEmail}</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSignOut}
                        className="navbar-signout-button relative group overflow-hidden"
                      >
                        <motion.span 
                          className="navbar-signout-bg absolute inset-0 bg-gradient-to-r from-destructive/0 via-destructive/10 to-destructive/0"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.5 }}
                        />
                        <LogOut className="navbar-signout-icon mr-2 h-4 w-4 relative z-10" />
                        <span className="navbar-signout-text relative z-10">Sign out</span>
                      </Button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="sm:hidden"
            >
              <Button
                variant="ghost"
                size="icon"
                className="navbar-mobile-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="navbar-mobile-menu fixed inset-x-0 top-16 sm:top-18 md:top-20 z-40 glass border-b border-border/50 sm:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <motion.div 
              className="navbar-mobile-container container mx-auto px-6 py-6 space-y-6"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {isAdmin && (
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    href="/admin"
                    className="navbar-mobile-admin-link flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-sm font-medium mobile-button"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    Admin Panel
                  </Link>
                </motion.div>
              )}
              {userEmail && (
                <>
                  <motion.div 
                    className="navbar-mobile-user flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.div 
                      className="w-2 h-2 bg-green-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-sm text-muted-foreground">{userEmail}</span>
                  </motion.div>
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button
                      variant="ghost"
                      className="navbar-mobile-signout mobile-button w-full justify-start gap-2"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </Button>
                  </motion.div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}