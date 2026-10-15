export default function DepthSurface({ children, variant = 'card', strength = 4, className = '' }) {
  return (
    <div
      className={`depth-scene depth-${variant} ${className}`}
      data-depth={variant}
      data-depth-strength={strength}
    >
      {children}
    </div>
  );
}
