import re

hero_page_code = '''import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { ScrambleText } from '../../components/ScrambleText'
import { ProjectCarousel, PROJECTS } from '../../components/ProjectCarousel'
import { SocialButtons } from '../../components/SocialButtons'
import { PersonalPage } from '../PersonalPage/PersonalPage'

import './HeroPage.css'

const textVariants = {
  enter: (dir: number) => ({
    y: dir > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    y: dir > 0 ? -40 : 40,
    opacity: 0,
  }),
}

function HeroPage() {
  const [expandedProject, setExpandedProject] = useState<number | null>(null)
  const [hasShifted, setHasShifted] = useState(false)
  const [buttonsVisible, setButtonsVisible] = useState(false)
  const [initialEntered, setInitialEntered] = useState(false)
  const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(false)
  const [isSocialsOpen, setIsSocialsOpen] = useState(false)
  const hasOpenedProject = useRef(false)
  if (expandedProject !== null) {
    hasOpenedProject.current = true
  }

  // --- Magnetic Y Cursor untuk tombol Minimize ---
  const mouseY = useMotionValue(0)
  const springY = useSpring(mouseY, { damping: 25, stiffness: 150, mass: 0.5 })

  useEffect(() => {
    // Set posisi Y awal ke tengah layar
    mouseY.set(window.innerHeight / 2 - 26)

    const handleMouseMove = (e: MouseEvent) => {
      // Mengikuti kursor pada sumbu Y (dikurangi 26 agar tepat di tengah tombol ~52px)
      // Dibatasi agar tidak kelewatan layar menggunakan clamp nilai Y
      const minY = 20
      const maxY = window.innerHeight - 72
      const targetY = Math.max(minY, Math.min(maxY, e.clientY - 26))
      mouseY.set(targetY)
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Kata-kata scramble selesai di detik ~2.5s, lalu berhenti sejenak agar terbaca, baru bergeser santai di 3.2s
    const shiftTimer = setTimeout(() => {
      setHasShifted(true)
    }, 3200)

    // Tombol muncul bertahap tepat saat tulisan berhenti bergeser (~4.25s)
    const buttonTimer = setTimeout(() => {
      setButtonsVisible(true)
      setTimeout(() => setInitialEntered(true), 1200)
    }, 4250)

    return () => {
      clearTimeout(shiftTimer)
      clearTimeout(buttonTimer)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const activeProj = PROJECTS.find(p => p.id === expandedProject)
  const isExpanded = expandedProject !== null
  const direction = isExpanded ? 1 : -1
  const titleText = activeProj ? activeProj.title : "Aaron Faustine"
  const subtitleText = activeProj ? "freelance experience" : "Software Engineer \\u00A0•\\u00A0 AI Enthusiast"
  const isExpandedSubtitle = subtitleText === "freelance experience"

  return (
    <section className="hero-page">
      <AnimatePresence>
        {isExpanded && (
          <motion.button
            className="icon-btn shrink-btn"
            onClick={() => setExpandedProject(null)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              top: 0,
              y: springY,
              // Digeser ke kiri 2vw
              right: '49.6vw',
              zIndex: 50,
            }}
            aria-label="Minimize"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
              <polyline points="4 14 10 14 10 20" />
              <polyline points="20 10 14 10 14 4" />
              <line x1="14" y1="10" x2="21" y2="3" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      <div className="hero-content">
        <motion.div 
          className={`hero-title-group ${isExpanded ? 'expanded' : ''}`}
          initial={{ scale: 0.6, opacity: 0, x: '25vw' }}
          animate={{ 
            opacity: 1,
            scale: hasShifted ? 1 : 0.6,
            x: hasShifted ? 0 : '25vw',
            y: isExpanded ? -40 : 0
          }}
          style={{ transformOrigin: "left center" }}
          transition={{ 
            duration: hasShifted ? 2.0 : 0.4, 
            ease: [0.16, 1, 0.3, 1] 
          }}
        >
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <AnimatePresence mode="popLayout" custom={direction} initial={false}>
              <motion.div
                key={titleText}
                custom={direction}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1 className="hero-title">
                  {hasOpenedProject.current ? titleText : <ScrambleText text={titleText} delay={150} duration={2300} />}
                </h1>
              </motion.div>
            </AnimatePresence>
          </div>
          <motion.div 
            style={{ position: 'relative', overflow: 'hidden' }}
            animate={{
              height: isExpanded ? 'clamp(2.4rem, 1.4rem + 2.2vw, 3.8rem)' : 'clamp(1.2rem, 0.9rem + 0.4vw, 1.6rem)'
            }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatePresence mode="popLayout" custom={direction} initial={false}>
              <motion.div
                key={subtitleText}
                custom={direction}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2 className={`hero-subtitle ${isExpandedSubtitle ? 'expanded' : ''}`}>
                  {hasOpenedProject.current ? subtitleText : <ScrambleText text={subtitleText} delay={300} duration={2200} />}
                </h2>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* HERO BUTTONS (New Layout) */}
        
        <motion.div 
          className="hero-buttons"
          style={{ display: 'flex', gap: 'clamp(6px, 0.5vw, 10px)', position: 'relative' }}
        >
          {/* PROFILE BUTTON - ALWAYS MOUNTED */}
          <motion.button 
            layout
            className="icon-btn" 
            aria-label={isExpanded ? "Info" : "Profile"}
            onClick={isExpanded ? undefined : () => {
              if (isSocialsOpen) setIsSocialsOpen(false)
              setIsPersonalInfoOpen(true)
            }}
            initial={false}
            animate={{ 
              opacity: (buttonsVisible && !isPersonalInfoOpen) ? 1 : 0, 
              y: !buttonsVisible ? 32 : (isExpanded ? 60 : 0),
              width: (!isPersonalInfoOpen) ? 'clamp(52px, 3.8vw, 68px)' : 0,
              marginRight: (!isPersonalInfoOpen) ? 0 : 'calc(-1 * clamp(6px, 0.5vw, 10px))'
            }}
            transition={{ type: "spring", bounce: 0, duration: 0.8 }}
            style={{ 
              pointerEvents: (buttonsVisible && !isPersonalInfoOpen) ? 'auto' : 'none',
              position: 'relative',
              overflow: 'hidden',
              padding: 0
            }}
          >
            <motion.div
              animate={{ y: isExpanded ? -60 : 0 }}
              transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: 'absolute', width: 'clamp(52px, 3.8vw, 68px)', height: '100%', top: 0, left: 0 }}
            >
              <motion.div
                animate={{ opacity: isExpanded ? 0 : 1 }}
                transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
                style={{ position: 'absolute', top: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4.2" />
                  <path d="M5.5 20.5c0-3.8 2.9-6.5 6.5-6.5s6.5 2.7 6.5" />
                </svg>
              </motion.div>
              <motion.div
                animate={{ opacity: isExpanded ? 1 : 0 }}
                transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
                style={{ position: 'absolute', top: '60px', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </motion.div>
            </motion.div>
          </motion.button>

          <motion.button 
            layout
            className="icon-btn" 
            aria-label={isPersonalInfoOpen ? "Go Back" : (isSocialsOpen ? "Close" : (isExpanded ? "Visit Site" : "Chat"))}
            onClick={() => {
              if (isPersonalInfoOpen) {
                setIsPersonalInfoOpen(false)
              } else if (!isExpanded) {
                setIsSocialsOpen(!isSocialsOpen)
              }
            }}
            initial={{ opacity: 0, y: 32 }}
            animate={{ 
              opacity: buttonsVisible ? 1 : 0, 
              y: !buttonsVisible ? 32 : (isExpanded ? 60 : 0),
              backgroundColor: (isPersonalInfoOpen || isSocialsOpen) ? '#111' : '#fff',
              color: (isPersonalInfoOpen || isSocialsOpen) ? '#fff' : '#111',
              borderRadius: (isPersonalInfoOpen || isSocialsOpen) ? '50%' : '18px'
            }}
            transition={{ 
              type: "spring", 
              bounce: 0, 
              duration: 0.8,
              delay: (!initialEntered && buttonsVisible) ? 0.14 : 0
            }}
            style={{ 
              pointerEvents: buttonsVisible ? 'auto' : 'none',
              position: 'relative',
              overflow: 'hidden',
              padding: 0
            }}
          >
            {/* INNER WRAPPER FOR ROTATION */}
            <motion.div
              animate={{ rotate: isPersonalInfoOpen ? -360 : (isSocialsOpen ? -90 : 0) }}
              transition={{ type: "spring", bounce: 0, duration: 0.8 }}
              style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
            >
              {/* Back Icon (<) */}
              <motion.div
                initial={false}
                animate={{ 
                  opacity: isPersonalInfoOpen ? 1 : 0
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg style={{ width: '36%', height: '36%' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </motion.div>

              {/* Close Icon (X) */}
              <motion.div
                initial={false}
                animate={{ 
                  opacity: isSocialsOpen ? 1 : 0,
                  scale: isSocialsOpen ? 1 : 0.5
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg style={{ width: '36%', height: '36%' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </motion.div>

              {/* Chat Icon & External Link Icon (wrapper) */}
              <motion.div
                initial={false}
                animate={{ 
                  opacity: (isPersonalInfoOpen || isSocialsOpen) ? 0 : 1
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
              >
                <motion.div
                  animate={{ y: isExpanded ? -60 : 0 }}
                  transition={{ 
                    delay: !hasOpenedProject.current ? 0 : 0.1,
                    duration: 1.15, 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
                >
                  <motion.div
                    animate={{ opacity: isExpanded ? 0 : 1 }}
                    transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1], delay: !hasOpenedProject.current ? 0 : 0.1 }}
                    style={{ position: 'absolute', top: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20.5a8.5 8.5 0 1 0-6.8-3.4L4 20l2.9-1.2A8.4 8.4 0 0 0 12 20.5z" />
                      <circle cx="9.5" cy="11.5" r="1.1" fill="currentColor" stroke="none" />
                      <circle cx="14.5" cy="11.5" r="1.1" fill="currentColor" stroke="none" />
                    </svg>
                  </motion.div>
                  <motion.div
                    animate={{ opacity: isExpanded ? 1 : 0 }}
                    transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1], delay: !hasOpenedProject.current ? 0 : 0.1 }}
                    style={{ position: 'absolute', top: '60px', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.button>

          <SocialButtons isOpen={isSocialsOpen || isPersonalInfoOpen} />
        </motion.div>
      </div>

      <ProjectCarousel 
        expandedProject={expandedProject} 
        isPersonalInfoOpen={isPersonalInfoOpen}
        onProjectClick={(id) => setExpandedProject(expandedProject === id ? null : id)} 
      />

      <PersonalPage isOpen={isPersonalInfoOpen} />
    </section>
  )
}

export default HeroPage
'''

with open(r'C:\Users\Lenovo\Downloads\Portofolio\aaron-portfolio\src\pages\HeroPage\HeroPage.tsx', 'w', encoding='utf-8') as f:
    f.write(hero_page_code)

print("Restored HeroPage.tsx completely!")

