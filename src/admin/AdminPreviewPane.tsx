import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { useTheme } from '../components/ThemeContext';
import type { AdminSectionKey } from './sections';
import type { PortfolioData } from '../types';

const MIN_PREVIEW_W = 320;
const MAX_PREVIEW_W = 1080;

// iPhone 14 Pro logical dimensions
const PHONE_CONTENT_W = 390;
const PHONE_CONTENT_H = 844;
const PHONE_CHROME_H = 96; // 52px top + 40px bottom + 4px borders

export function AdminPreviewPane({
  data,
  section,
}: {
  data: PortfolioData;
  section: AdminSectionKey;
}) {
  const [previewWidth, setPreviewWidth] = useState<number | null>(null);
  const [mode, setMode] = useState<'desktop' | 'mobile'>('desktop');
  const [iframeKey, setIframeKey] = useState(0);
  const [iframeReady, setIframeReady] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [desktopH, setDesktopH] = useState<number | null>(null);
  const { theme } = useTheme();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [innerWidth, setInnerWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(() => window.innerHeight);
  const [headerH, setHeaderH] = useState(60);

  // Track pane inner width for phone scaling
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setInnerWidth(entry.contentRect.width));
    ro.observe(el);
    setInnerWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  // Track window height so phone frame never overflows the viewport
  useEffect(() => {
    const handler = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Measure actual admin header height (grows when banners appear)
  useEffect(() => {
    const header = document.querySelector('header');
    if (!header) return;
    const ro = new ResizeObserver(() => setHeaderH(header.getBoundingClientRect().height));
    ro.observe(header);
    setHeaderH(header.getBoundingClientRect().height);
    return () => ro.disconnect();
  }, []);

  const sendToIframe = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'PREVIEW_DATA', data, section, theme },
      '*',
    );
  }, [data, section, theme]);

  // Listen for messages from the iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'PREVIEW_READY') setIframeReady(true);
      if (e.data?.type === 'PREVIEW_HEIGHT') setDesktopH(e.data.height as number);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // Push data whenever anything changes or the iframe becomes ready
  useEffect(() => {
    if (iframeReady) sendToIframe();
  }, [iframeReady, sendToIframe]);

  const switchMode = (next: 'desktop' | 'mobile') => {
    setIframeReady(false);
    setDesktopH(null);
    setIframeKey(k => k + 1);
    setMode(next);
  };

  const handlePreviewDrag = (e: ReactMouseEvent) => {
    e.preventDefault();
    setDragging(true);
    const startX = e.clientX;
    const startWidth = previewWidth ?? window.innerWidth * 0.5;
    const onMove = (ev: globalThis.MouseEvent) => {
      const w = Math.min(Math.max(startWidth + startX - ev.clientX, MIN_PREVIEW_W), MAX_PREVIEW_W);
      setPreviewWidth(w);
    };
    const onUp = () => {
      setDragging(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // Scale phone to fit within the viewport without causing outer scroll.
  // Budget: windowHeight minus actual header, flex container py-6 (48px),
  // and aside-internal overhead (preview header row ~36px + mb-2 8px + pt-2 8px = 52px).
  const availableH = windowHeight - headerH - 48 - 52;
  const scaleByWidth = innerWidth > 0 ? Math.min(1, (innerWidth - 16) / PHONE_CONTENT_W) : 1;
  const scaleByHeight = availableH > 0 ? Math.min(1, availableH / (PHONE_CONTENT_H + PHONE_CHROME_H)) : 1;
  const phoneScale = Math.min(scaleByWidth, scaleByHeight);
  const scaledPhoneH = (PHONE_CONTENT_H + PHONE_CHROME_H) * phoneScale;

  return (
    <aside
      className="hidden lg:flex lg:flex-col lg:shrink-0 lg:sticky lg:top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto relative"
      style={{
        width: previewWidth ?? '50vw',
        minWidth: MIN_PREVIEW_W,
        maxWidth: MAX_PREVIEW_W,
      }}
    >
      {/* Drag handle — only in desktop mode where pane width matters */}
      {mode === 'desktop' && (
        <div
          className="absolute left-0 inset-y-0 w-1.5 cursor-col-resize hover:bg-[var(--accent)]/30 active:bg-[var(--accent)]/50 transition-colors"
          onMouseDown={handlePreviewDrag}
        />
      )}

      <div className="pl-3" ref={innerRef}>
        <PreviewHeader
          section={section}
          mode={mode}
          onDesktop={() => switchMode('desktop')}
          onMobile={() => switchMode('mobile')}
        />

        {mode === 'desktop' ? (
          // iframe fills the pane — its viewport width equals the pane width,
          // so Tailwind breakpoints respond correctly as you drag the resize handle.
          <iframe
            key={iframeKey}
            ref={iframeRef}
            src="/preview.html"
            title="Desktop preview"
            style={{
              width: '100%',
              height: desktopH ?? 'calc(100vh - 8rem)',
              border: 'none',
              display: 'block',
              pointerEvents: dragging ? 'none' : 'auto',
            }}
          />
        ) : (
          <div className="flex justify-center pt-2">
            <div style={{ height: scaledPhoneH }}>
              <div
                style={{
                  transform: `scale(${phoneScale})`,
                  transformOrigin: 'top center',
                  width: PHONE_CONTENT_W,
                }}
              >
                <PhoneFrame>
                  <iframe
                    key={iframeKey}
                    ref={iframeRef}
                    src="/preview.html"
                    title="Mobile preview"
                    style={{
                      width: PHONE_CONTENT_W,
                      height: PHONE_CONTENT_H,
                      border: 'none',
                      display: 'block',
                    }}
                  />
                </PhoneFrame>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: '#16161e',
        borderRadius: 44,
        padding: '52px 10px 40px',
        boxShadow: '0 0 0 2px #2a2a3a, 0 0 0 5px #0d0d14, 0 24px 72px rgba(0,0,0,0.6)',
        position: 'relative',
      }}
    >
      {/* Dynamic Island */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 120,
          height: 34,
          background: '#16161e',
          borderRadius: '0 0 20px 20px',
          zIndex: 10,
        }}
      />
      {/* Status bar time */}
      <div
        style={{
          position: 'absolute',
          top: 18,
          left: 26,
          fontSize: 13,
          fontWeight: 600,
          color: '#fff',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.3px',
          zIndex: 10,
        }}
      >
        9:41
      </div>
      {/* Status bar icons */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          right: 26,
          fontSize: 11,
          color: '#fff',
          fontFamily: 'system-ui, sans-serif',
          zIndex: 10,
          display: 'flex',
          gap: 4,
          alignItems: 'center',
        }}
      >
        <span>●●●</span>
        <span>▮▮</span>
      </div>
      {/* Home indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 130,
          height: 5,
          background: 'rgba(255,255,255,0.35)',
          borderRadius: 3,
          zIndex: 10,
        }}
      />
      <div style={{ borderRadius: 16, overflow: 'hidden' }}>{children}</div>
    </div>
  );
}

function PreviewHeader({
  section,
  mode,
  onDesktop,
  onMobile,
}: {
  section: AdminSectionKey;
  mode: 'desktop' | 'mobile';
  onDesktop: () => void;
  onMobile: () => void;
}) {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
      <p className="text-xs uppercase tracking-wide text-slate-500 shrink-0">
        Preview · {section}
      </p>
      <div className="flex items-center gap-1.5">
        <div className="flex rounded border border-slate-200 dark:border-slate-700 text-xs overflow-hidden">
          <button
            onClick={onDesktop}
            className={`px-2 py-1 transition-colors ${
              mode === 'desktop'
                ? 'bg-[var(--accent)] text-black'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            Desktop
          </button>
          <button
            onClick={onMobile}
            className={`px-2 py-1 transition-colors ${
              mode === 'mobile'
                ? 'bg-[var(--accent)] text-black'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            Mobile
          </button>
        </div>
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="text-xs px-2 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
        >
          {theme === 'dark' ? '☀ Light' : '☾ Dark'}
        </button>
      </div>
    </div>
  );
}
