import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { ProjectInfoPage } from '../ProjectInfoPage/ProjectInfoPage';
import { ProgressiveImage, ProgressiveVideo } from '../../components/ProgressiveMedia';
import './ProjectPage.css';

export interface Project {
  id: number;
  title: string;
  subtitle?: string;
  bg: string;
  bgFit?: 'cover' | 'contain';
  bgColor?: string;
  bgPadding?: string;
  disableProgressive?: boolean;
  video: string;
  tag?: string;
  description?: string;
  link?: string;
  role?: string;
  status?: string;
  tech?: string;
}

interface ProjectPageProps {
  project: Project;
  isActive: boolean;
  isExpanded: boolean;
  isProjectInfoOpen?: boolean;
  onClose?: () => void;
}

export function ProjectPage({ 
  project, 
  isActive, 
  isExpanded, 
  isProjectInfoOpen = false 
}: ProjectPageProps) {
  const isVisible = isActive || isExpanded;
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mouse Follower Spring Physics in Viewport Screen Space
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 28, stiffness: 450 });
  const springY = useSpring(mouseY, { damping: 28, stiffness: 450 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isVisible || isMobile) return;
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
    if (!isHovered) setIsHovered(true);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isVisible || isMobile) return;
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div 
      className="project-page-container"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Overlay abu-abu jika tidak aktif atau coming soon */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: isMobile ? '#dcdee2' : '#d1d5db',
          opacity: isVisible && project.bg ? 0 : 1,
          transition: 'opacity 0.8s ease',
          zIndex: 2,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isMobile ? '#9aa0a6' : '#9ca3af',
          fontSize: '1.5rem',
          fontWeight: 500,
        }}
      >
        {!project.bg && project.title}
      </div>

      {/* Background Image / Color */}
      {project.bg && (
        project.bg.startsWith('#') || project.bg.startsWith('rgb') ? (
          <motion.div
            className="project-page-bg"
            style={{
              backgroundColor: project.bg,
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 0.8s ease',
            }}
          />
        ) : (
          <motion.div
            className="project-page-bg"
            style={{
              backgroundColor: project.bgColor || 'transparent',
              opacity: (project.disableProgressive || isVisible) ? 1 : 0,
              padding: project.bgPadding || '0',
              boxSizing: 'border-box',
              transition: project.disableProgressive ? 'none' : 'opacity 0.8s ease',
            }}
          >
            {project.disableProgressive ? (
              <img 
                src={project.bg} 
                alt={`${project.title} Background`} 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: project.bgFit || 'cover',
                  display: 'block',
                  imageRendering: 'high-quality' as any,
                  WebkitBackfaceVisibility: 'hidden',
                }} 
              />
            ) : (
              <ProgressiveImage 
                src={project.bg} 
                alt={`${project.title} Background`} 
                objectFit={project.bgFit} 
                disableProgressive={false}
              />
            )}
          </motion.div>
        )
      )}
      
      {/* Video Wrapper - Selalu hidup di DOM selama aktif agar tidak reload / patah decoder */}
      {project.video && (
        <motion.div 
          className="project-page-video-wrapper"
          style={{ 
            opacity: isVisible ? 1 : 0, 
            transition: 'opacity 0.5s ease',
          }}
        >
          {isVisible && (
            <ProgressiveVideo src={project.video} className="project-page-video" />
          )}
        </motion.div>
      )}

      {/* Interactive Viewport-Level Cursor Follower Chat Bubble */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isVisible && isHovered && !isMobile && (
            <motion.div
              className="project-cursor-follower-wrapper"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                x: springX,
                y: springY,
                pointerEvents: 'none',
                zIndex: 99999,
              }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="project-cursor-bubble">
                <span className="chat-bubble-text">
                  {isProjectInfoOpen ? 'Click to close' : (isExpanded ? 'Click for info' : 'Click to view')}
                </span>
                <span className="chat-bubble-icon">
                  {isProjectInfoOpen ? '✕' : '✦'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Judul di dalam kartu, hilang saat expanded */}
      <div 
        className="project-card-title" 
        style={{ 
          opacity: (isActive && !isExpanded) ? 1 : 0, 
          transition: 'opacity 0.5s ease' 
        }}
      >
        {project.title}
      </div>

      {/* Project Info Overlay Page (hanya untuk desktop) */}
      <ProjectInfoPage 
        project={project} 
        isOpen={typeof window !== 'undefined' && window.innerWidth > 768 && isExpanded && isProjectInfoOpen} 
      />
    </div>
  );
}
