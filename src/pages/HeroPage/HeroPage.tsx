import { motion } from 'framer-motion'
import { ScrambleText } from '../../components/ScrambleText'
import { ProjectCarousel } from '../../components/ProjectCarousel'
import './HeroPage.css'

function HeroPage() {
  return (
    <section className="hero-page">
      <div className="hero-content">
        <div className="hero-title-group">
          <motion.h1 
            className="hero-title"
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={{ clipPath: 'inset(0 0% 0 0)' }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          >
            {/* Animasi teks hacker / scramble untuk nama */}
            <ScrambleText text="Aaron Faustine" delay={100} duration={1200} />
          </motion.h1>
          <motion.h2 
            className="hero-subtitle"
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={{ clipPath: 'inset(0 0% 0 0)' }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          >
            {/* Animasi teks scramble untuk profesi (sedikit terlambat/stagger) */}
            <ScrambleText text="Software Engineer • UI/UX Designer • AI Enthusiast" delay={600} duration={1000} />
          </motion.h2>
        </div>

        <motion.div 
          className="hero-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6, ease: "easeOut" }}
        >
          {/* Tombol 1: User / Profile */}
          <button className="icon-btn" aria-label="Profile">
            <svg
              className="btn-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="4.2" />
              <path d="M5.5 20.5c0-3.8 2.9-6.5 6.5-6.5s6.5 2.7 6.5 6.5" />
            </svg>
          </button>

          {/* Tombol 2: Chat Bubble dengan 2 titik persis referensi */}
          <button className="icon-btn" aria-label="Chat">
            <svg
              className="btn-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20.5a8.5 8.5 0 1 0-6.8-3.4L4 20l2.9-1.2A8.4 8.4 0 0 0 12 20.5z" />
              <circle cx="9.5" cy="11.5" r="1.1" fill="currentColor" stroke="none" />
              <circle cx="14.5" cy="11.5" r="1.1" fill="currentColor" stroke="none" />
            </svg>
          </button>
        </motion.div>
      </div>

      <ProjectCarousel />

    </section>
  )
}

export default HeroPage
