import { usePokedexStore } from '../store/usePokedexStore';
import { TYPES, ROLES } from '../data/pokedex';
import './FilterBar.css';

export default function FilterBar() {
  const filterType = usePokedexStore((s) => s.filterType);
  const filterRole = usePokedexStore((s) => s.filterRole);
  const setFilterType = usePokedexStore((s) => s.setFilterType);
  const setFilterRole = usePokedexStore((s) => s.setFilterRole);

  const types = Object.values(TYPES);
  const roles = Object.values(ROLES);

  return (
    <div className="filter-bar">
      <div className="filter-bar__group">
        <label className="filter-bar__label">Tipo</label>
        <div className="filter-bar__chips">
          <button
            className={`filter-chip ${!filterType ? 'filter-chip--active' : ''}`}
            onClick={() => setFilterType('')}
          >
            Todos
          </button>
          {types.map((t) => (
            <button
              key={t}
              className={`filter-chip ${filterType === t ? 'filter-chip--active' : ''}`}
              onClick={() => setFilterType(filterType === t ? '' : t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-bar__group">
        <label className="filter-bar__label">Rol</label>
        <div className="filter-bar__chips">
          <button
            className={`filter-chip ${!filterRole ? 'filter-chip--active' : ''}`}
            onClick={() => setFilterRole('')}
          >
            Todos
          </button>
          {roles.map((r) => (
            <button
              key={r}
              className={`filter-chip ${filterRole === r ? 'filter-chip--active' : ''}`}
              onClick={() => setFilterRole(filterRole === r ? '' : r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
