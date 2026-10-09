import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ProjectPage, Project } from '../pages/ProjectPage/ProjectPage';

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Linear Design',
    subtitle: 'Freelance Experience',
    bg: '/assets/Linear/backgorundLinear.webp',
    video: '/assets/Linear/VideoLinear.mp4',
    tag: 'Information',
    description: "A business portfolio website for Linear Studio, a multidisciplinary studio working across architecture, interior design, and graphic design. The site serves as the studio’s digital presence, showcasing its work and identity through an artistic, original, and intentionally non-templated experience.",
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
    title: '',
    bg: '',
    video: '',
  },
  {
    id: 202,
    title: '',
    bg: '',
    video: '',
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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
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

  // Jika hanya ada 2 project, kita gandakan menjadi 4 di virtual render 
  // agar animasi melingkar (atas & bawah) memiliki elemen DOM yang cukup untuk bertransisi mulus
  const renderedProjects = currentData.length === 2 
    ? [...currentData.map(p => ({...p, renderId: p.id + '_1'})), ...currentData.map(p => ({...p, renderId: p.id + '_2'}))]
    : currentData.map(p => ({...p, renderId: p.id.toString()}));

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

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
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
        className="hero-projects"
        style={{ 
          perspective: 1200,
          /* Geser ke kiri sedikit */
          marginLeft: '-4vw',
          pointerEvents: isPersonalInfoOpen ? 'none' : 'auto'
        }}
        initial={{ y: '-100vh', rotateX: -80, scale: 0.9, opacity: 0 }}
        animate={{ y: 0, rotateX: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1], delay: 3.0 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div style={{ position: 'relative', width: 'clamp(260px, 24vw, 420px)', aspectRatio: '1 / 1', transformStyle: 'preserve-3d' }}>
          {renderedProjects.map((proj, i) => {
            const diff = getWrappedDiff(i, activeIndex, renderedProjects.length);
            const isActive = diff === 0;

            // Tentukan posisi 3D berdasarkan kedudukannya relatif terhadap activeIndex
            // Menggunakan rumus silinder 3D untuk tumpukan dan animasi yang akurat
            const radius = windowWidth < 768 ? 250 : (windowWidth < 1024 ? 320 : (windowWidth < 1440 ? 360 : 420));
            const anglePerCard = 75; // Sudut per kartu dalam derajat
            const angle = diff * anglePerCard;
            const angleRad = angle * (Math.PI / 180);

            // Hitung posisi Y dan Z di permukaan silinder
            const y = radius * Math.sin(angleRad);
            // Z dihitung relatif terhadap bagian depan silinder (agar diff=0 memiliki z=0)
            const z = radius * Math.cos(angleRad) - radius;
            const rotateX = angle;

            const isExpanded = expandedProject === proj.id && isActive;
            const isAnyExpanded = expandedProject !== null;

            // Opacity: hilangkan kartu yang terlalu jauh di belakang atau saat yang lain di-expand atau saat personal info terbuka
            let opacity = Math.abs(diff) >= 2 ? 0 : (Math.abs(diff) === 1 ? 0.6 : 1);
            if (isAnyExpanded && !isExpanded) opacity = 0;
            if (isPersonalInfoOpen) opacity = 0;
            
            // Z-index agar kartu yang aktif atau expanded selalu di atas
            const zIndex = isExpanded ? 50 : (10 - Math.abs(diff));

            // Jika expanded atau personal info open, timpa nilai transformasi
            let animX: number | string = isExpanded ? '2vw' : 0;
            let animY: number | string = isExpanded ? 0 : y;
            const animZ = isExpanded ? 150 : z;
            const animRotateX = isExpanded ? 0 : rotateX;
            const animScale = isExpanded ? 1.75 : (isActive ? 1 : 0.95);

            if (isPersonalInfoOpen || isCategoryTransitioning) {
              if (isActive) {
                animX = '60vw'; // Keluar bergeser ke kanan
              } else if (diff < 0) {
                animY = '-70vh'; // Tumpukan atas keluar bergeser ke atas
              } else if (diff > 0) {
                animY = '70vh'; // Tumpukan bawah keluar bergeser ke bawah
              }
            }

            return (
              <motion.div
                key={proj.renderId}
                className="project-card-slot"
                initial={isFirstRender.current ? false : {
                  x: isActive ? '60vw' : 0,
                  y: isActive ? 0 : (diff < 0 ? '-70vh' : '70vh'),
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
                  transformOrigin: 'center center',
                  pointerEvents: (!isPersonalInfoOpen && !isCategoryTransitioning && (isActive || isExpanded)) ? 'auto' : 'none',
                  cursor: (!isPersonalInfoOpen && !isCategoryTransitioning && (isActive || isExpanded)) ? 'pointer' : 'default',
                }}
                onClick={() => {
                  if (isPersonalInfoOpen || isCategoryTransitioning) return;
                  if (isExpanded) {
                    if (onToggleProjectInfo) {
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
                transition={{
                  duration: 1.0,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <motion.div
                  className="project-card"
                  style={{
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
                // Since there are only 2 projects, if it's not active, it's just the next one
                setActiveIndex((prev) => (prev + 1) % renderedProjects.length);
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
