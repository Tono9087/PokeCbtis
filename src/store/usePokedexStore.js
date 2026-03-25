import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePokedexStore = create(
  persist(
    (set, get) => ({
      favorites: [],
      searchQuery: '',
      filterType: '',
      filterRole: '',
      theme: 'dark',

      toggleFavorite: (id) => {
        const { favorites } = get();
        set({
          favorites: favorites.includes(id)
            ? favorites.filter((fid) => fid !== id)
            : [...favorites, id],
        });
      },

      isFavorite: (id) => get().favorites.includes(id),

      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterType: (type) => set({ filterType: type }),
      setFilterRole: (role) => set({ filterRole: role }),

      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
    }),
    {
      name: 'pokecbtis-storage',
    }
  )
);
