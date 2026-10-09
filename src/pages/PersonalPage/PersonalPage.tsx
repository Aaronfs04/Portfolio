import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import './PersonalPage.css';

// Low-res blurred placeholder generated directly from FotoFormal2.png (1.2KB instant base64)
const PHOTO_BLUR_PLACEHOLDER =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAtACADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD712YNfFH7Vv7c2r/DjxnceD/AtrayX1kwjvL+5iM373HMcaDjjPJPfjHFfbuAfrXy9oXwC0/w38Y/E3i46Rbas2oalLK0t1EJfs8bkMQoLDbyTzhifQVVWoqcbs2oUXXlyo8h/Zn/AG+vE3ib4jaV4P8AiRpyQ/2wwhsr+K1MDLKThA69CG6ZA44r71ZSK+bfiT8Ll8deOPDOqXGnW1rZ6PrFtc2tykCq6hJVLruDEnKqRgqOcYr6YcY5qKNX2quViaDoSt0FD46VxHi69gtNSe2hZy08atcpboJHjG75WK4PDYI/Cvi74tf8FLr+Y3Vl4A0NLSIMypq2qfO7D+8sI4X/AIET9K2f2Kfj5Pr2j/E7VPH+vO92sljfHULlC+3cWiK4UfKn3BwMDg1pVpOpBpbk4asqNVSb0Pp3wxe2t74oh06ZpRbxtJJALuMRGWXGSqrgdBk/hXp7txXwL+2x8eIpfA/gGfwPqc8NxPqU+oxarADGxMIEY2HuN0kgPqVI6Vz3wj/4KQeJNHFvZ+PNMh16zGFbULMCG5UdyV+4/CAWlRpOnBX3ZWLr+2qtp6I+LEcOWU9iQa9L+DfxQl8B2XjHT4oxI3iLSG0r58bUJljcsc/7Cvj3IryKK6c6tcRfwhVb8f8itawBOqWyg7dzoc/iK7IvW6POZ6/+0f49i8WXXgfTrZIoYdE8M2ViYoBhFmKl5Tj1JbJ968ZnuRGgQHkkAVJqF29zqV3I5yQeMnPr/gKxEmaTUoUJ4yx/SlJ3YI//9k=';

export interface PersonalPageProps {
  isOpen: boolean;
  onScroll?: (scrollY: number) => void;
}

export function PersonalPage({ isOpen, onScroll }: PersonalPageProps) {
  const [isPhotoLoaded, setIsPhotoLoaded] = useState(false);
  const photoRef = useRef<HTMLImageElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const targetScroll = useRef(0);
  const prevIsOpen = useRef(isOpen);

  // Check if image is already loaded/cached when page opens
  useEffect(() => {
    if (photoRef.current && photoRef.current.complete && photoRef.current.naturalWidth > 0) {
      setIsPhotoLoaded(true);
    }
  }, [isOpen]);

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

  const isInitialMount = useRef(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      isInitialMount.current = false;
    }, 3000); // After the initial animation sequence
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="pi-page-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.9, 
            ease: [0.22, 1, 0.36, 1],
            delay: isInitialMount.current ? 2.4 : 0 
          }}
        >
          {/* Right Stage: Personal Photo Card (same container & size as Project Card) */}
          <div className="pi-fixed-stage">
            <motion.div
              className="pi-photo-card"
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ 
                duration: 0.9, 
                ease: [0.22, 1, 0.36, 1],
                delay: isInitialMount.current ? 2.6 : 0
              }}
            >
              {/* Blurred placeholder of the same personal photo (shows immediately while loading) */}
              <img
                src={PHOTO_BLUR_PLACEHOLDER}
                alt="Aaron Faustine Placeholder"
                className={`pi-photo-img pi-photo-blur ${isPhotoLoaded ? 'pi-photo-blur-hidden' : ''}`}
                aria-hidden="true"
              />

              {/* High-res personal photo with smooth fade-in & unblur transition */}
              <img
                ref={photoRef}
                src="/assets/Personal/FotoFormal2.png"
                alt="Aaron Faustine"
                className={`pi-photo-img pi-photo-full ${isPhotoLoaded ? 'pi-loaded' : 'pi-loading'}`}
                onLoad={() => setIsPhotoLoaded(true)}
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
                transition={{ 
                  duration: 0.9, 
                  ease: [0.22, 1, 0.36, 1],
                  delay: isInitialMount.current ? 2.7 : 0 
                }}
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

              {/* Mobile-only Photo Card placed at the bottom */}
              <div className="pi-mobile-photo" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: 0, paddingBottom: '10vh' }}>
                <motion.div
                  className="pi-photo-card"
                  initial={{ opacity: 0, scale: 0.92, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 30 }}
                  transition={{ 
                    duration: 0.9, 
                    ease: [0.22, 1, 0.36, 1],
                    delay: isInitialMount.current ? 2.6 : 0
                  }}
                >
                  <img
                    src={PHOTO_BLUR_PLACEHOLDER}
                    alt="Aaron Faustine Placeholder"
                    className={`pi-photo-img pi-photo-blur ${isPhotoLoaded ? 'pi-photo-blur-hidden' : ''}`}
                    aria-hidden="true"
                  />
                  <img
                    src="/assets/Personal/FotoFormal2.png"
                    alt="Aaron Faustine"
                    className={`pi-photo-img pi-photo-full ${isPhotoLoaded ? 'pi-loaded' : 'pi-loading'}`}
                    onLoad={() => setIsPhotoLoaded(true)}
                  />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Bottom progressive blur & fade mask overlay */}
          <motion.div
            className="pi-bottom-blur-mask"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ 
              duration: 0.9, 
              ease: [0.22, 1, 0.36, 1],
              delay: isInitialMount.current ? 2.4 : 0 
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PersonalPage;
