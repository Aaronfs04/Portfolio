import { motion, AnimatePresence } from 'framer-motion'
import './PersonalPage.css'

interface PersonalPageProps {
  isOpen: boolean
}

export function PersonalPage({ isOpen }: PersonalPageProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.p 
          className="pi-bottom-text"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <strong>Software Engineer & AI Enthusiast,</strong> turning complex requirements, user needs, and messy problems into digital experiences that feel obvious and intuitive.
        </motion.p>
      )}
    </AnimatePresence>
  )
}

export default PersonalPage

