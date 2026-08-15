import { useEffect, useMemo, useRef, useState } from 'react';
import usePrefersReducedMotion from '../../../hooks/usePrefersReducedMotion';
import './SignalLine.css';

const POINT_COUNT = 24;
const VIEW_WIDTH = 1000;
const TRACE_HEIGHT = 32;
const TRACE_AMPLITUDE = 6;
const TRACE_FREQUENCY = 5;

// Builds a jagged "oscilloscope" path from an array of y-offsets, centered
// vertically in a viewBox of the given height.
function buildPath(offsets, height) {
  const step = VIEW_WIDTH / (offsets.length - 1);
  const midY = height / 2;
  return offsets
    .map((offset, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${midY + offset}`)
    .join(' ');
}

// A quiet scroll-progress line, used under the navbar as the site's one
// remaining nod to the original "signal" motif — the large cursor-reactive
// hero waveform was retired in favor of the cinematic photo backdrop.
export default function SignalLine() {
  const prefersReducedMotion = usePrefersReducedMotion();
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
    <div className="signal-line" aria-hidden="true">
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
