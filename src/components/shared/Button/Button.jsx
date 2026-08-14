import './Button.css';

// Shared button used for every call-to-action site-wide, so no section
// invents its own button style. `as="a"` renders an anchor styled the same
// way, for links that aren't form actions (e.g. resume download, external links).
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

  return (
    <Component className={classes} {...props}>
      {children}
      {Icon && <Icon className="btn__icon" size={18} aria-hidden="true" />}
    </Component>
  );
}
