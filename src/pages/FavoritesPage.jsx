import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { usePokedexStore } from '../store/usePokedexStore';
import PokeCard from '../components/PokeCard';
import './FavoritesPage.css';

export default function FavoritesPage() {
  const favoritesIds = usePokedexStore((s) => s.favorites);

  const { data: favoriteEntries, isLoading, isError } = useQuery({
    queryKey: ['favorites-list', favoritesIds],
    queryFn: async () => {
      if (favoritesIds.length === 0) return [];

      const { data, error } = await supabase
        .from('plantel')
        .select('*')
        .in('id', favoritesIds);

      if (error) throw error;
      return data;
    },
    // We want this query to run even if the collection is empty [but empty list logic handles it]
    staleTime: 5 * 60 * 1000,
    enabled: favoritesIds.length >= 0,
  });

  if (favoritesIds.length === 0) {
    return (
      <div className="favorites-page-v2">
        <div className="favorites-page-v2__empty">
          <p className="favorites-page-v2__empty-text">No tienes favoritos aún</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="favorites-page-v2">
        <div className="favorites-page-v2__status">
          <p>Cargando favoritos...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="favorites-page-v2">
        <div className="favorites-page-v2__status favorites-page-v2__status--error">
          <p>No se pudieron cargar tus favoritos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page-v2">
      <div className="favorites-page-v2__grid">
        {favoriteEntries && favoriteEntries.map((entry) => (
          <PokeCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}
