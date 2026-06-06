import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Github as GithubIcon, LayoutDashboard, FileText, Youtube, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { Project } from '../types';

interface Props {
  projects: Project[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

// Slide direction: +1 = moving to a later project, -1 = earlier
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%' }),
  center: { x: 0 },
  exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%' }),
};

export const ProjectModal: React.FC<Props> = ({ projects, index, onClose, onNavigate }) => {
  const isOpen = index !== null;
  const project = isOpen ? (projects[index] ?? null) : null;
  const count = projects.length;
  const [direction, setDirection] = useState(0);

  const navigate = (next: number, dir: number) => { setDirection(dir); onNavigate(next); };
  const goPrev = () => { if (isOpen && count > 0) navigate((index! - 1 + count) % count, -1); };
  const goNext = () => { if (isOpen && count > 0) navigate((index! + 1) % count, 1); };
  const goTo = (i: number) => { if (i !== index) navigate(i, i > (index ?? 0) ? 1 : -1); };

  useEffect(() => {
    document.body.style.overflow = project ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [project]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, isOpen, index, count]);

  const modalLinks = project
    ? [project.dashboardLink, project.githubLink, project.presentationLink, project.videoLink].filter(Boolean)
    : [];
  // Legacy `link` renders as a Website button only when it isn't already one of the labelled links above.
  const websiteUrl = project?.link && !modalLinks.includes(project.link) ? project.link : null;
  const hasLinks = modalLinks.length > 0 || !!websiteUrl;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-hidden"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
          onClick={onClose}
        >
          {/* Prev / Next — floating on the sides */}
          {count > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); goPrev(); }}
                className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-black/45 hover:bg-black/65 text-white transition-colors cursor-pointer backdrop-blur-sm"
                aria-label="Previous project"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={e => { e.stopPropagation(); goNext(); }}
                className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-black/45 hover:bg-black/65 text-white transition-colors cursor-pointer backdrop-blur-sm"
                aria-label="Next project"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'tween', duration: 0.26, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-center px-16 sm:px-24 lg:px-32 py-4 sm:py-8 pointer-events-none"
          >
          <div
            className="card relative flex flex-col overflow-hidden pointer-events-auto"
            style={{ width: '100%', maxWidth: '1320px', maxHeight: '86vh' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Toolbar — spans both columns */}
            <div className="shrink-0 flex items-center justify-between gap-4 px-6 py-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-3 min-w-0">
                <p className="text-sm font-bold uppercase tracking-widest opacity-50 shrink-0">Project Details</p>
                {project.domain && (
                  <span className="accent-badge-2 !text-xs !px-3 !py-1 truncate">✦ {project.domain}</span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[var(--border)]/40 transition-colors cursor-pointer shrink-0"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body: left + right columns */}
            <div className="flex flex-col sm:flex-row flex-1 min-h-0 overflow-y-auto sm:overflow-hidden">
            {/* Left: domain + title + image + meta + links */}
            <div className="sm:w-[45%] shrink-0 flex flex-col border-b sm:border-b-0 sm:border-r border-[var(--border)] sm:min-h-0 sm:overflow-y-auto">
              {/* Header text */}
              <div className="px-6 pt-6 pb-4 flex flex-col gap-2.5">
                <h3 className="text-2xl font-serif font-bold leading-snug">
                  {project.title}
                </h3>
              </div>

              {/* Image */}
              <div
                className="w-full flex items-center justify-center px-6 pt-2 pb-1"
                style={{ background: 'color-mix(in srgb, var(--accent) 6%, var(--bg))' }}
              >
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full object-contain rounded-lg"
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
              <div className="px-6 pt-4 pb-6 flex flex-col gap-2 flex-1">
                <div className="flex flex-col gap-0.5 pb-3 border-b border-[var(--border)]">
                  <p className="text-xs opacity-50 tracking-wide">
                    {[project.organization, project.date].filter(Boolean).join('  ·  ')}
                  </p>
                  {project.role && (
                    <p className="text-xs opacity-40 tracking-wide italic">{project.role}</p>
                  )}
                </div>

                {project.description && project.description.length > 0 && (
                  <ul className="space-y-1.5">
                    {project.description.map((d, i) => (
                      <li key={i} className="flex gap-2 text-xs leading-relaxed">
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
                    {websiteUrl && (
                      <a
                        href={websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="modal-link"
                      >
                        <Globe size={14} /> Website
                      </a>
                    )}
                    {project.dashboardLink && (
                      <a
                        href={project.dashboardLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="modal-link"
                      >
                        <LayoutDashboard size={14} /> Dashboard
                      </a>
                    )}
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="modal-link"
                      >
                        <GithubIcon size={14} /> GitHub
                      </a>
                    )}
                    {project.presentationLink && (
                      <a
                        href={project.presentationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="modal-link"
                      >
                        <FileText size={14} /> Presentation
                      </a>
                    )}
                    {project.videoLink && (
                      <a
                        href={project.videoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="modal-link"
                      >
                        <Youtube size={14} /> Video
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
                  <p className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: 'var(--section-label)' }}>Background</p>
                  <p className="text-sm leading-relaxed">{project.background}</p>
                </div>
              )}

              {project.goal && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: 'var(--section-label)' }}>Goal</p>
                  <p className="text-sm leading-relaxed">{project.goal}</p>
                </div>
              )}

              {project.keyInsights && project.keyInsights.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: 'var(--section-label)' }}>Key Insights & Results</p>
                  <ul className="space-y-2.5">
                    {project.keyInsights.map((k, i) => (
                      <li key={i} className="flex gap-3 text-sm leading-relaxed">
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
                      <p className="text-xs font-bold uppercase tracking-widest mb-2.5"
                        style={{ color: 'var(--section-label)' }}>Tech Stack</p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack.map(t => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-full border border-[var(--border)] text-[9px] font-bold uppercase tracking-wider opacity-70 transition-colors hover:opacity-100 hover:border-[var(--accent)] hover:text-[var(--accent)]"
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
                      <p className="text-xs font-bold uppercase tracking-widest mb-2.5"
                        style={{ color: 'var(--section-label)' }}>Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.relatedSkills.map(s => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded-full border border-[var(--border)] text-[9px] font-bold uppercase tracking-wider opacity-70 transition-colors hover:opacity-100 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                            style={{ backgroundColor: 'var(--bg)' }}
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
            </div>
          </div>
          </motion.div>
          </AnimatePresence>

          {/* Dot navigator */}
          {count > 1 && (
            <div
              className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-2 rounded-full bg-black/45 backdrop-blur-sm max-w-[90vw] overflow-x-auto"
              onClick={e => e.stopPropagation()}
            >
              {projects.map((p, i) => (
                <button
                  key={p.title}
                  onClick={() => goTo(i)}
                  className="rounded-full transition-all duration-200 cursor-pointer shrink-0"
                  style={{
                    width: i === index ? '22px' : '8px',
                    height: '8px',
                    backgroundColor: i === index ? 'var(--accent)' : 'rgba(255,255,255,0.45)',
                  }}
                  aria-label={`Go to ${p.title}`}
                  aria-current={i === index}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
