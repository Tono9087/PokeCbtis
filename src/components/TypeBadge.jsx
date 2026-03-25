import { TYPE_COLORS } from '../data/pokedex';
import './TypeBadge.css';

export default function TypeBadge({ type, size = 'sm' }) {
  const colors = TYPE_COLORS[type] || { bg: '#6b7280', light: '#f3f4f6', text: '#374151' };

  return (
    <span
      className={`type-badge type-badge--${size}`}
      style={{
        '--badge-bg': colors.bg,
        '--badge-light': colors.light,
        '--badge-text': colors.text,
      }}
    >
      {type}
    </span>
  );
}
