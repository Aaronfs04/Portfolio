import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const PROJECTS = [
  {
    id: 1,
    title: 'Linear',
    bg: '/assets/Linear/backgorundLinear.webp',
    video: '/assets/Linear/VideoLinear.mp4',
  },
  {
    id: 2,
    title: '',
    bg: '',
    video: '',
  },
  {
    id: 3,
    title: '',
    bg: '',
    video: '',
  },
  {
    id: 4,
    title: '',
    bg: '',
    video: '',
  },
];

export function ProjectCarousel() {
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
      if (isScrolling.current) return;

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
  }, [activeIndex]);

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
          marginLeft: '-4vw'
        }}
        initial={{ y: '-100vh', rotateX: -80, scale: 0.9, opacity: 0 }}
        animate={{ y: 0, rotateX: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 2.8, ease: [0.16, 1, 0.3, 1], delay: 2.0 }}
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

            // Opacity: hilangkan kartu yang terlalu jauh di belakang
            const opacity = Math.abs(diff) >= 2 ? 0 : (Math.abs(diff) === 1 ? 0.6 : 1);
            
            // Z-index agar kartu yang aktif selalu di atas
            const zIndex = 10 - Math.abs(diff);

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
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
                animate={{
                  y: y,
                  z: z,
                  rotateX: rotateX,
                  scale: isActive ? 1 : 0.95,
                  opacity: opacity,
                  zIndex: zIndex,
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <motion.div
                  className="project-card"
                  style={{
                    x: isActive ? cardX : 0,
                    y: isActive ? cardY : 0,
                  }}
                >
                  {/* Overlay abu-abu untuk menutupi gambar saat kartu ditumpuk (tidak aktif) */}
                  <div 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#e5e7eb', // Warna abu-abu referensi
                      opacity: isActive ? 0 : 1, // Full abu-abu jika tidak aktif
                      transition: 'opacity 0.8s ease',
                      zIndex: 2,
                      pointerEvents: 'none'
                    }}
                  />

                  {/* Background tetap di tempat (mengikuti container utama) */}
                  {proj.bg && (
                    <motion.img 
                      src={proj.bg} 
                      alt={`${proj.title} Background`} 
                      className="project-card-bg" 
                      style={{ 
                        opacity: isActive ? 1 : 0, 
                        transition: 'opacity 0.8s ease',
                      }} 
                    />
                  )}
                  
                  {/* Video tetap di tempat (mengikuti container utama) */}
                  {proj.video && (
                    <motion.div 
                      className="project-card-video-wrapper" 
                      style={{ 
                        opacity: isActive ? 1 : 0, 
                        transition: 'opacity 0.5s',
                      }}
                    >
                      {isActive && (
                        <video
                          src={proj.video}
                          className="project-card-video"
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      )}
                    </motion.div>
                  )}

                  {proj.title && (
                    <div className="project-card-title" style={{ opacity: isActive ? 1 : 0, transition: 'opacity 0.5s' }}>
                      {proj.title}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Titik-titik Navigasi / Pagination di Sisi Kanan Mentok Layar */}
      <motion.div
        className="project-pagination-dots"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.2, duration: 0.8 }}
      >
        {PROJECTS.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === activeIndex ? 'active' : ''}`}
            onClick={() => {
              if (isScrolling.current) return;
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
