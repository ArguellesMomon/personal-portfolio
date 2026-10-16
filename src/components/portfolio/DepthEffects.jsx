import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useMotion } from './MotionContext.jsx';

const properties = [
  '--depth-rx',
  '--depth-ry',
  '--depth-light-x',
  '--depth-light-y',
  '--depth-shift-x',
  '--depth-shift-y',
];
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

// One event listener and one scheduled frame serve every depth surface.
// Only the inner plane moves; pointer measurements use its stationary wrapper.
export default function DepthEffects() {
  const { enabled } = useMotion();
  const { pathname, search } = useLocation();
  useEffect(() => {
    if (!enabled) return;
    const finePointer = window.matchMedia(
      '(min-width: 561px) and (hover: hover) and (pointer: fine)',
    );
    let active = null;
    let frame = 0;
    let point = null;
    const hasKeyboardFocus = (surface) =>
      document.activeElement instanceof Element &&
      document.activeElement.matches(':focus-visible') &&
      surface.contains(document.activeElement);
    const clearSurface = (surface) => {
      if (!surface) return;
      delete surface.dataset.depthActive;
      properties.forEach((property) => surface.style.removeProperty(property));
    };
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      point = null;
      clearSurface(active);
      active = null;
    };
    const paint = () => {
      frame = 0;
      if (!active?.isConnected || !point || document.hidden) {
        reset();
        return;
      }
      const bounds = active.getBoundingClientRect();
      if (!bounds.width || !bounds.height) {
        reset();
        return;
      }
      const x = clamp((point.x - bounds.left) / bounds.width, 0, 1);
      const y = clamp((point.y - bounds.top) / bounds.height, 0, 1);
      const strength = clamp(Number(active.dataset.depthStrength) || 4, 1, 8);
      active.style.setProperty('--depth-rx', `${((0.5 - y) * strength * 2).toFixed(2)}deg`);
      active.style.setProperty('--depth-ry', `${((x - 0.5) * strength * 2).toFixed(2)}deg`);
      active.style.setProperty('--depth-light-x', `${(x * 100).toFixed(1)}%`);
      active.style.setProperty('--depth-light-y', `${(y * 100).toFixed(1)}%`);
      active.style.setProperty('--depth-shift-x', `${((x - 0.5) * 12).toFixed(2)}px`);
      active.style.setProperty('--depth-shift-y', `${((y - 0.5) * 12).toFixed(2)}px`);
      active.dataset.depthActive = 'true';
    };
    const move = (event) => {
      if (!finePointer.matches || event.pointerType !== 'mouse' || document.hidden) {
        reset();
        return;
      }
      const target = event.target instanceof Element ? event.target.closest('[data-depth]') : null;
      // Keep keyboard focus stable while a visitor tabs through a card's links.
      if (!target || hasKeyboardFocus(target)) {
        reset();
        return;
      }
      if (active !== target) {
        clearSurface(active);
        active = target;
      }
      point = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const leave = (event) => {
      if (!event.relatedTarget) reset();
    };
    const focus = () => {
      if (active && hasKeyboardFocus(active)) reset();
    };
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerout', leave, { passive: true });
    document.addEventListener('focusin', focus);
    document.addEventListener('visibilitychange', reset);
    window.addEventListener('scroll', reset, { passive: true });
    window.addEventListener('resize', reset);
    window.addEventListener('blur', reset);
    finePointer.addEventListener('change', reset);
    return () => {
      reset();
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerout', leave);
      document.removeEventListener('focusin', focus);
      document.removeEventListener('visibilitychange', reset);
      window.removeEventListener('scroll', reset);
      window.removeEventListener('resize', reset);
      window.removeEventListener('blur', reset);
      finePointer.removeEventListener('change', reset);
    };
  }, [enabled, pathname, search]);
  return null;
}
