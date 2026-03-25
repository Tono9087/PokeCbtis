import { usePokedexStore } from '../store/usePokedexStore';
import './FavoriteButton.css';

export default function FavoriteButton({ id, size = 'md' }) {
  const toggleFavorite = usePokedexStore((s) => s.toggleFavorite);
  const isFavorite = usePokedexStore((s) => s.favorites.includes(id));

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleFavorite(id);
  };

  return (
    <button
      className={`star-btn star-btn--${size} ${isFavorite ? 'star-btn--active' : ''}`}
      onClick={handleClick}
      aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      <svg viewBox="0 0 24 24" className="star-btn__icon">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
      </svg>
    </button>
  );
}
