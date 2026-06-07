import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Layout, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Dashboard } from '../types';

interface Props {
  dashboards: Dashboard[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

// Slide direction: +1 = moving to a later dashboard, -1 = earlier
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%' }),
  center: { x: 0 },
  exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%' }),
};

export const DashboardModal: React.FC<Props> = ({ dashboards, index, onClose, onNavigate }) => {
  const isOpen = index !== null;
  const dash = isOpen ? (dashboards[index] ?? null) : null;
  const count = dashboards.length;
  const [direction, setDirection] = useState(0);

  // Press-and-hold to magnify the image, following the cursor.
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const updateOrigin = (e: React.MouseEvent<HTMLImageElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  // Reset zoom whenever the shown dashboard changes or the modal closes.
  useEffect(() => setZoom(false), [index]);

  const navigate = (next: number, dir: number) => { setDirection(dir); onNavigate(next); };
  const goPrev = () => { if (isOpen && count > 0) navigate((index! - 1 + count) % count, -1); };
  const goNext = () => { if (isOpen && count > 0) navigate((index! + 1) % count, 1); };
  const goTo = (i: number) => { if (i !== index) navigate(i, i > (index ?? 0) ? 1 : -1); };

  useEffect(() => {
    document.body.style.overflow = dash ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [dash]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, isOpen, index, count]);

  return ReactDOM.createPortal(
    <AnimatePresence>
      {dash && (
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
                aria-label="Previous dashboard"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={e => { e.stopPropagation(); goNext(); }}
                className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-black/45 hover:bg-black/65 text-white transition-colors cursor-pointer backdrop-blur-sm"
                aria-label="Next dashboard"
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
            style={{ width: '100%', maxWidth: '1320px', height: '86vh' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Toolbar */}
            <div className="shrink-0 flex items-center justify-between gap-4 px-6 py-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-3 min-w-0">
                <p className="text-sm font-bold uppercase tracking-widest opacity-50 shrink-0">Dashboard Preview</p>
                <span className="accent-badge-2 !text-xs !px-3 !py-1 flex items-center gap-1.5 shrink-0">
                  <Layout size={12} /> {dash.platform}
                </span>
                {dash.date && <span className="text-xs opacity-50 tracking-wide">{dash.date}</span>}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[var(--border)]/40 transition-colors cursor-pointer shrink-0"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Full thumbnail — press and hold to magnify */}
            <div className="relative flex-1 min-h-0 flex flex-col bg-black/40 p-4 sm:p-6">
              <div className="flex-1 min-h-0 overflow-hidden rounded-lg flex items-center justify-center">
                <img
                  src={dash.image}
                  alt={dash.title}
                  className={`w-full h-full object-contain select-none transition-transform duration-200 ${
                    zoom ? 'cursor-zoom-out' : 'cursor-zoom-in'
                  }`}
                  style={{
                    transformOrigin: `${origin.x}% ${origin.y}%`,
                    transform: zoom ? 'scale(2.5)' : 'scale(1)',
                  }}
                  draggable={false}
                  onMouseDown={e => { updateOrigin(e); setZoom(true); }}
                  onMouseMove={e => { if (zoom) updateOrigin(e); }}
                  onMouseUp={() => setZoom(false)}
                  onMouseLeave={() => setZoom(false)}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Floating title + external link over the image */}
              <div className="pointer-events-none absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div className="pointer-events-auto select-text min-w-0 max-w-2xl rounded-lg bg-black/55 backdrop-blur-sm px-4 py-2.5">
                  <h3 className="text-lg font-serif font-bold leading-tight text-white truncate">{dash.title}</h3>
                  {dash.description && (
                    <p className="text-sm text-white/70 font-light mt-0.5 line-clamp-2">{dash.description}</p>
                  )}
                </div>
                {dash.link && (
                  <a
                    href={dash.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="modal-link pointer-events-auto shrink-0 self-start sm:self-auto"
                  >
                    <ExternalLink size={14} /> Visit Dashboard
                  </a>
                )}
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
              {dashboards.map((d, i) => (
                <button
                  key={d.title}
                  onClick={() => goTo(i)}
                  className="rounded-full transition-all duration-200 cursor-pointer shrink-0"
                  style={{
                    width: i === index ? '22px' : '8px',
                    height: '8px',
                    backgroundColor: i === index ? 'var(--accent)' : 'rgba(255,255,255,0.45)',
                  }}
                  aria-label={`Go to ${d.title}`}
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
