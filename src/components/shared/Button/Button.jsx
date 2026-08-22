import useMagnetic from '../../../hooks/useMagnetic';
import './Button.css';

// Shared button used for every call-to-action site-wide, so no section
// invents its own button style. `as="a"` renders an anchor styled the same
// way, for links that aren't form actions (e.g. resume download, external links).
//
// Every Button gets the subtle magnetic-hover pull (see useMagnetic) — it's
// a no-op on touch devices and under reduced-motion, and stays gentle
// enough (8px max) that it reads as polish on the ones it's not shown on
// too rather than needing a prop to opt in per-instance.
export default function Button({
  children,
  variant = 'primary',
  as = 'button',
  icon: Icon,
  className = '',
  ...props
}) {
  const Component = as;
  const classes = `btn btn--${variant} ${className}`.trim();
  const magneticRef = useMagnetic();

  return (
    <Component ref={magneticRef} className={classes} {...props}>
      {children}
      {Icon && <Icon className="btn__icon" size={18} aria-hidden="true" />}
    </Component>
  );
}
