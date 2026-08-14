import { Sun, Moon } from 'lucide-react';
import './ThemeToggle.css';

// Icon-only toggle. The label describes the action (what tapping it will
// switch to), and updates with the current state so it stays accurate to
// screen reader users.
export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={label}
    >
      {isDark ? (
        <Sun size={20} strokeWidth={1.75} aria-hidden="true" />
      ) : (
        <Moon size={20} strokeWidth={1.75} aria-hidden="true" />
      )}
    </button>
  );
}
