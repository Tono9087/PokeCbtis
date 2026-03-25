import { NavLink } from 'react-router-dom';
import { usePokedexStore } from '../store/usePokedexStore';
import './Navbar.css';

export default function Navbar() {
  const favCount = usePokedexStore((s) => s.favorites.length);

  return (
    <nav className="navbar-bottom">
      <NavLink
        to="/"
        end
        className={({ isActive }) => `navbar-bottom__link ${isActive ? 'navbar-bottom__link--active' : ''}`}
      >
        <svg viewBox="0 0 24 24" className="navbar-bottom__icon" fill="currentColor">
          <path d="M4 14h6v6H4v-6zm0-7h6v6H4V7zm7 7h6v6h-6v-6zm0-7h6v6h-6V7zm7 7h6v6h-6v-6zm0-7h6v6h-6V7z" />
        </svg>
        <span className="navbar-bottom__label">Home</span>
      </NavLink>

      <NavLink
        to="/favorites"
        className={({ isActive }) => `navbar-bottom__link ${isActive ? 'navbar-bottom__link--active' : ''}`}
      >
        <svg viewBox="0 0 24 24" className="navbar-bottom__icon" fill="currentColor" stroke="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <span className="navbar-bottom__label">Favorites</span>
        {favCount > 0 && <span className="navbar-bottom__badge">{favCount}</span>}
      </NavLink>

      <div className="navbar-bottom__theme-toggle">
        <ThemeToggle />
      </div>

    </nav>
  );
}

function ThemeToggle() {
  const theme = usePokedexStore((s) => s.theme);
  const toggleTheme = usePokedexStore((s) => s.toggleTheme);
  
  return (
    <button className="navbar-bottom__theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'dark' ? '🌞' : '🌙'}
    </button>
  );
}
