import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ProjectPage, Project } from '../pages/ProjectPage/ProjectPage';

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Linear Design',
    subtitle: 'Freelance Experience',
    bg: '/assets/Linear/backgorundLinear.webp',
    video: '/assets/Linear/VideoLinear.mp4',
    tag: 'Information',
    description: "A business portfolio website for Linear Studio, a multidisciplinary studio spanning architecture, interior, and graphic design.",
    role: "Frontend Developer, UI/UX Designer",
    status: "Completed",
    tech: "Next.js, React, TypeScript, GSAP, CSS Modules, ImageKit, Cloudflare Pages, GitHub Actions",
    link: import.meta.env.VITE_PROJECT_LINEAR_URL || 'https://halolinear.com',
  },
  {
    id: 2,
    title: 'Draw it',
    subtitle: 'Class Project',
    bg: '/assets/DeepLearning/Background.png',
    video: '/assets/DeepLearning/DeepLearning.mp4',
    tag: 'Information',
    description: 'A multiplayer drawing game that uses a deep learning model to recognize sketches and score them in real time.',
    role: "AI Developer",
    status: "On progress",
    tech: "Python, TensorFlow, PyTorch",
    link: import.meta.env.VITE_PROJECT_DEEP_LEARNING_URL || 'https://draw-it-right.vercel.app/',
  },
  {
    id: 3,
    title: 'Skinmate',
    subtitle: 'Class Project',
    bg: '#847E61', // Hijau lumut (Moss Green)
    video: '/assets/skinmate/Skinmate_Video.mp4',
    tag: 'Information',
    description: 'A software application leveraging computer vision and deep learning models for facial image analysis to automatically detect and classify acne and skin conditions.',
    role: "Frontend Developer, Logo Designer",
    status: "Completed (Database Disconected)",
    tech: "Typescript, Vite, CSS, React",
    link: import.meta.env.VITE_PROJECT_SKINMATE_URL || 'https://skinmateai.vercel.app/',
  },
  {
    id: 4,
    title: 'Brain Tumor Classification',
    subtitle: 'Class Project',
    bg: '#1a1a1a',
    video: '/assets/brainTumor/BrainTumor.mp4',
    tag: 'Information',
    description: 'A brain tumor classifier (95.19% accuracy) that shows its reasoning through heatmaps, helping clinicians verify and trust AI-assisted MRI analysis.',
    role: "AI Developer",
    status: "Completed",
    tech: "Python, EfficientNetB1, Grad-CAM, CNN",
    link: import.meta.env.VITE_PROJECT_BRAIN_TUMOR_URL || 'https://github.com/Aaronfs04/Brain_Tumor',
  }
];

export const ACHIEVEMENT_DATA: Project[] = [
  {
    id: 101,
    title: '',
    bg: '',
    video: '',
  },
  {
    id: 102,
    title: '',
    bg: '',
    video: '',
  }
];

export const PUBLICATION_DATA: Project[] = [
  {
    id: 201,
    title: 'Brain Tumor Paper',
    subtitle: 'Publication',
    bg: '/assets/PublishBrainTumor/PaperCerti.webp',
    bgFit: 'contain',
    bgColor: '#ffffff',
    bgPadding: '10%',
    disableProgressive: true,
    video: '',
    tag: 'Publication',
    description: 'Publication certificate for Brain Tumor Classification.',
    link: import.meta.env.VITE_PUBLICATION_BRAIN_TUMOR_URL || 'https://share.google/AjBVxxEphOc2bXrbu',
  }
];

export interface ProjectCarouselProps {
  expandedProject?: number | null;
  onProjectClick?: (id: number) => void;
  onToggleProjectInfo?: () => void;
  isPersonalInfoOpen?: boolean;
  isProjectInfoOpen?: boolean;
  category?: 'profile' | 'project' | 'achievement' | 'publication';
  isCategoryTransitioning?: boolean;
}

export function ProjectCarousel({ 
  expandedProject = null, 
  onProjectClick,
  onToggleProjectInfo,
  isPersonalInfoOpen = false,
  isProjectInfoOpen = false,
  category = 'project',
  isCategoryTransitioning = false
}: ProjectCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const isScrolling = useRef(false);

  // Responsiveness state
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [windowHeight, setWindowHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800);
  const isMobile = windowWidth <= 768;

  // Track state saat memperkecil kartu di mobile (mengecil dulu -> baru turun kebawah)
  const [lastExpanded, setLastExpanded] = useState<number | null>(expandedProject);
  const [isMobileShrinking, setIsMobileShrinking] = useState(false);

  if (lastExpanded !== expandedProject) {
    if (isMobile && lastExpanded !== null && expandedProject === null) {
      setIsMobileShrinking(true);
    } else {
      setIsMobileShrinking(false);
    }
    setLastExpanded(expandedProject);
  }

  useEffect(() => {
    if (isMobileShrinking) {
      const timer = setTimeout(() => {
        setIsMobileShrinking(false);
      }, 850);
      return () => clearTimeout(timer);
    }
  }, [isMobileShrinking]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Parallax & Tilt Hover State ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Pergeseran KESELURUHAN kartu berlawanan arah mouse (flat 2D, tanpa efek 3D antar layer)
  const cardX = useTransform(springX, [-200, 200], [20, -20]);
  const cardY = useTransform(springY, [-200, 200], [20, -20]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Hitung posisi mouse relatif terhadap tengah container
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const isFirstRender = useRef(true);
  useEffect(() => {
    // Set to false after a slight delay to cover initial mount
    const timer = setTimeout(() => {
      isFirstRender.current = false;
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const currentData = category === 'achievement' ? ACHIEVEMENT_DATA
                    : category === 'publication' ? PUBLICATION_DATA
                    : PROJECTS;

  // Jika jumlah project kurang dari atau sama dengan 3, kita gandakan di virtual render 
  // agar animasi melingkar (atas & bawah) memiliki elemen DOM yang cukup untuk bertransisi mulus
  const renderedProjects = currentData.length <= 3
    ? [...currentData.map(p => ({...p, renderId: p.id + '_1'})), ...currentData.map(p => ({...p, renderId: p.id + '_2'}))]
    : currentData.map(p => ({...p, renderId: p.id.toString()}));

  const isAnyExpanded = expandedProject !== null;
  const activeExpandedProj = isAnyExpanded
    ? (currentData.find(p => p.id === expandedProject) || PROJECTS.find(p => p.id === expandedProject))
    : null;

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling.current || expandedProject !== null || isPersonalInfoOpen) return;

      if (e.deltaY > 40) {
        // Scroll down -> next project
        isScrolling.current = true;
        setActiveIndex((prev) => (prev + 1) % renderedProjects.length);
        setTimeout(() => (isScrolling.current = false), 1000);
      } else if (e.deltaY < -40) {
        // Scroll up -> prev project
        isScrolling.current = true;
        setActiveIndex((prev) => (prev === 0 ? renderedProjects.length - 1 : prev - 1));
        setTimeout(() => (isScrolling.current = false), 1000);
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isScrolling.current || expandedProject !== null || isPersonalInfoOpen) return;
      const touchEndY = e.touches[0].clientY;
      const diffY = touchStartY - touchEndY;
      
      if (diffY > 40) { // Swipe up -> next
        isScrolling.current = true;
        setActiveIndex((prev) => (prev + 1) % renderedProjects.length);
        setTimeout(() => (isScrolling.current = false), 1000);
      } else if (diffY < -40) { // Swipe down -> prev
        isScrolling.current = true;
        setActiveIndex((prev) => (prev === 0 ? renderedProjects.length - 1 : prev - 1));
        setTimeout(() => (isScrolling.current = false), 1000);
      }
    };

    window.addEventListener('wheel', handleWheel);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [activeIndex, expandedProject, isPersonalInfoOpen, renderedProjects.length]);

  // Fungsi untuk mendapatkan perbedaan indeks secara melingkar (circular)
  const getWrappedDiff = (i: number, active: number, length: number) => {
    let diff = i - active;
    if (diff < -length / 2) diff += length;
    if (diff > length / 2) diff -= length;
    return diff;
  };

  return (
    <>
      {/* Bagian Kanan: Project Carousel */}
      <motion.div
        className={`hero-projects ${isMobile && isAnyExpanded ? 'expanded-mobile' : ''}`}
        style={{ 
          perspective: 1200,
          marginLeft: isMobile ? 0 : '-4vw',
          pointerEvents: isPersonalInfoOpen ? 'none' : 'auto'
        }}
        initial={{ y: '-100vh', rotateX: -80, scale: 0.9, opacity: 0 }}
        animate={{ y: 0, rotateX: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1], delay: 3.0 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div style={{ position: 'relative', width: windowWidth <= 768 ? 'clamp(230px, 68vw, 290px)' : 'clamp(260px, 24vw, 420px)', aspectRatio: '1 / 1', transformStyle: 'preserve-3d' }}>
          {renderedProjects.map((proj, i) => {
            const diff = getWrappedDiff(i, activeIndex, renderedProjects.length);
            const isActive = diff === 0;

            const isMobile = windowWidth <= 768;
            // Tentukan posisi 3D berdasarkan kedudukannya relatif terhadap activeIndex
            // Menggunakan radius 225 dan sudut 52deg di mobile agar tumpukan atas & bawah lebih renggang/melebar secara proporsional
            const radius = isMobile ? 225 : (windowWidth < 1024 ? 320 : (windowWidth < 1440 ? 360 : (windowWidth < 1600 ? 420 : 540)));
            const anglePerCard = isMobile ? 52 : 75; // Sudut per kartu dalam derajat
            const angle = diff * anglePerCard;
            const angleRad = angle * (Math.PI / 180);

            // Hitung posisi Y dan Z di permukaan silinder
            const y = radius * Math.sin(angleRad);
            // Z dihitung relatif terhadap bagian depan silinder (agar diff=0 memiliki z=0)
            const z = radius * Math.cos(angleRad) - radius;
            const rotateX = angle;

            const isExpanded = expandedProject === proj.id && isActive;
            const isAnyExpanded = expandedProject !== null;

            // Kartu di luar tumpukan aktif dan peeking (diff >= 2) disembunyikan sepenuhnya agar TIDAK ADA kartu di belakang kartu utama
            const isTooFar = Math.abs(diff) >= 2;

            // Opacity: hanya diff 0 (aktif) dan diff ±1 (tumpukan atas & bawah) yang tampil
            let opacity = isTooFar ? 0 : (Math.abs(diff) === 1 ? (isMobile ? 0.78 : 0.75) : 1);
            if (isAnyExpanded && !isExpanded) opacity = 0;
            if (isPersonalInfoOpen) opacity = 0;
            
            // Z-index agar kartu yang aktif atau expanded selalu di atas
            const zIndex = isExpanded ? 50 : (10 - Math.abs(diff));

            // Jika expanded atau personal info open, timpa nilai transformasi
            let animX: number | string = 0;
            if (isExpanded) {
              if (isMobile) animX = 0;
              else if (windowWidth <= 1024) animX = '-4vw';
              else if (windowWidth <= 1440) animX = '0vw';
              else animX = '2vw';
            }
            let animY: number | string = isExpanded ? 0 : y;
            let animZ = isExpanded ? (isMobile ? 0 : 150) : z;
            let animRotateX = isExpanded ? 0 : rotateX;
            let animScale = isExpanded 
              ? (isMobile ? 1 : (windowWidth <= 1024 ? 1.55 : (windowWidth <= 1366 ? 1.6 : 1.75))) 
              : (isActive ? 1 : 0.95);

            const mobileExitDistance = Math.round(Math.max(windowHeight * 0.9, 700));

            // Transisi khusus mobile saat project detail dibuka/ditutup:
            // 1. Tumpukan atas (diff < 0) langsung geser keluar ke atas tanpa glitch
            // 2. Tumpukan bawah (diff > 0) langsung geser keluar ke bawah tanpa glitch
            // 3. Gambar tengah (isActive & isExpanded) naik ke atas dan melebar ke samping secara perlahan (ukuran persis seperti sebelumnya)
            if (isMobile && isAnyExpanded) {
              if (isExpanded) {
                animY = -90; // Naik ke posisi media card atas dengan jarak aman dari judul atas
                animScale = 1; // Melebar ke samping via width & height, bukan diperbesar keseluruhan
                animRotateX = 0;
                animZ = 0;
              } else if (diff < 0) {
                animY = -mobileExitDistance; // Tumpukan atas langsung geser keluar ke atas tanpa glitch
              } else if (diff > 0) {
                animY = mobileExitDistance; // Tumpukan bawah langsung geser keluar ke bawah tanpa glitch
              }
            }

            if (isPersonalInfoOpen || isCategoryTransitioning) {
              if (isActive) {
                animX = isMobile ? '135vw' : '100vw'; // Keluar sepenuhnya dari frame ke kanan
              } else if (diff < 0) {
                animY = '-100vh'; // Tumpukan atas keluar sepenuhnya ke atas
              } else if (diff > 0) {
                animY = '100vh'; // Tumpukan bawah keluar sepenuhnya ke bawah
              }
            }

            return (
              <motion.div
                key={proj.renderId}
                className="project-card-slot"
                initial={isFirstRender.current ? false : {
                  x: isActive ? (isMobile ? '135vw' : '100vw') : 0,
                  y: isActive ? 0 : (diff < 0 ? '-100vh' : '100vh'),
                  z: z,
                  rotateX: rotateX,
                  scale: animScale,
                  opacity: opacity,
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: isTooFar ? 'none' : 'flex',
                  visibility: isTooFar ? 'hidden' : 'visible',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transformOrigin: 'center center',
                  pointerEvents: (!isPersonalInfoOpen && !isCategoryTransitioning && !isTooFar && (isActive || isExpanded)) ? 'auto' : 'none',
                  cursor: (!isPersonalInfoOpen && !isCategoryTransitioning && (isActive || isExpanded)) ? 'pointer' : 'default',
                }}
                onClick={() => {
                  if (isPersonalInfoOpen || isCategoryTransitioning) return;
                  if (isExpanded) {
                    if (!isMobile && onToggleProjectInfo) {
                      onToggleProjectInfo();
                    }
                  } else if (isActive && onProjectClick) {
                    onProjectClick(proj.id);
                  }
                }}
                animate={{
                  x: animX,
                  y: animY,
                  z: animZ,
                  rotateX: animRotateX,
                  scale: animScale,
                  opacity: opacity,
                  zIndex: zIndex,
                }}
                transition={isCategoryTransitioning ? {
                  duration: 0.65,
                  ease: [0.32, 0, 0.24, 1]
                } : (isMobile ? (
                  isMobileShrinking ? {
                    // Tahap 2 saat menutup di mobile: Turun ke bawah setelah kartu selesai mengecil
                    y: { duration: 0.48, delay: 0.36, ease: [0.22, 1, 0.36, 1] },
                    x: { duration: 0.48, delay: 0.36, ease: [0.22, 1, 0.36, 1] },
                    z: { duration: 0.48, delay: 0.36, ease: [0.22, 1, 0.36, 1] },
                    rotateX: { duration: 0.48, delay: 0.36, ease: [0.22, 1, 0.36, 1] },
                    scale: { duration: 0.48, delay: 0.36, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 0.40, delay: 0.36, ease: [0.22, 1, 0.36, 1] },
                  } : {
                    y: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
                    x: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
                    z: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
                    rotateX: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
                    scale: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
                  }
                ) : {
                  duration: isAnyExpanded ? 1.05 : 0.85,
                  ease: [0.22, 1, 0.36, 1],
                })}
              >
                <motion.div
                  className={`project-card ${isMobile && isExpanded ? 'expanded-mobile-card' : ''} ${isExpanded ? 'is-expanded' : ''}`}
                  id={isExpanded ? "expanded-project-card" : undefined}
                  animate={{
                    width: (isMobile && isExpanded) ? 'clamp(280px, 88vw, 390px)' : '100%',
                    height: (isMobile && isExpanded) ? 'clamp(175px, 26vh, 225px)' : '100%',
                    borderRadius: (isMobile && isExpanded) ? 'clamp(22px, 5.5vw, 30px)' : 'clamp(24px, 6vw, 36px)',
                  }}
                  transition={isMobile ? (
                    isExpanded ? {
                      // Tahap 2 saat membuka di mobile: Baru membuka ke samping setelah kartu naik ke atas
                      width: { duration: 0.55, delay: 0.38, ease: [0.22, 1, 0.36, 1] },
                      height: { duration: 0.55, delay: 0.38, ease: [0.22, 1, 0.36, 1] },
                      borderRadius: { duration: 0.55, delay: 0.38, ease: [0.22, 1, 0.36, 1] },
                    } : {
                      // Tahap 1 saat menutup di mobile: Langsung mengecil duluan ke ukuran normal tanpa delay
                      width: { duration: 0.36, delay: 0, ease: [0.22, 1, 0.36, 1] },
                      height: { duration: 0.36, delay: 0, ease: [0.22, 1, 0.36, 1] },
                      borderRadius: { duration: 0.36, delay: 0, ease: [0.22, 1, 0.36, 1] },
                    }
                  ) : {
                    duration: isAnyExpanded ? 1.05 : 0.85,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    flexShrink: 0,
                    maxWidth: 'none',
                    x: (isActive && !isExpanded) ? cardX : 0,
                    y: (isActive && !isExpanded) ? cardY : 0,
                  }}
                >
                  <ProjectPage 
                    project={proj} 
                    isActive={isActive} 
                    isExpanded={isExpanded} 
                    isProjectInfoOpen={isProjectInfoOpen} 
                    onClose={() => onProjectClick && onProjectClick(proj.id)} 
                  />
                </motion.div>
              </motion.div>
            );
          })}

          {/* Card 2 di Mobile: Explanation Card di bawah gambar utama */}
          <AnimatePresence>
            {isMobile && isAnyExpanded && activeExpandedProj && (
              <motion.div
                key="mobile-expanded-info"
                className="mobile-expanded-info-card"
                initial={{ opacity: 0, clipPath: 'inset(0% 0% 100% 0% round 24px)', y: -16 }}
                animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 24px)', y: 0 }}
                exit={{ 
                  opacity: 0, 
                  clipPath: 'inset(0% 0% 100% 0% round 24px)', 
                  y: -16,
                  transition: { duration: 0.22, ease: [0.25, 1, 0.5, 1], delay: 0 } 
                }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
                style={{
                  position: 'absolute',
                  top: 'calc(50% + clamp(36px, 4.6vh, 44px))',
                  left: '50%',
                  x: '-50%',
                  transformOrigin: 'top center',
                  zIndex: 60,
                }}
              >
                <div className="mobile-expanded-info-tag">
                  {activeExpandedProj.tag || 'Information'}
                </div>
                <div className="mobile-expanded-info-body">
                  {activeExpandedProj.description && (
                    <p className="mobile-expanded-desc">
                      {activeExpandedProj.description}
                    </p>
                  )}
                  {(activeExpandedProj.role || activeExpandedProj.status || activeExpandedProj.tech) && (
                    <div className="mobile-expanded-meta">
                      {activeExpandedProj.role && (
                        <div className="mobile-meta-row">
                          <span className="mobile-meta-label">Role:</span>{' '}
                          <span className="mobile-meta-value">{activeExpandedProj.role}</span>
                        </div>
                      )}
                      {activeExpandedProj.status && (
                        <div className="mobile-meta-row">
                          <span className="mobile-meta-label">Status:</span>{' '}
                          <span className="mobile-meta-value">{activeExpandedProj.status}</span>
                        </div>
                      )}
                      {activeExpandedProj.tech && (
                        <div className="mobile-meta-row">
                          <span className="mobile-meta-label">Tools:</span>{' '}
                          <span className="mobile-meta-value">{activeExpandedProj.tech}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {activeExpandedProj.tag === 'Publication' && activeExpandedProj.bg && (
                    <a 
                      href={activeExpandedProj.bg} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="mobile-meta-row"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        marginTop: '0.5rem',
                        padding: '0.6rem 0.9rem',
                        backgroundColor: '#111111',
                        color: '#ffffff',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '0.8rem',
                        textAlign: 'center',
                        letterSpacing: '0.01em',
                      }}
                    >
                      <span>View Full Certificate</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px' }}>
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div
        className="project-pagination-dots"
        initial={{ opacity: 0, x: 20 }}
        animate={{ 
          opacity: (expandedProject || isPersonalInfoOpen || isCategoryTransitioning) ? 0 : 1, 
          x: (expandedProject || isPersonalInfoOpen || isCategoryTransitioning) ? 40 : 0 
        }}
        transition={{ 
          delay: (expandedProject || isPersonalInfoOpen || isCategoryTransitioning) ? 0 : (expandedProject === null ? 0.2 : 2.8), 
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1]
        }}
        style={{ pointerEvents: (expandedProject || isPersonalInfoOpen || isCategoryTransitioning) ? 'none' : 'auto' }}
      >
        {currentData.map((_, i) => {
          const isDotActive = (activeIndex % currentData.length) === i;
          return (
            <span
              key={i}
              className={`dot ${isDotActive ? 'active' : ''}`}
              onClick={() => {
                if (isScrolling.current || expandedProject !== null) return;
                if (isDotActive) return; // Already active
                
                isScrolling.current = true;
                
                // Calculate shortest path to the clicked dot
                setActiveIndex((prev) => {
                  const currentMod = prev % currentData.length;
                  let diff = i - currentMod;
                  // If wrapping around is shorter, adjust diff
                  if (diff > currentData.length / 2) diff -= currentData.length;
                  if (diff < -currentData.length / 2) diff += currentData.length;
                  
                  // Add diff to current index and wrap cleanly
                  let next = (prev + diff) % renderedProjects.length;
                  if (next < 0) next += renderedProjects.length;
                  return next;
                });
                
                setTimeout(() => (isScrolling.current = false), 1000);
              }}
              style={{ cursor: 'pointer' }}
            />
          );
        })}
      </motion.div>
    </>
  );
}
