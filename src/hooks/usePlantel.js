import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export const usePlantel = (filtros = {}) => {
  const { rol, especialidad, busqueda } = filtros;

  return useQuery({
    queryKey: ['plantel', filtros],
    queryFn: async () => {
      let query = supabase.from('plantel').select('*');

      if (rol) {
        query = query.eq('rol', rol);
      }
      
      if (especialidad) {
        query = query.eq('especialidad', especialidad);
      }

      if (busqueda) {
        query = query.ilike('nombre', `%${busqueda}%`);
      }

      const { data, error } = await query.order('id', { ascending: true });

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 min
  });
};

export const useAlumno = (id) => {
  return useQuery({
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
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
};
