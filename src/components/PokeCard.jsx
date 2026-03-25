import { Link } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';
import { getAvatar } from '../utils/getAvatar';
import './PokeCard.css';

export default function PokeCard({ entry }) {
  const avatarUrl = getAvatar(entry);

  return (
    <Link to={`/detail/${entry.id}`} className="poke-card-v2">
      <div className="poke-card-v2__fav-wrap">
        <FavoriteButton id={entry.id} size="sm" />
      </div>

      <div className="poke-card-v2__image-wrap">
        <img src={avatarUrl} alt={entry.nombre || entry.name} className="poke-card-v2__image" loading="lazy" />
      </div>

      <div className="poke-card-v2__info">
        <span className="poke-card-v2__id">#{entry.id}</span>
        <h3 className="poke-card-v2__name">{entry.nombre || entry.name}</h3>
        <span className="poke-card-v2__type">
          {entry.especialidad || entry.type}
        </span>
      </div>
    </Link>
  );
}
