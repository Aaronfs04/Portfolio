import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import './PersonalPage.css';

export interface PersonalPageProps {
  isOpen: boolean;
  onScroll?: (scrollY: number) => void;
}

export function PersonalPage({ isOpen, onScroll }: PersonalPageProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const targetScroll = useRef(0);
  const prevIsOpen = useRef(isOpen);

  // Reset scroll position to top ONLY when isOpen changes from false to true
  useEffect(() => {
    if (isOpen && !prevIsOpen.current) {
      targetScroll.current = 0;
      if (scrollRef.current) {
        gsap.killTweensOf(scrollRef.current);
        scrollRef.current.scrollTop = 0;
      }
      if (onScroll) onScroll(0);
    }
    prevIsOpen.current = isOpen;
  }, [isOpen, onScroll]);

  // GSAP Smooth Scroll: intercept wheel & keyboard events for buttery smooth easing
  useEffect(() => {
    if (!isOpen) return;

    const container = scrollRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Prevent abrupt native browser jump so GSAP controls the smooth interpolation
      e.preventDefault();

      const maxScroll = Math.max(0, container.scrollHeight - container.clientHeight);
      // Normalized delta across mouse types (notably Firefox lines vs pixels)
      const delta = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY;
      
      targetScroll.current = Math.max(0, Math.min(maxScroll, targetScroll.current + delta));

      gsap.to(container, {
        scrollTop: targetScroll.current,
        duration: 0.85,
        ease: 'power2.out',
        overwrite: 'auto',
        onUpdate: () => {
          if (onScroll) onScroll(container.scrollTop);
        },
      });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const maxScroll = Math.max(0, container.scrollHeight - container.clientHeight);
      let delta = 0;
      if (e.key === 'ArrowDown') delta = 90;
      else if (e.key === 'ArrowUp') delta = -90;
      else if (e.key === 'PageDown' || e.key === ' ') delta = 320;
      else if (e.key === 'PageUp') delta = -320;
      else return;

      e.preventDefault();
      targetScroll.current = Math.max(0, Math.min(maxScroll, targetScroll.current + delta));

      gsap.to(container, {
        scrollTop: targetScroll.current,
        duration: 0.85,
        ease: 'power2.out',
        overwrite: 'auto',
        onUpdate: () => {
          if (onScroll) onScroll(container.scrollTop);
        },
      });
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      gsap.killTweensOf(container);
    };
  }, [isOpen, onScroll]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="pi-page-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Right Stage: Personal Photo Card (same container & size as Project Card) */}
          <div className="pi-fixed-stage">
            <motion.div
              className="pi-photo-card"
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src="/assets/PersonalInfo/FotoFormal2.png"
                alt="Aaron Faustine"
                className="pi-photo-img"
              />
            </motion.div>
          </div>

          <div
            ref={scrollRef}
            className="pi-scroll-view"
            onScroll={(e) => {
              // Update targetScroll if user used touch or scrollbar
              if (!gsap.isTweening(e.currentTarget)) {
                targetScroll.current = e.currentTarget.scrollTop;
                if (onScroll) onScroll(e.currentTarget.scrollTop);
              }
            }}
          >
            <div className="pi-scroll-inner">
              {/* Spacer initial agar paragraf pertama mendarat di bawah layar & terkena blur */}
              <div className="pi-top-spacer" />

              {/* Section 1: Intro Paragraf Utama */}
              <motion.p
                className="pi-text pi-intro-text"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="pi-highlight-dark">Binus University Computer Science student,</span> passionate about building modern web applications and AI-driven solutions, with a steady drive to learn, improve, and take on new challenges.
              </motion.p>

              {/* Section 2: Penjelasan Tambahan */}
              <p className="pi-text pi-secondary-text">
                Interested in both software & AI development, and in the space where the two meet. Still learning, mostly by building.
              </p>

              {/* Section 3: Highlights & Expertise */}
              <div className="pi-recognitions-section">
                <h3 className="pi-section-title">Highlights:</h3>
                <div className="pi-highlights-list">
                  <div className="pi-highlight-item">
                    <span className="pi-hl-name">Full-Stack Web Development</span>
                    <span className="pi-hl-tag">(React, Next.js, Laravel)</span>
                  </div>
                  <div className="pi-highlight-item">
                    <span className="pi-hl-name">Creative UI/UX Design</span>
                    <span className="pi-hl-tag">(Figma, Davinci Resolve)</span>
                  </div>
                  <div className="pi-highlight-item">
                    <span className="pi-hl-name">AI & Machine Learning</span>
                    <span className="pi-hl-tag">(Intelligent Systems, LLMs)</span>
                  </div>
                  <div className="pi-highlight-item">
                    <span className="pi-hl-name">Cloud & Modern Tooling</span>
                    <span className="pi-hl-tag">(Cloudflare, CI/CD)</span>
                  </div>
                </div>
              </div>

              {/* Section 4: Availability & Location */}
              {/* Section 5: Footer */}
              <p className="pi-footer-text">
                Developed by <span className="pi-highlight-dark">Aaron Faustine</span>.
              </p>
            </div>
          </div>

          {/* Bottom progressive blur & fade mask overlay */}
          <motion.div
            className="pi-bottom-blur-mask"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PersonalPage;
