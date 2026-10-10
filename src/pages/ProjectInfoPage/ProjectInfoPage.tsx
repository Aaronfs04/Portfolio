import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../ProjectPage/ProjectPage';
import './ProjectInfoPage.css';

export interface ProjectInfoPageProps {
  project: Project;
  isOpen: boolean;
}

export function ProjectInfoPage({ project, isOpen }: ProjectInfoPageProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="project-page-info-overlay"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            backgroundColor: '#ffffff',
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Tag / Category at Top */}
          <div className="project-info-tag">
            {project.tag || 'Information'}
          </div>

          {/* Project Details at Bottom */}
          <div className="project-info-content">
            {project.description && (
              <p className="project-info-desc">
                {project.description}
              </p>
            )}

            {(project.role || project.status || project.tech) && (
              <div className="project-info-meta">
                {project.role && (
                  <div className="project-meta-row">
                    <span className="project-meta-label">Role:</span>{' '}
                    <span className="project-meta-value">{project.role}</span>
                  </div>
                )}
                {project.status && (
                  <div className="project-meta-row">
                    <span className="project-meta-label">Status:</span>{' '}
                    <span className="project-meta-value">{project.status}</span>
                  </div>
                )}
                {project.tech && (
                  <div className="project-meta-row">
                    <span className="project-meta-label">Tools:</span>{' '}
                    <span className="project-meta-value">{project.tech}</span>
                  </div>
                )}
              </div>
            )}
            
            {project.tag === 'Publication' && project.bg && (
              <a 
                href={project.bg} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="project-meta-row"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '0.6rem',
                  padding: '0.65rem 1.1rem',
                  backgroundColor: '#111111',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                  transition: 'opacity 0.2s ease, transform 0.2s ease'
                }}
              >
                <span>View Full Certificate</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
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
  );
}

export default ProjectInfoPage;

