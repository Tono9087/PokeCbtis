import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { getAvatar } from '../utils/getAvatar';
import FavoriteButton from '../components/FavoriteButton';
import './DetailPage.css';

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: entry, isLoading, isError } = useQuery({
    queryKey: ['alumno', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plantel')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="detail-page-v2">
        <div className="detail-page-v2__status">
          <p>Consultando perfil técnico...</p>
        </div>
      </div>
    );
  }

  if (isError || !entry) {
    return (
      <div className="detail-page-v2">
        <div className="detail-page-v2__not-found">
          <p>Registro no encontrado o error en base de datos</p>
          <button className="detail-page-v2__back" onClick={() => navigate('/')}>
            Volver
          </button>
        </div>
      </div>
    );
  }

  const avatarUrl = getAvatar(entry);

  return (
    <div className="detail-page-v2">
      <div className="detail-page-v2__fav-wrap">
        <FavoriteButton id={entry.id} size="lg" />
      </div>

      <div className="detail-page-v2__image-wrap">
        <img src={avatarUrl} alt={entry.name || entry.nombre} className="detail-page-v2__image" />
      </div>

      <div className="detail-page-v2__info">
        <h1 className="detail-page-v2__name">{entry.nombre || entry.name}</h1>
        <span className="detail-page-v2__type">
          Tipo: {entry.especialidad || entry.type}
        </span>
        {entry.rol && (
          <span className="detail-page-v2__role">
            Rol: {entry.rol}
          </span>
        )}
        {entry.descripcion && (
          <p className="detail-page-v2__description">{entry.descripcion}</p>
        )}
      </div>

      <button className="detail-page-v2__back-absolute" onClick={() => navigate(-1)}>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="#fc2403">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
        </svg>
      </button>
    </div>
  );
}
