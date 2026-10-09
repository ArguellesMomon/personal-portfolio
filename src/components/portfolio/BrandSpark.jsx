// Geometry keeps this decorative mark identical across fonts and emoji keyboards.
export const sparkPath = 'M20 2v36M2 20h36M7.3 7.3l25.4 25.4M7.3 32.7L32.7 7.3';

export default function BrandSpark() {
  return (
    <svg className="brand-spark" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <path d={sparkPath} fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}
