import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ProjectPage, Project } from '../pages/ProjectPage/ProjectPage';

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Linear Design',
    subtitle: 'Product Experience',
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
    title: 'Coming Soon!',
    subtitle: 'Upcoming Project',
    bg: '',
    video: '',
    tag: 'Concept',
    description: 'A new creative exploration in progress. Full case study and interactive live preview will be available soon.',
    link: '#',
  },
  {
    id: 3,
    title: 'Coming Soon!',
    subtitle: 'Upcoming Project',
    bg: '',
    video: '',
    tag: 'Concept',
    description: 'A new creative exploration in progress. Full case study and interactive live preview will be available soon.',
    link: '#',
  },
  {
    id: 4,
    title: 'Coming Soon!',
    subtitle: 'Upcoming Project',
    bg: '',
    video: '',
    tag: 'Concept',
    description: 'A new creative exploration in progress. Full case study and interactive live preview will be available soon.',
    link: '#',
  },
];

export interface ProjectCarouselProps {
  expandedProject?: number | null;
  onProjectClick?: (id: number) => void;
  onToggleProjectInfo?: () => void;
  isPersonalInfoOpen?: boolean;
  isProjectInfoOpen?: boolean;
}

export function ProjectCarousel({ 
  expandedProject = null, 
  onProjectClick,
  onToggleProjectInfo,
  isPersonalInfoOpen = false,
  isProjectInfoOpen = false
}: ProjectCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const isScrolling = useRef(false);

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

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling.current || expandedProject !== null || isPersonalInfoOpen) return;

      if (e.deltaY > 40) {
        // Scroll down -> next project
        isScrolling.current = true;
        setActiveIndex((prev) => (prev + 1) % PROJECTS.length);
        setTimeout(() => (isScrolling.current = false), 1000);
      } else if (e.deltaY < -40) {
        // Scroll up -> prev project
        isScrolling.current = true;
        setActiveIndex((prev) => (prev === 0 ? PROJECTS.length - 1 : prev - 1));
        setTimeout(() => (isScrolling.current = false), 1000);
      }
    };

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [activeIndex, expandedProject, isPersonalInfoOpen]);

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
        transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1], delay: 5.0 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div style={{ position: 'relative', width: 'clamp(260px, 24vw, 420px)', aspectRatio: '1 / 1', transformStyle: 'preserve-3d' }}>
          {PROJECTS.map((proj, i) => {
            const diff = getWrappedDiff(i, activeIndex, PROJECTS.length);
            const isActive = diff === 0;

            // Tentukan posisi 3D berdasarkan kedudukannya relatif terhadap activeIndex
            // Menggunakan rumus silinder 3D untuk tumpukan dan animasi yang akurat
            const radius = 420; // Jari-jari silinder (mengatur jarak antar kartu)
            const anglePerCard = 75; // Sudut per kartu dalam derajat
            const angle = diff * anglePerCard;
            const angleRad = angle * (Math.PI / 180);

            // Hitung posisi Y dan Z di permukaan silinder
            const y = radius * Math.sin(angleRad);
            // Z dihitung relatif terhadap bagian depan silinder (agar diff=0 memiliki z=0)
            const z = radius * Math.cos(angleRad) - radius;
            const rotateX = angle;

            const isExpanded = expandedProject === proj.id;
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

            if (isPersonalInfoOpen) {
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
                key={proj.id}
                className="project-card-slot"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  transformOrigin: 'center center',
                  pointerEvents: (!isPersonalInfoOpen && (isActive || isExpanded)) ? 'auto' : 'none',
                  cursor: (!isPersonalInfoOpen && (isActive || isExpanded)) ? 'pointer' : 'default',
                }}
                onClick={() => {
                  if (isPersonalInfoOpen) return;
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
          opacity: (expandedProject || isPersonalInfoOpen) ? 0 : 1, 
          x: (expandedProject || isPersonalInfoOpen) ? 40 : 0 
        }}
        transition={{ 
          delay: (expandedProject || isPersonalInfoOpen) ? 0 : (expandedProject === null ? 0.2 : 5.75), 
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1]
        }}
        style={{ pointerEvents: (expandedProject || isPersonalInfoOpen) ? 'none' : 'auto' }}
      >
        {PROJECTS.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === activeIndex ? 'active' : ''}`}
            onClick={() => {
              if (isScrolling.current || expandedProject !== null) return;
              isScrolling.current = true;
              setActiveIndex(i);
              setTimeout(() => (isScrolling.current = false), 1000);
            }}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </motion.div>
    </>
  );
}
