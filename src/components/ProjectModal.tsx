import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Github as GithubIcon, LayoutDashboard, FileText } from 'lucide-react';
import { Project } from '../types';

interface Props {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<Props> = ({ project, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = project ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [project]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const hasLinks = project && (project.dashboardLink || project.githubLink || project.presentationLink);

  return ReactDOM.createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="card relative flex flex-col sm:flex-row overflow-y-auto sm:overflow-hidden"
            style={{ width: '90vw', maxWidth: '1100px', maxHeight: '88vh' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors cursor-pointer backdrop-blur-sm"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            {/* Left: label + domain + title + image + meta + links */}
            <div className="sm:w-[42%] shrink-0 flex flex-col border-b sm:border-b-0 sm:border-r border-[var(--border)]">
              {/* Header text */}
              <div className="px-6 pt-6 pb-4 flex flex-col gap-2.5">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-35">Project Details</p>
                {project.domain && (
                  <span className="accent-badge-2 self-start !text-[10px] !px-3 !py-1">✦ {project.domain}</span>
                )}
                <h3 className="text-2xl font-serif font-bold leading-snug">
                  {project.title}
                </h3>
              </div>

              {/* Image */}
              <div
                className="w-full flex items-center justify-center"
                style={{ background: 'color-mix(in srgb, var(--accent) 6%, var(--bg))' }}
              >
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full object-contain"
                    style={{ maxHeight: '38vh' }}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div
                    className="w-full h-48"
                    style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent) 30%, transparent), transparent)' }}
                  />
                )}
              </div>

              {/* Meta + links */}
              <div className="px-6 pt-4 pb-6 flex flex-col gap-3 flex-1">
                <p className="text-xs opacity-50 tracking-wide">
                  {[project.organization, project.date].filter(Boolean).join('  ·  ')}
                </p>
                {project.role && (
                  <p className="text-xs opacity-40 tracking-wide italic">{project.role}</p>
                )}

                {project.description && project.description.length > 0 && (
                  <ul className="mt-1 space-y-1.5">
                    {project.description.map((d, i) => (
                      <li key={i} className="flex gap-2 text-xs leading-relaxed opacity-60">
                        <span
                          className="w-1 h-1 rounded-full mt-1.5 shrink-0"
                          style={{ backgroundColor: 'var(--accent)' }}
                        />
                        {d}
                      </li>
                    ))}
                  </ul>
                )}

                {hasLinks && (
                  <div className="flex flex-wrap gap-2 mt-auto pt-4">
                    {project.dashboardLink && (
                      <a
                        href={project.dashboardLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] text-sm font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                      >
                        <LayoutDashboard size={14} /> Dashboard
                      </a>
                    )}
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] text-sm font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                      >
                        <GithubIcon size={14} /> GitHub
                      </a>
                    )}
                    {project.presentationLink && (
                      <a
                        href={project.presentationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] text-sm font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                      >
                        <FileText size={14} /> Presentation
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right: scrollable details */}
            <div className="flex-1 sm:min-h-0 sm:overflow-y-auto px-7 py-7 flex flex-col gap-6">
              {project.background && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">Background</p>
                  <p className="text-sm leading-relaxed opacity-75">{project.background}</p>
                </div>
              )}

              {project.goal && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">Goal</p>
                  <p className="text-sm leading-relaxed opacity-75">{project.goal}</p>
                </div>
              )}

              {project.keyInsights && project.keyInsights.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">Key Insights & Results</p>
                  <ul className="space-y-2.5">
                    {project.keyInsights.map((k, i) => (
                      <li key={i} className="flex gap-3 text-sm leading-relaxed opacity-75">
                        <span
                          className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                          style={{ backgroundColor: 'var(--accent)' }}
                        />
                        {k}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(project.techStack?.length || project.relatedSkills?.length) ? (
                <div className="flex flex-col gap-4">
                  {project.techStack && project.techStack.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2.5">Stack</p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack.map(t => (
                          <span
                            key={t}
                            className="px-3 py-1 rounded-full border border-[var(--border)] text-xs font-semibold"
                            style={{ backgroundColor: 'var(--bg)' }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {project.relatedSkills && project.relatedSkills.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2.5">Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.relatedSkills.map(s => (
                          <span
                            key={s}
                            className="px-3 py-1 rounded-full text-xs font-semibold opacity-70"
                            style={{ border: '1px dashed var(--border)' }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
