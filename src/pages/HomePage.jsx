import { useMemo } from 'react';
import { usePokedexStore } from '../store/usePokedexStore';
import { usePlantel } from '../hooks/usePlantel';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import PokeCard from '../components/PokeCard';
import './HomePage.css';

export default function HomePage() {
  const searchQuery = usePokedexStore((s) => s.searchQuery);
  const filterType = usePokedexStore((s) => s.filterType);
  const filterRole = usePokedexStore((s) => s.filterRole);

  const filtros = {
    busqueda: searchQuery,
    especialidad: filterType,
    rol: filterRole,
  };

  const { data: entries, isLoading, isError, error } = usePlantel(filtros);

  return (
    <div className="home-page-v2">
      <div className="home-page-v2__controls">
        <SearchBar />
        <FilterBar />
      </div>

      <div className="home-page-v2__grid">
        {isLoading && (
          <div className="home-page-v2__status">
            <span className="home-page-v2__spinner">🌀</span>
            <p>Capturando datos del plantel...</p>
          </div>
        )}

        {isError && (
          <div className="home-page-v2__status home-page-v2__status--error">
            <p>Error de conexión: {error?.message || 'No se pudo conectar con Supabase'}</p>
          </div>
        )}

        {entries && entries.length > 0 ? (
          entries.map((entry) => (
            <PokeCard key={entry.id} entry={entry} />
          ))
        ) : (
          !isLoading && entries && (
            <div className="home-page-v2__empty">
              No se encontraron resultados
            </div>
          )
        )}
      </div>
    </div>
  );
}
