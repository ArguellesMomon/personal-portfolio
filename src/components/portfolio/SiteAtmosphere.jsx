import { useEffect, useId, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useMotion } from './MotionContext.jsx';

const contourScales = Array.from({ length: 15 }, (_, i) => 0.22 + i * 0.11);
const contourPath =
  'M -120 -300 C 45 -380 255 -320 320 -150 C 400 30 280 240 110 310 C -60 390 -250 275 -300 130 C -345 0 -315 -165 -220 -200 C -165 -220 -185 -270 -120 -300 Z';

export default function SiteAtmosphere() {
  const contourId = useId();
  const layer = useRef(null);
  const { pathname } = useLocation();
  const { enabled } = useMotion();

  useEffect(() => {
    let frame = 0;
    const root = document.documentElement;
    const update = () => {
      frame = 0;
      const height = root.scrollHeight - innerHeight;
      root.style.setProperty(
        '--reading-progress',
        height > 0 ? Math.min(1, Math.max(0, scrollY / height)) : 0,
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const observer = 'ResizeObserver' in window ? new ResizeObserver(schedule) : null;
    observer?.observe(document.body);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [pathname]);

  useEffect(() => {
    const root = document.documentElement;
    const updateVisibility = () => {
      root.dataset.pageVisibility = document.hidden ? 'hidden' : 'visible';
    };
    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    const hero = document.querySelector('.hero-visual');
    const observer =
      'IntersectionObserver' in window
        ? new IntersectionObserver((entries) =>
            entries.forEach((entry) => {
              entry.target.dataset.sceneVisibility = entry.isIntersecting ? 'visible' : 'hidden';
            }),
          )
        : null;
    if (hero) observer?.observe(hero);
    return () => {
      document.removeEventListener('visibilitychange', updateVisibility);
      observer?.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!enabled || !finePointer.matches) return;
    let frame = 0;
    let pointer;
    let activeSurface = null;
    let bounds = null;
    const resetSurface = () => {
      if (!activeSurface) return;
      ['--tilt-x', '--tilt-y', '--shine-x', '--shine-y', '--hero-x', '--hero-y'].forEach((name) =>
        activeSurface.style.removeProperty(name),
      );
      delete activeSurface.dataset.pointer;
      activeSurface = null;
      bounds = null;
    };
    const update = () => {
      frame = 0;
      if (!pointer) return;
      const { x, y, surface } = pointer;
      if (surface !== activeSurface) {
        resetSurface();
        activeSurface = surface;
      }
      if (activeSurface && !bounds) bounds = activeSurface.getBoundingClientRect();
      const glow = layer.current;
      glow?.style.setProperty('--pointer-x', `${x}px`);
      glow?.style.setProperty('--pointer-y', `${y}px`);
      if (glow) glow.dataset.pointer = 'active';
      if (!activeSurface || !bounds) return;
      const px = Math.min(1, Math.max(0, (x - bounds.left) / bounds.width));
      const py = Math.min(1, Math.max(0, (y - bounds.top) / bounds.height));
      activeSurface.dataset.pointer = 'active';
      activeSurface.style.setProperty('--tilt-x', `${(0.5 - py) * 5}deg`);
      activeSurface.style.setProperty('--tilt-y', `${(px - 0.5) * 5}deg`);
      activeSurface.style.setProperty('--shine-x', `${px * 100}%`);
      activeSurface.style.setProperty('--shine-y', `${py * 100}%`);
      activeSurface.style.setProperty('--hero-x', `${(px - 0.5) * 10}px`);
      activeSurface.style.setProperty('--hero-y', `${(py - 0.5) * 8}px`);
    };
    const move = (event) => {
      if (event.pointerType !== 'mouse' || !finePointer.matches) {
        reset();
        return;
      }
      pointer = {
        x: event.clientX,
        y: event.clientY,
        surface: event.target.closest?.('.work-card, .practice-card, .hero-visual') || null,
      };
      if (!frame) frame = requestAnimationFrame(update);
    };
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      pointer = null;
      resetSurface();
      if (layer.current) delete layer.current.dataset.pointer;
    };
    const refreshBounds = () => {
      bounds = null;
      if (!pointer) return;
      const target = document.elementFromPoint(pointer.x, pointer.y);
      pointer.surface = target?.closest('.work-card, .practice-card, .hero-visual') || null;
      if (!frame) frame = requestAnimationFrame(update);
    };
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', reset);
    window.addEventListener('blur', reset);
    window.addEventListener('resize', refreshBounds);
    window.addEventListener('scroll', refreshBounds, { passive: true });
    finePointer.addEventListener('change', reset);
    return () => {
      reset();
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', reset);
      window.removeEventListener('blur', reset);
      window.removeEventListener('resize', refreshBounds);
      window.removeEventListener('scroll', refreshBounds);
      finePointer.removeEventListener('change', reset);
    };
  }, [enabled, pathname]);

  return (
    <>
      <div className="site-atmosphere" ref={layer} aria-hidden="true">
        <div className="ambient-light ambient-moss" />
        <div className="ambient-light ambient-sun" />
        <div className="ambient-light ambient-fern" />
        <svg
          className="terrain-contours"
          viewBox="0 0 1440 1000"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
        >
          <defs>
            <path id={contourId} d={contourPath} />
          </defs>
          <g className="terrain-island terrain-island-one" transform="translate(1220 350)">
            {contourScales.map((scale) => (
              <use key={scale} href={`#${contourId}`} transform={`scale(${scale})`} />
            ))}
          </g>
          <g className="terrain-island terrain-island-two" transform="translate(0 950) rotate(30)">
            {contourScales.slice(2).map((scale) => (
              <use key={scale} href={`#${contourId}`} transform={`scale(${scale * 0.8})`} />
            ))}
          </g>
        </svg>
        <div className="atmosphere-grid" />
        <div className="atmosphere-pointer" />
        <div className="paper-grain" />
      </div>
      <div className="reading-progress" aria-hidden="true">
        <span />
      </div>
    </>
  );
}
