import { useEffect, useMemo, useRef, useState } from 'react';
import usePrefersReducedMotion from '../../../hooks/usePrefersReducedMotion';
import './SignalLine.css';

const POINT_COUNT = 24;
const VIEW_WIDTH = 1000;

// Builds a jagged "oscilloscope" path from an array of y-offsets, centered
// vertically in a viewBox of the given height.
function buildPath(offsets, height) {
  const step = VIEW_WIDTH / (offsets.length - 1);
  const midY = height / 2;
  return offsets
    .map((offset, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${midY + offset}`)
    .join(' ');
}

// ---- Hero variant: large, cursor-reactive, idles into a slow pulse ----

const HERO_HEIGHT = 240;
const IDLE_AMPLITUDE = 18;
const IDLE_FREQUENCY = 2; // idle wave cycles across the full width
const CURSOR_AMPLITUDE = 70;
const CURSOR_SIGMA = 140; // how far the cursor's influence spreads, in svg units

function HeroSignalLine({ prefersReducedMotion }) {
  const svgRef = useRef(null);
  const [path, setPath] = useState('');
  const [drawn, setDrawn] = useState(false);

  // Mutable animation state in refs so the render loop doesn't need to
  // re-subscribe every time the mouse moves.
  const mouseXRef = useRef(VIEW_WIDTH / 2);
  const influenceRef = useRef(0);
  const lastMoveRef = useRef(0);

  // Draw-in on mount: wait a beat for the initial paint, then let the CSS
  // transition animate stroke-dashoffset to 0 (the SVG "draw" technique).
  useEffect(() => {
    const timer = setTimeout(() => setDrawn(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      // Static illustration: one still frame, no animation loop, no listeners.
      const offsets = Array.from({ length: POINT_COUNT }, (_, i) =>
        IDLE_AMPLITUDE * Math.sin((i / POINT_COUNT) * IDLE_FREQUENCY * Math.PI * 2)
      );
      setPath(buildPath(offsets, HERO_HEIGHT));
      return undefined;
    }

    let frameId;

    const tick = (time) => {
      const phase = time / 900; // idle pulse speed

      // Cursor influence fades back to 0 once the pointer has been still for
      // a bit, so the wave "idles into a slow steady pulse when untouched".
      const idleFor = time - lastMoveRef.current;
      const target = idleFor > 400 ? 0 : 1;
      influenceRef.current += (target - influenceRef.current) * 0.06;

      const offsets = Array.from({ length: POINT_COUNT }, (_, i) => {
        const x = (i / (POINT_COUNT - 1)) * VIEW_WIDTH;
        const idle =
          IDLE_AMPLITUDE * Math.sin((x / VIEW_WIDTH) * IDLE_FREQUENCY * Math.PI * 2 + phase);

        const distance = x - mouseXRef.current;
        const cursorBump =
          influenceRef.current *
          CURSOR_AMPLITUDE *
          Math.exp(-(distance * distance) / (2 * CURSOR_SIGMA * CURSOR_SIGMA));

        return idle + cursorBump;
      });

      setPath(buildPath(offsets, HERO_HEIGHT));
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [prefersReducedMotion]);

  const handlePointerMove = (event) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width;
    mouseXRef.current = relativeX * VIEW_WIDTH;
    lastMoveRef.current = performance.now();
  };

  return (
    <div
      className="signal-line signal-line--hero"
      onPointerMove={prefersReducedMotion ? undefined : handlePointerMove}
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_WIDTH} ${HERO_HEIGHT}`}
        preserveAspectRatio="none"
        focusable="false"
      >
        <path d={path} className={`signal-line__path ${drawn ? 'is-drawn' : ''}`} />
      </svg>
    </div>
  );
}

// ---- Trace variant: subtle scroll-progress line, no live interactivity ----

const TRACE_HEIGHT = 32;
const TRACE_AMPLITUDE = 6;
const TRACE_FREQUENCY = 5;

function TraceSignalLine({ prefersReducedMotion }) {
  const fillRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [pathLength, setPathLength] = useState(1000);

  // The trace shape itself is static; only its reveal (dashoffset) responds
  // to scrolling, so this only needs to be computed once.
  const path = useMemo(() => {
    const offsets = Array.from({ length: POINT_COUNT }, (_, i) =>
      TRACE_AMPLITUDE * Math.sin((i / POINT_COUNT) * TRACE_FREQUENCY * Math.PI * 2)
    );
    return buildPath(offsets, TRACE_HEIGHT);
  }, []);

  useEffect(() => {
    if (fillRef.current) {
      setPathLength(fillRef.current.getTotalLength());
    }
  }, [path]);

  useEffect(() => {
    let frameId = null;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const fraction = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(Math.min(1, Math.max(0, fraction)));
      frameId = null;
    };

    const handleScroll = () => {
      if (frameId === null) frameId = requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateProgress();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="signal-line signal-line--trace" aria-hidden="true">
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${TRACE_HEIGHT}`}
        preserveAspectRatio="none"
        focusable="false"
      >
        <path d={path} className="signal-line__path signal-line__path--track" />
        <path
          ref={fillRef}
          d={path}
          className={`signal-line__path signal-line__path--fill ${
            prefersReducedMotion ? 'no-transition' : ''
          }`}
          style={{
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength - progress * pathLength,
          }}
        />
      </svg>
    </div>
  );
}

// The signature waveform motif. `variant="hero"` is the large, cursor-reactive
// version used once in the Hero. `variant="trace"` is the quiet scroll-progress
// line used elsewhere (e.g. under the navbar) — this is the only other place
// the motif appears, per the "concentrated, not diluted" design direction.
export default function SignalLine({ variant = 'trace' }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (variant === 'hero') {
    return <HeroSignalLine prefersReducedMotion={prefersReducedMotion} />;
  }
  return <TraceSignalLine prefersReducedMotion={prefersReducedMotion} />;
}
