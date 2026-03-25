import { usePokedexStore } from '../store/usePokedexStore';
import './SearchBar.css';

export default function SearchBar() {
  const searchQuery = usePokedexStore((s) => s.searchQuery);
  const setSearchQuery = usePokedexStore((s) => s.setSearchQuery);

  return (
    <div className="search-bar">
      <svg className="search-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        className="search-bar__input"
        placeholder="Buscar por nombre..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <button className="search-bar__clear" onClick={() => setSearchQuery('')} aria-label="Limpiar búsqueda">
          ✕
        </button>
      )}
    </div>
  );
}
