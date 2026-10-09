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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ProjectInfoPage;

