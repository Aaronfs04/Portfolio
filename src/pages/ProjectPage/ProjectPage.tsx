import { motion } from 'framer-motion';
import { ProjectInfoPage } from '../ProjectInfoPage/ProjectInfoPage';
import './ProjectPage.css';

export interface Project {
  id: number;
  title: string;
  subtitle?: string;
  bg: string;
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

  return (
    <div className="project-page-container">
      {/* Overlay abu-abu jika tidak aktif atau coming soon */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#e5e7eb',
          opacity: isVisible && project.bg ? 0 : 1,
          transition: 'opacity 0.8s ease',
          zIndex: 2,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#9ca3af',
          fontSize: '1.5rem',
          fontWeight: 500,
        }}
      >
        {!project.bg && project.title}
      </div>

      {/* Background Image */}
      {project.bg && (
        <motion.img 
          src={project.bg} 
          alt={`${project.title} Background`} 
          className="project-page-bg" 
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.8s ease',
          }}
        />
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
            <video
              src={project.video}
              className="project-page-video"
              autoPlay
              loop
              muted
              playsInline
            />
          )}
        </motion.div>
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

      {/* Project Info Overlay Page (terpisah) */}
      <ProjectInfoPage 
        project={project} 
        isOpen={isExpanded && isProjectInfoOpen} 
      />
    </div>
  );
}
