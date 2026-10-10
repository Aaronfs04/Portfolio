import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { ScrambleText } from '../../components/ScrambleText'
import { ProjectCarousel, PROJECTS, ACHIEVEMENT_DATA, PUBLICATION_DATA } from '../../components/ProjectCarousel'
import { SocialButtons } from '../../components/SocialButtons'
import { PersonalPage } from '../PersonalPage/PersonalPage'
import { Menu, Category } from '../../components/Menu/Menu'
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
  const [personalScrollY, setPersonalScrollY] = useState(0)
  const [isSocialsOpen, setIsSocialsOpen] = useState(false)
  const [isProjectInfoOpen, setIsProjectInfoOpen] = useState(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [isMobileButtonExited, setIsMobileButtonExited] = useState(false)
  
  const [activeCategory, setActiveCategory] = useState<Category>('profile')
  const [displayedCategory, setDisplayedCategory] = useState<Category>('profile')
  const [isCategoryTransitioning, setIsCategoryTransitioning] = useState(false)

  const isMobile = windowWidth <= 768;

  const isPersonalInfoOpen = activeCategory === 'profile';
  const isDisplayedPersonalInfo = displayedCategory === 'profile';

  const hasOpenedProject = useRef(false)
  if (expandedProject !== null) {
    hasOpenedProject.current = true
  }

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!isPersonalInfoOpen) {
      setPersonalScrollY(0)
    }
  }, [isPersonalInfoOpen])

  const handlePersonalScroll = useCallback((y: number) => {
    setPersonalScrollY(y)
  }, [])

  const socialTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const triggerSocialAutoOpen = useCallback((delay = 750) => {
    if (socialTimerRef.current) clearTimeout(socialTimerRef.current)
    setIsSocialsOpen(false)
    socialTimerRef.current = setTimeout(() => {
      setIsSocialsOpen(true)
    }, delay)
  }, [])

  const handleCategoryChange = (newCategory: Category) => {
    if (newCategory === displayedCategory || isCategoryTransitioning) return
    setActiveCategory(newCategory)
    setIsCategoryTransitioning(true)
    setIsMobileButtonExited(false)
    // Tetap terbuka untuk tiap perpindahan page
    setIsSocialsOpen(true)
    setTimeout(() => {
      setDisplayedCategory(newCategory)
      setIsCategoryTransitioning(false)
    }, 700)
  }

  const handleCloseProject = () => {
    setExpandedProject(null)
    setIsProjectInfoOpen(false)
    if (isMobile) {
      // Tunggu kartu selesai mengecil (360ms) dan mulai turun ke bawah, baru tombol contact naik kembali
      setTimeout(() => {
        setIsMobileButtonExited(false)
      }, 360)
      triggerSocialAutoOpen(950)
    } else {
      setIsMobileButtonExited(false)
      triggerSocialAutoOpen(550)
    }
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

    // Teks bergeser diperlambat 0.5s agar diam dulu setelah scramble selesai
    const shiftTimer = setTimeout(() => {
      setHasShifted(true)
    }, 2200)

    // Tombol muncul mengikuti pergeseran (+0.5s)
    const buttonTimer = setTimeout(() => {
      setButtonsVisible(true)
      setTimeout(() => setInitialEntered(true), 1200)
    }, 2800)

    // Buka tombol contact secara otomatis lebih cepat 0.5s (~3.5s)
    const autoOpenTimer = setTimeout(() => {
      setIsSocialsOpen(true)
    }, 3500)

    return () => {
      clearTimeout(shiftTimer)
      clearTimeout(buttonTimer)
      clearTimeout(autoOpenTimer)
      if (socialTimerRef.current) clearTimeout(socialTimerRef.current)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const isExpanded = expandedProject !== null
  const currentCategoryData = displayedCategory === 'achievement' ? ACHIEVEMENT_DATA
                            : displayedCategory === 'publication' ? PUBLICATION_DATA
                            : PROJECTS;
  const activeProj = currentCategoryData.find(p => p.id === expandedProject) || PROJECTS.find(p => p.id === expandedProject);

  const [shrinkBtnLeft, setShrinkBtnLeft] = useState<number | null>(null)

  useEffect(() => {
    if (!isExpanded || isMobile) return

    let animId: number
    const startTime = performance.now()

    const updatePosition = () => {
      const card = document.getElementById('expanded-project-card') ||
                   document.querySelector('.project-card')
      if (card) {
        const rect = card.getBoundingClientRect()
        const btn = document.querySelector('.shrink-btn')
        const btnWidth = btn ? btn.getBoundingClientRect().width : Math.max(38, Math.min(62, 10 + window.innerWidth * 0.025))
        const gap = Math.max(14, Math.min(20, window.innerWidth * 0.012)) // Pastikan padding samping rapi 14px - 20px
        setShrinkBtnLeft(rect.left - btnWidth - gap)
      }

      if (performance.now() - startTime < 1200) {
        animId = requestAnimationFrame(updatePosition)
      }
    }

    updatePosition()
    animId = requestAnimationFrame(updatePosition)

    window.addEventListener('resize', updatePosition)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', updatePosition)
    }
  }, [isExpanded, isMobile, windowWidth])
  const direction = isExpanded ? 1 : -1
  const titleText = activeProj ? activeProj.title : "Aaron Faustine"
  const subtitleText = activeProj ? (activeProj.subtitle || "Freelance Experience") : "Software Engineer \u00A0•\u00A0 UI/UX Designer \u00A0•\u00A0 AI Enthusiast"
  const isExpandedSubtitle = isExpanded

  const heroButtonsNode = (
    <motion.div 
      className="hero-buttons"
      style={{ display: 'flex', gap: 'clamp(6px, 0.5vw, 10px)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ 
          opacity: !buttonsVisible ? 0 : 1, 
          y: !buttonsVisible 
            ? 32 
            : (isMobile 
                ? (isMobileButtonExited ? 400 : 0) 
                : (isExpanded ? 60 : 0))
        }}
        transition={{ 
          duration: isMobile ? 0.55 : 0.7,
          ease: [0.22, 1, 0.36, 1],
          delay: (!initialEntered && buttonsVisible) ? 0.14 : 0
        }}
        style={{ pointerEvents: (buttonsVisible && !(isMobile && (isExpanded || isMobileButtonExited))) ? 'auto' : 'none' }}
      >
        <motion.button 
          className="icon-btn" 
          aria-label={isSocialsOpen ? "Close" : (!isMobile && isExpanded ? "Visit Site" : "Chat")}
          onClick={() => {
            if (socialTimerRef.current) clearTimeout(socialTimerRef.current)
            if (!isMobile && isExpanded) {
              if (activeProj?.link && activeProj.link !== '#') {
                window.open(activeProj.link, '_blank', 'noopener,noreferrer')
              }
            } else {
              setIsSocialsOpen(!isSocialsOpen)
            }
          }}
          animate={{ 
            backgroundColor: isSocialsOpen ? '#111111' : '#ffffff',
            borderRadius: isSocialsOpen ? '50%' : '18px',
            width: (!isMobile && isExpanded && isProjectInfoOpen) ? 'clamp(116px, 9.5vw, 136px)' : 'clamp(46px, 10px + 3vw, 72px)',
            paddingLeft: (!isMobile && isExpanded && isProjectInfoOpen) ? 'clamp(16px, 1.2vw, 22px)' : 'clamp(0px, 0vw, 0px)',
            paddingRight: (!isMobile && isExpanded && isProjectInfoOpen) ? 'clamp(16px, 1.2vw, 22px)' : 'clamp(0px, 0vw, 0px)'
          }}
          transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          style={{ 
            position: 'relative',
            overflow: 'hidden',
            paddingTop: 0,
            paddingBottom: 0
          }}
        >
          <AnimatePresence>
            {(!isMobile && isExpanded && isProjectInfoOpen) && (
              <motion.div
                key="see-live"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', fontWeight: 500, fontSize: 'clamp(0.85rem, 0.9vw, 0.95rem)', color: '#111' }}
              >
                <span>See live</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" style={{ width: 'clamp(14px, 1vw, 17px)', height: 'clamp(14px, 1vw, 17px)' }}>
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            animate={{ 
              rotate: isSocialsOpen ? -90 : 0,
              opacity: (!isMobile && isExpanded && isProjectInfoOpen) ? 0 : 1
            }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            style={{ width: 'clamp(46px, 10px + 3vw, 72px)', height: '100%', position: 'absolute', top: 0, left: 0, pointerEvents: (!isMobile && isExpanded && isProjectInfoOpen) ? 'none' : 'auto' }}
          >
            {/* Close Icon (X) - Selalu putih bersih di atas background gelap */}
            <motion.div
              initial={false}
              animate={{ 
                opacity: isSocialsOpen ? 1 : 0,
                scale: isSocialsOpen ? 1 : 0.5
              }}
              transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
              style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg style={{ width: '36%', height: '36%' }} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </motion.div>
            {/* Chat Icon & External Link Icon (wrapper) - Selalu hitam pekat di atas background putih */}
            <motion.div
              initial={false}
              animate={{ 
                opacity: isSocialsOpen ? 0 : 1
              }}
              transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
              style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
            >
              <motion.div
                animate={{ y: (!isMobile && isExpanded) ? -60 : 0 }}
                transition={{ 
                  delay: !hasOpenedProject.current ? 0 : 0.1,
                  duration: 1.15, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
              >
                <motion.div
                  animate={{ opacity: (!isMobile && isExpanded) ? 0 : 1 }}
                  transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1], delay: !hasOpenedProject.current ? 0 : 0.1 }}
                  style={{ position: 'absolute', top: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20.5a8.5 8.5 0 1 0-6.8-3.4L4 20l2.9-1.2A8.4 8.4 0 0 0 12 20.5z" />
                    <circle cx="9.5" cy="11.5" r="1.1" fill="#111111" stroke="none" />
                    <circle cx="14.5" cy="11.5" r="1.1" fill="#111111" stroke="none" />
                  </svg>
                </motion.div>
                <motion.div
                  animate={{ opacity: (!isMobile && isExpanded) ? 1 : 0 }}
                  transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1], delay: !hasOpenedProject.current ? 0 : 0.1 }}
                  style={{ position: 'absolute', top: '60px', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.button>
      </motion.div>
      <SocialButtons isOpen={buttonsVisible && isSocialsOpen} />
    </motion.div>
  );

  return (
    <section className="hero-page">
      <AnimatePresence>
        {isExpanded && (
          <motion.button
            className={`icon-btn shrink-btn ${isMobile ? 'mobile-shrink' : ''}`}
            onClick={handleCloseProject}
            initial={{ 
              opacity: 0, 
              y: isMobile ? 32 : 0, 
              scale: isMobile ? 1 : 0.8 
            }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1 
            }}
            exit={{ 
              opacity: 0, 
              y: isMobile ? 16 : 0, 
              scale: isMobile ? 1 : 0.8,
              transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] }
            }}
            transition={isMobile ? {
              duration: 0.48,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.45,
            } : {
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              position: 'fixed',
              top: isMobile ? 'auto' : 0,
              left: (!isMobile && shrinkBtnLeft !== null) ? shrinkBtnLeft : undefined,
              ...(isMobile ? {} : { y: springY }),
              zIndex: 99999,
              color: '#111111',
              backgroundColor: '#ffffff',
            }}
            whileTap={{ scale: 0.96 }}
            aria-label="Minimize"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
              <polyline points="4 14 10 14 10 20" />
              <polyline points="20 10 14 10 14 4" />
              <line x1="14" y1="10" x2="21" y2="3" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Tombol See Live khusus Mobile - Muncul naik hanya setelah social button sudah beres turun */}
      <AnimatePresence>
        {isMobile && isExpanded && activeProj?.link && activeProj.link !== '#' && (
          <motion.button
            className="icon-btn mobile-see-live-btn"
            onClick={() => {
              if (activeProj?.link && activeProj.link !== '#') {
                window.open(activeProj.link, '_blank', 'noopener,noreferrer')
              }
            }}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
            whileTap={{ scale: 0.96 }}
            aria-label="See Live"
          >
            <span>See Live</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="see-live-icon">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      <motion.div 
        className="hero-content"
        animate={{ 
          y: isPersonalInfoOpen ? -personalScrollY : 0 
        }}
        transition={{ duration: 0 }}
      >
        <motion.div 
          className={`hero-title-group ${isExpanded ? 'expanded' : ''}`}
          initial={{ 
            scale: 0.6, 
            opacity: 0, 
            x: isMobile ? 0 : '25vw', 
            y: isMobile ? '35vh' : 0 
          }}
          animate={{ 
            opacity: 1,
            scale: hasShifted ? 1 : 0.6,
            x: hasShifted ? 0 : (isMobile ? 0 : '25vw'),
            y: isExpanded ? (isMobile ? 12 : -40) : (hasShifted ? 0 : (isMobile ? '35vh' : 0))
          }}
          style={{ transformOrigin: isMobile ? "center center" : "left center" }}
          transition={{ 
            duration: hasShifted ? (isExpanded ? 1.05 : 1.4) : 0.4, 
            ease: [0.22, 1, 0.36, 1] 
          }}
        >
          {!isMobile && (
            <Menu 
              activeCategory={activeCategory} 
              setActiveCategory={handleCategoryChange} 
              isVisible={hasShifted && !isExpanded} 
              delay={initialEntered ? 0.2 : 1.2} 
            />
          )}

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
                  {hasOpenedProject.current ? titleText : <ScrambleText text={titleText} delay={150} duration={1400} />}
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
                  {hasOpenedProject.current ? subtitleText : <ScrambleText text={subtitleText} delay={300} duration={1300} />}
                </h2>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {isMobile && (
            <Menu 
              activeCategory={activeCategory} 
              setActiveCategory={handleCategoryChange} 
              isVisible={hasShifted && !isExpanded} 
              delay={initialEntered ? 0.2 : 1.2} 
            />
          )}
        </motion.div>

        {/* HERO BUTTONS (Desktop: rendered inside hero-content) */}
        {!isMobile && heroButtonsNode}
      </motion.div>

      {/* HERO BUTTONS (Mobile: sticky at root via portal) */}
      {isMobile && typeof document !== 'undefined' && createPortal(heroButtonsNode, document.body)}

      <ProjectCarousel 
        category={displayedCategory}
        isCategoryTransitioning={isCategoryTransitioning}
        expandedProject={expandedProject} 
        isPersonalInfoOpen={isDisplayedPersonalInfo}
        isProjectInfoOpen={isProjectInfoOpen}
        onProjectClick={(id) => {
          if (socialTimerRef.current) clearTimeout(socialTimerRef.current)
          if (isMobile) {
            // Step 1: Nutup dulu untuk social buttonnya
            setIsSocialsOpen(false)
            // Step 2: Tombol meluncur turun ke bawah dengan smooth dan santai (setelah selesai menutup ~350ms)
            setTimeout(() => {
              setIsMobileButtonExited(true)
            }, 350)
            // Step 3: Detail project membesar ke atas
            setTimeout(() => {
              setExpandedProject(id)
            }, 420)
          } else {
            setExpandedProject(id)
            setIsSocialsOpen(false)
          }
        }} 
        onToggleProjectInfo={() => {
          setIsProjectInfoOpen((prev) => !prev)
        }}
      />

      <PersonalPage 
        isOpen={isPersonalInfoOpen} 
        onScroll={handlePersonalScroll} 
      />
    </section>
  )
}

export default HeroPage
