export const getAvatar = (alumno) => {
  if (!alumno) return '';

  if (alumno.imagen_url) {
    return alumno.imagen_url;
  }

  // Fallback to official artwork from PokeAPI based on id
  // We use (id % 1025) + 1 to ensure it maps to one of the 1025 pokemons
  const pokemonId = (alumno.id % 1025) + 1;
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
};
