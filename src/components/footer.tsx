'use client'

import { motion } from 'framer-motion'

export function Footer() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  }

  return (
    <motion.footer 
      className="footer-wrapper border-t border-border/50 bg-card/30 backdrop-blur-sm mt-auto flex-shrink-0"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="footer-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-10 lg:py-12 max-w-7xl">
        {/* Mobile-first responsive design */}
        <div className="footer-content space-y-8 sm:space-y-10 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-8 xl:gap-12">

          {/* Brand section - Full width mobile, 4 cols on desktop */}
          <motion.div 
            className="footer-brand-section text-center sm:text-left lg:col-span-4 xl:col-span-5"
            variants={itemVariants}
          >
            <div className="footer-brand-content space-y-4">
              <div className="footer-brand-header flex items-center justify-center sm:justify-start gap-3">
                <motion.div 
                  className="footer-logo-wrapper w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 360,
                    transition: { duration: 0.5 }
                  }}
                >
                  <svg className="footer-logo-icon w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C11.5 2 11 2.19 10.59 2.59L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41L10.59 21.41C11.37 22.2 12.63 22.2 13.41 21.41L21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L13.41 2.59C13 2.19 12.5 2 12 2M12 4L20 12L12 20L4 12L12 4M7 12C7 14.76 9.24 17 12 17S17 14.76 17 12H7Z" />
                  </svg>
                </motion.div>
                <h3 className="footer-brand-title font-bold text-lg sm:text-xl lg:text-2xl">Oil Intelligence</h3>
              </div>
              <p className="footer-brand-description text-sm sm:text-base lg:text-base text-muted-foreground leading-relaxed max-w-xs sm:max-w-sm lg:max-w-none mx-auto sm:mx-0">
                Your trusted partner for oil market data and analytics.
              </p>
            </div>
          </motion.div>

          {/* Links sections - Grid layout responsive */}
          <motion.div 
            className="footer-links-wrapper lg:col-span-8 xl:col-span-7"
            variants={itemVariants}
          >
            <div className="footer-links-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-8 sm:gap-6 lg:gap-8 xl:gap-12">
              {/* Resources section */}
              <motion.div 
                className="footer-resources-section text-center sm:text-left"
                variants={itemVariants}
              >
                <h4 className="footer-section-title font-semibold mb-4 sm:mb-5 text-sm sm:text-base lg:text-lg uppercase tracking-wider text-primary/80">Resources</h4>
                <ul className="footer-links-list space-y-2 sm:space-y-3 text-xs sm:text-sm lg:text-base text-muted-foreground">
                  <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <a href="#" className="footer-link hover:text-primary transition-colors inline-block py-1">Documentation</a>
                  </motion.li>
                  <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <a href="#" className="footer-link hover:text-primary transition-colors inline-block py-1">API Reference</a>
                  </motion.li>
                  <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <a href="#" className="footer-link hover:text-primary transition-colors inline-block py-1">Market Analysis</a>
                  </motion.li>
                </ul>
              </motion.div>

              {/* Company section */}
              <motion.div 
                className="footer-company-section text-center sm:text-left"
                variants={itemVariants}
              >
                <h4 className="footer-section-title font-semibold mb-4 sm:mb-5 text-sm sm:text-base lg:text-lg uppercase tracking-wider text-primary/80">Company</h4>
                <ul className="footer-links-list space-y-2 sm:space-y-3 text-xs sm:text-sm lg:text-base text-muted-foreground">
                  <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <a href="#" className="footer-link hover:text-primary transition-colors inline-block py-1">About Us</a>
                  </motion.li>
                  <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <a href="#" className="footer-link hover:text-primary transition-colors inline-block py-1">Contact</a>
                  </motion.li>
                  <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <a href="#" className="footer-link hover:text-primary transition-colors inline-block py-1">Careers</a>
                  </motion.li>
                </ul>
              </motion.div>

              {/* Support section - Hidden on smallest mobile */}
              <motion.div 
                className="footer-support-section hidden sm:block text-center sm:text-left col-span-2 sm:col-span-1"
                variants={itemVariants}
              >
                <h4 className="footer-section-title font-semibold mb-4 sm:mb-5 text-sm sm:text-base lg:text-lg uppercase tracking-wider text-primary/80">Support</h4>
                <ul className="footer-links-list space-y-2 sm:space-y-3 text-xs sm:text-sm lg:text-base text-muted-foreground">
                  <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <a href="#" className="footer-link hover:text-primary transition-colors inline-block py-1">Help Center</a>
                  </motion.li>
                  <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <a href="#" className="footer-link hover:text-primary transition-colors inline-block py-1">Community</a>
                  </motion.li>
                  <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <a href="#" className="footer-link hover:text-primary transition-colors inline-block py-1">Status</a>
                  </motion.li>
                </ul>
              </motion.div>
            </div>
          </motion.div>

          {/* Bottom section - Full width */}
          <motion.div 
            className="footer-bottom-section pt-8 sm:pt-10 lg:pt-12 border-t border-border/50 lg:col-span-12"
            variants={itemVariants}
          >
            <div className="footer-bottom-content flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
              <motion.div 
                className="footer-legal-links flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4 lg:gap-6 text-xs sm:text-sm text-muted-foreground"
                variants={itemVariants}
              >
                <motion.a 
                  href="#" 
                  className="footer-link hover:text-primary transition-colors py-1 px-2 sm:px-3"
                  whileHover={{ scale: 1.05 }}
                >
                  Privacy Policy
                </motion.a>
                <span className="hidden sm:inline text-muted-foreground/50">•</span>
                <motion.a 
                  href="#" 
                  className="footer-link hover:text-primary transition-colors py-1 px-2 sm:px-3"
                  whileHover={{ scale: 1.05 }}
                >
                  Terms of Service
                </motion.a>
                <span className="hidden sm:inline text-muted-foreground/50">•</span>
                <motion.a 
                  href="#" 
                  className="footer-link hover:text-primary transition-colors py-1 px-2 sm:px-3"
                  whileHover={{ scale: 1.05 }}
                >
                  Cookie Policy
                </motion.a>
              </motion.div>
              <motion.p 
                className="footer-copyright text-xs sm:text-sm text-muted-foreground text-center sm:text-right"
                variants={itemVariants}
              >
                &copy; 2024 Oil Intelligence. All rights reserved.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  )
}